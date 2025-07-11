'use client';

import type {
  AgentConfig,
  ConversationCallbacks,
  ConversationMessage
} from '@/lib/types/conversation';
import { logger } from '@/lib/utils/logger';
import { useConversation } from '@elevenlabs/react';
import { nanoid } from 'nanoid';
import { useCallback, useEffect, useState } from 'react';

interface UseConversationManagerOptions extends ConversationCallbacks {
  defaultAgent?: AgentConfig;
  persistSession?: boolean;
}

export function useConversationManager(
  agents: AgentConfig[],
  options: UseConversationManagerOptions = {}
) {
  const {
    defaultAgent = agents[0],
    persistSession = true,
    onConnect,
    onDisconnect,
    onMessage,
    onError,
    onStatusChange,
  } = options;

  // State management
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [currentAgent, setCurrentAgent] = useState<AgentConfig>(defaultAgent);
  const [sessionToken, setSessionToken] = useState<string>('');
  const [error, setError] = useState<Error | undefined>(undefined);

  // Initialize session token
  useEffect(() => {
    const storageKey = 'sessionToken';
    const existingToken = persistSession
      ? localStorage.getItem(storageKey)
      : null;

    const token = existingToken || nanoid();

    if (persistSession && !existingToken) {
      localStorage.setItem(storageKey, token);
    }

    setSessionToken(token);
    logger.info('Session initialized', {
      token: token.slice(0, 8) + '...',
      persisted: persistSession
    });
  }, [persistSession]);

  // ElevenLabs conversation hook
  const conversation = useConversation({
    onConnect: () => {
      logger.info('Conversation connected', {
        agent: currentAgent.id,
        sessionId: sessionToken.slice(0, 8) + '...'
      });
      setError(undefined); // Clear any previous errors
      onConnect?.();
      onStatusChange?.('connected');
    },

    onDisconnect: () => {
      logger.info('Conversation disconnected', {
        agent: currentAgent.id
      });
      onDisconnect?.('connection_lost');
      onStatusChange?.('disconnected');
    },

    onMessage: (message) => {
      const conversationMessage: ConversationMessage = {
        type: message.source === 'user' ? 'user' : 'agent',
        message: message.message,
        timestamp: new Date(),
        metadata: {
          agentId: currentAgent.id,
          source: message.source,
        },
      };

      logger.debug('Message received', {
        type: conversationMessage.type,
        length: conversationMessage.message.length,
        agent: currentAgent.id
      });

      setMessages(prev => [...prev, conversationMessage]);
      onMessage?.(conversationMessage);

      // Save to database
      saveMessageToDatabase(conversationMessage, sessionToken, currentAgent);
    },

    onError: (error: unknown) => {
      const errorObj = error instanceof Error
        ? error
        : new Error(typeof error === 'string' ? error : 'Unknown error');

      logger.error('Conversation error', {
        agent: currentAgent.id
      }, errorObj);

      setError(errorObj);
      onError?.(errorObj);
      onStatusChange?.('error');
    },
  });

  // Save message to database
  const saveMessageToDatabase = async (
    message: ConversationMessage,
    token: string,
    agent: AgentConfig
  ) => {
    if (!token) return;

    try {
      const response = await fetch('/api/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message.message,
          isUserMessage: message.type === 'user',
          sessionToken: token,
          agentPersonality: agent.name,
          metadata: {
            ...message.metadata,
            timestamp: message.timestamp.toISOString(),
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to save message: ${response.statusText}`);
      }
    } catch (error) {
      logger.error('Failed to save message', {
        agent: agent.id
      }, error as Error);
    }
  };

  // Start conversation
  const startConversation = useCallback(async () => {
    if (conversation.status === 'connected' || conversation.status === 'connecting') {
      logger.warn('Conversation already active', { status: conversation.status });
      return;
    }

    try {
      logger.info('Starting conversation', {
        agent: currentAgent.id,
        agentElevenLabsId: currentAgent.elevenlabsAgentId
      });

      // Request microphone permission
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Clean up the stream immediately - ElevenLabs will request its own
        stream.getTracks().forEach(track => track.stop());
      } catch {
        throw new Error('Microphone permission denied. Please allow microphone access and try again.');
      }

      // Validate agent ID exists
      if (!currentAgent.elevenlabsAgentId) {
        throw new Error(`No ElevenLabs agent ID configured for ${currentAgent.name}`);
      }

      // Start ElevenLabs session
      await conversation.startSession({
        agentId: currentAgent.elevenlabsAgentId,
        dynamicVariables: {
          session_token: sessionToken,
          agent_name: currentAgent.name,
          timestamp: new Date().toISOString(),
        },
      });

      logger.info('Conversation started successfully', {
        agent: currentAgent.id
      });
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error('Failed to start conversation');
      logger.error('Failed to start conversation', {
        agent: currentAgent.id
      }, errorObj);

      // Set user-friendly error message
      const userFriendlyError = new Error(logger.getUserFriendlyError(errorObj));
      userFriendlyError.cause = errorObj;

      setError(userFriendlyError);
      onError?.(userFriendlyError);
      onStatusChange?.('error');
    }
  }, [conversation, currentAgent, sessionToken, onError, onStatusChange]);

  // Stop conversation
  const stopConversation = useCallback(async () => {
    if (conversation.status !== 'connected') {
      logger.warn('No active conversation to stop', { status: conversation.status });
      return;
    }

    try {
      await conversation.endSession();
      setMessages([]);
      logger.info('Conversation ended', {
        agent: currentAgent.id
      });
    } catch (error) {
      logger.error('Failed to stop conversation', {
        agent: currentAgent.id
      }, error as Error);
    }
  }, [conversation, currentAgent]);

  // Switch agent
  const switchAgent = useCallback(async (newAgent: AgentConfig) => {
    if (newAgent.id === currentAgent.id) {
      logger.debug('Agent already selected', { agentId: newAgent.id });
      return;
    }

    logger.info('Switching agent', {
      from: currentAgent.id,
      to: newAgent.id,
    });

    try {
      // End current conversation if active
      if (conversation.status === 'connected') {
        await conversation.endSession();
        // Wait for clean disconnect
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      // Update agent and clear messages
      setCurrentAgent(newAgent);
      setMessages([]);
      setError(undefined); // Clear error on agent switch
    } catch (error) {
      logger.error('Failed to switch agent', {
        from: currentAgent.id,
        to: newAgent.id
      }, error as Error);
    }
  }, [conversation, currentAgent]);

  return {
    // State
    status: conversation.status || 'idle',
    messages,
    currentAgent,
    sessionToken,
    error,
    isConnected: conversation.status === 'connected',
    isConnecting: conversation.status === 'connecting',

    // Controls
    startConversation,
    stopConversation,
    switchAgent,

    // Utilities
    clearMessages: () => setMessages([]),
    getMessageCount: () => messages.length,
  };
}