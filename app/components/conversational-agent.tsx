'use client';

import { AGENTS } from '@/lib/constants/agents';
import { useConversation } from '@elevenlabs/react';
import { nanoid } from 'nanoid';
import { useCallback, useEffect, useState } from 'react';

interface ConversationData {
  message: string;
  isUserMessage: boolean;
  timestamp: Date;
  sessionToken: string;
}

interface ConversationMessage {
  type: 'user_transcript' | 'agent_response' | 'tool_call';
  message: string;
  timestamp: Date;
}

export default function ConversationalAgent() {
  const [sessionToken, setSessionToken] = useState<string>('');
  const [conversationHistory, setConversationHistory] = useState<ConversationData[]>([]);
  const [currentConversation, setCurrentConversation] = useState<ConversationMessage[]>([]);
  const [isPermissionGranted, setIsPermissionGranted] = useState<boolean>(false);
  // Use the first agent as default
  const [currentAgent] = useState(AGENTS[0]);

  useEffect(() => {
    // Initialize session token
    const token = localStorage.getItem('sessionToken') || nanoid();
    setSessionToken(token);
    localStorage.setItem('sessionToken', token);

    // Load conversation history
    loadConversationHistory(token);
  }, []);

  const loadConversationHistory = async (token: string) => {
    try {
      const response = await fetch(`/api/conversation?sessionToken=${token}&limit=20`);
      const data = await response.json();
      if (data.success) {
        setConversationHistory(data.history);
      }
    } catch {
      // Error loading conversation history
    }
  };

  const saveConversation = async (message: string, isUserMessage: boolean) => {
    try {
      const response = await fetch('/api/conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          isUserMessage,
          sessionToken,
          agentPersonality: currentAgent.name,
          metadata: {
            timestamp: new Date().toISOString(),
            platform: 'web',
            mcpEnabled: true,
            agentId: currentAgent.elevenlabsAgentId
          }
        }),
      });

      const data = await response.json();
      if (data.success) {
        setConversationHistory(prev => [...prev, {
          message,
          isUserMessage,
          timestamp: new Date(),
          sessionToken
        }]);
      }
    } catch {
      // Error saving conversation
    }
  };

  const requestMicrophonePermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsPermissionGranted(true);
      return true;
    } catch {
      setIsPermissionGranted(false);
      return false;
    }
  };

  const conversation = useConversation({
    onConnect: () => {
      // Connection established
    },
    onDisconnect: () => {
      // Connection closed
    },
    onMessage: (message) => {

      // Handle all messages generically since we don't know the exact Role enum values
      const messageText = message.message;
      const messageSource = message.source;
      const isUserMessage = messageSource === 'user';

      if (messageText) {
        setCurrentConversation(prev => [...prev, {
          type: isUserMessage ? 'user_transcript' : 'agent_response',
          message: messageText,
          timestamp: new Date()
        }]);
        saveConversation(messageText, isUserMessage);
      }
    },
    onError: () => {
      // Handle ElevenLabs conversation error
    }
  });

  const startConversation = useCallback(async () => {
    try {
      const hasPermission = await requestMicrophonePermission();
      if (!hasPermission) {
        alert('Microphone permission is required for voice conversation');
        return;
      }

      // Check if agent has a valid ElevenLabs agent ID
      if (!currentAgent.elevenlabsAgentId) {
        console.error('No ElevenLabs agent ID configured for', currentAgent.name);
        alert(`Agent ${currentAgent.displayName} is not properly configured. Please check the setup.`);
        return;
      }

      await conversation.startSession({
        agentId: currentAgent.elevenlabsAgentId,
        dynamicVariables: {
          sessionToken,
          databaseEnabled: 'true',
          userPlatform: 'web',
          mcpServerUrl: 'https://mcp.neon.tech/sse'
        }
      });
    } catch (error) {
      console.error('Failed to start conversation:', error);
      alert('Failed to start conversation. Please check your connection and try again.');
    }
  }, [conversation, sessionToken, currentAgent]);

  const stopConversation = useCallback(async () => {
    try {
      await conversation.endSession();
      setCurrentConversation([]);
    } catch {
      // Failed to stop conversation
    }
  }, [conversation]);

  const ConnectionIndicator = () => (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${
        conversation.status === 'connected' ? 'bg-green-400' : 'bg-gray-500'
      }`} />
      <span className="text-xs text-gray-400 font-mono">
        {conversation.status === 'connected' ? 'connected' : 'disconnected'}
      </span>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Agent Info Panel */}
      <div className="bg-black/90 text-gray-100 rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-mono font-bold mb-2">{currentAgent.displayName}</h2>
        <p className="text-sm text-gray-400 font-mono mb-4">
          {currentAgent.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500 font-mono space-y-1">
            <p>session: {sessionToken.slice(0, 8)}...</p>
            <p>conversations: {conversationHistory.length}</p>
            <p>agent: {currentAgent.name}</p>
          </div>
          <ConnectionIndicator />
        </div>
      </div>

      {/* Conversation History */}
      {conversationHistory.length > 0 && (
        <div className="bg-gray-900 rounded-lg p-4 mb-6 max-h-60 overflow-y-auto">
          <h3 className="text-lg font-mono font-bold mb-3 text-gray-100">conversation history</h3>
          <div className="space-y-2">
            {conversationHistory.slice(-5).map((conv, index) => (
              <div key={index} className="text-sm font-mono">
                <span className={`font-bold ${conv.isUserMessage ? 'text-blue-400' : 'text-green-400'}`}>
                  {conv.isUserMessage ? 'user' : 'agent'}:
                </span>
                <span className="text-gray-300 ml-2">{conv.message.slice(0, 100)}...</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current Conversation */}
      {currentConversation.length > 0 && (
        <div className="bg-stone-800 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-mono font-bold mb-3 text-gray-100">current conversation</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {currentConversation.map((msg, index) => (
              <div key={index} className="text-sm font-mono">
                <span className={`font-bold ${
                  msg.type === 'user_transcript' ? 'text-blue-400' : 'text-green-400'
                }`}>
                  {msg.type === 'user_transcript' ? 'you' : 'agent'}:
                </span>
                <span className="text-gray-300 ml-2">{msg.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Control Panel */}
      <div className="bg-stone-800 rounded-lg p-6">
        <div className="flex flex-col items-center space-y-6">
          {/* Voice Button */}
          <button
            onClick={conversation.status === 'disconnected' ? startConversation : stopConversation}
            disabled={conversation.status === 'connecting'}
            className={`
              w-24 h-24 rounded-full transition-all duration-300 font-mono text-sm
              ${conversation.status === 'connected'
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
              }
              ${conversation.status === 'connecting' ? 'opacity-50 cursor-not-allowed' : ''}
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {conversation.status === 'connecting' ? 'connecting...' :
             conversation.status === 'connected' ? 'end call' : 'start call'}
          </button>

          {/* Status Display */}
          <div className="text-center">
            <h3 className="text-xl font-mono font-bold text-gray-100 mb-2">
              {conversation.status === 'connected' ? `talking with ${currentAgent.displayName}` : 'ready to connect'}
            </h3>
            <p className="text-sm text-gray-400 font-mono mb-4">
              {conversation.status === 'connected'
                ? currentAgent.description
                : `click to start conversing with ${currentAgent.displayName}`
              }
            </p>
          </div>

          {/* Agent Features */}
          <div className="text-xs text-gray-500 font-mono text-center space-y-1">
            <p>⚡ real-time voice interaction</p>
            <p>🎭 unique personality: {currentAgent.name}</p>
            <p>🎤 voice: custom elevenlabs voice</p>
            <p>🧠 powered by advanced llm</p>
          </div>

          {/* Permission Status */}
          {!isPermissionGranted && (
            <div className="text-center bg-gray-900 rounded-lg p-4 max-w-md">
              <p className="text-sm text-gray-300 font-mono">
                microphone access required for voice conversation
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}