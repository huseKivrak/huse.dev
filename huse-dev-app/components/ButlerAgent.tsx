'use client';

import { useConversation } from '@elevenlabs/react';
import { useCallback, useEffect, useState } from 'react';

type AgentMode = 'text' | 'voice';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

// Configuration interface for customization
interface ButlerAgentConfig {
  // Agent settings
  agentId?: string;
  agentName?: string;

  // UI customization
  theme?: 'dark' | 'light' | 'custom';
  customTheme?: {
    background?: string;
    foreground?: string;
    accent?: string;
    glass?: string;
  };

  // Behavior customization
  initialMessage?: string;
  placeholder?: string;
  showTimestamps?: boolean;
  showMode?: boolean;

  // Response customization
  responseGenerator?: (input: string) => Promise<string> | string;
  responseDelay?: {
    min: number;
    max: number;
  };

  // Features
  enableVoice?: boolean;
  enableText?: boolean;
  persistMessages?: boolean;
  maxMessages?: number;

  // Callbacks
  onMessage?: (message: Message) => void;
  onError?: (error: Error) => void;
  onModeChange?: (mode: AgentMode) => void;
  onReset?: () => void;
}

interface ButlerAgentProps {
  config?: ButlerAgentConfig;
  className?: string;
}

// Type definitions for ElevenLabs events
interface ConversationMessage {
  message?: string;
  [key: string]: unknown;
}

interface ConversationMode {
  mode: 'listening' | 'speaking' | 'idle';
  [key: string]: unknown;
}

// Default configuration
const defaultConfig: ButlerAgentConfig = {
  agentName: 'butler',
  theme: 'dark',
  initialMessage: 'how can i assist you today?',
  placeholder: 'type your message...',
  showTimestamps: true,
  showMode: true,
  enableVoice: true,
  enableText: true,
  responseDelay: { min: 800, max: 1800 },
  maxMessages: 100,
};

export default function ButlerAgent({
  config = {},
  className = ''
}: ButlerAgentProps) {
  // Merge config with defaults
  const finalConfig = { ...defaultConfig, ...config };
  const {
    agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID,
    agentName,
    theme,
    customTheme,
    initialMessage,
    placeholder,
    showTimestamps,
    showMode,
    responseGenerator,
    responseDelay,
    enableVoice,
    enableText,
    persistMessages,
    maxMessages,
    onMessage,
    onError,
    onModeChange,
    onReset,
  } = finalConfig;

  const [mode, setMode] = useState<AgentMode | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  // Load persisted messages if enabled
  useEffect(() => {
    if (persistMessages) {
      const saved = localStorage.getItem('butler-messages');
      if (saved) {
        setMessages(JSON.parse(saved));
      }
    }
  }, [persistMessages]);

  // Save messages when they change
  useEffect(() => {
    if (persistMessages && messages.length > 0) {
      localStorage.setItem('butler-messages', JSON.stringify(messages));
    }
  }, [messages, persistMessages]);

  const conversation = useConversation({
    onConnect: () => {
      setIsConnected(true);
    },
    onDisconnect: () => {
      setIsConnected(false);
      setIsListening(false);
    },
    onMessage: (message: string | ConversationMessage) => {
      const messageText = typeof message === 'string'
        ? message
        : (message?.message || String(message));
      const newMessage: Message = {
        role: 'assistant',
        content: messageText,
        timestamp: Date.now()
      };
      setMessages(prev => {
        const updated = [...prev, newMessage];
        // Limit messages if maxMessages is set
        if (maxMessages && updated.length > maxMessages) {
          return updated.slice(-maxMessages);
        }
        return updated;
      });
      onMessage?.(newMessage);
    },
    onError: (error: string) => {
      console.error('connection error:', error);
      onError?.(new Error(error));
    },
    onModeChange: (mode: ConversationMode) => {
      setIsListening(mode.mode === 'listening');
    },
  });

  const startConversation = useCallback(async (selectedMode: AgentMode) => {
    setMode(selectedMode);
    onModeChange?.(selectedMode);

    if (selectedMode === 'voice' && agentId) {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        await conversation.startSession({ agentId });
      } catch (error) {
        console.error('failed to start voice conversation:', error);
        onError?.(error as Error);
      }
    } else {
      // For text mode, show initial message
      setMessages([{
        role: 'assistant',
        content: initialMessage!,
        timestamp: Date.now()
      }]);
    }
  }, [conversation, agentId, initialMessage, onError, onModeChange]);

  const sendTextMessage = useCallback(async () => {
    if (!textInput.trim()) return;

    const userMessage = textInput.trim();
    const userMsg: Message = {
      role: 'user',
      content: userMessage,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMsg]);
    onMessage?.(userMsg);
    setTextInput('');
    setIsThinking(true);

    try {
      let response: string;

      // Use custom response generator if provided
      if (responseGenerator) {
        response = await responseGenerator(userMessage);
      } else {
        // Use API endpoint
        const res = await fetch('/api/elevenlabs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'generateResponse',
            data: { input: userMessage }
          })
        });

        const data = await res.json();
        response = data.response;
      }

      // Simulate thinking time for natural feel
      const delay = Math.random() * (responseDelay!.max - responseDelay!.min) + responseDelay!.min;
      setTimeout(() => {
        const assistantMsg: Message = {
          role: 'assistant',
          content: response,
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, assistantMsg]);
        onMessage?.(assistantMsg);
        setIsThinking(false);
      }, delay);
    } catch (error) {
      console.error('Failed to get response:', error);
      onError?.(error as Error);
      setIsThinking(false);
    }
  }, [textInput, responseGenerator, responseDelay, onMessage, onError]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendTextMessage();
    }
  }, [sendTextMessage]);

  const reset = useCallback(async () => {
    if (isConnected) {
      await conversation.endSession();
    }
    setMessages([]);
    setTextInput('');
    setMode(null);
    setIsThinking(false);
    if (persistMessages) {
      localStorage.removeItem('butler-messages');
    }
    onReset?.();
  }, [conversation, isConnected, persistMessages, onReset]);

  // Theme classes
  const themeClasses = theme === 'custom' && customTheme
    ? {
        bg: customTheme.background || 'bg-black',
        fg: customTheme.foreground || 'text-stone-100',
        accent: customTheme.accent || 'text-stone-400',
        glass: customTheme.glass || 'glass',
      }
    : {
        bg: 'bg-black',
        fg: 'text-stone-100',
        accent: 'text-stone-400',
        glass: 'glass',
      };

  if (!mode) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen p-8 ${className}`}>
        <div className="text-center max-w-2xl">
          <h1 className="text-6xl font-display mb-4 text-gradient tracking-tight">
            {agentName}
          </h1>

          <p className="text-stone-400 text-lg mb-12 font-mono tracking-wide">
            digital assistant
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {enableText && (
              <button
                onClick={() => startConversation('text')}
                className="px-8 py-4 glass hover-lift text-stone-100 font-mono text-sm tracking-wide rounded-lg transition-all duration-300 hover:bg-stone-800/20"
              >
                text interface
              </button>
            )}
            {enableVoice && (
              <button
                onClick={() => startConversation('voice')}
                className="px-8 py-4 glass hover-lift text-stone-100 font-mono text-sm tracking-wide rounded-lg transition-all duration-300 hover:bg-stone-800/20"
              >
                voice interface
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col min-h-screen ${className}`}>
      {/* Header */}
      <div className="glass border-b border-stone-800/50 px-6 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-mono text-stone-100 tracking-wide">
              {agentName}
            </h2>
            {showMode && (
              <div className="text-stone-500 text-sm font-mono">
                {mode} mode
              </div>
            )}
          </div>
          <button
            onClick={reset}
            className="text-stone-400 hover:text-stone-100 font-mono text-sm tracking-wide transition-colors"
          >
            reset
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-2xl px-4 py-3 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-stone-800/50 text-stone-100 border border-stone-700/50'
                  : 'bg-stone-900/50 text-stone-200 border border-stone-800/50'
              }`}>
                <p className="font-mono text-sm leading-relaxed">{msg.content}</p>
                {showTimestamps && (
                  <div className="text-xs text-stone-500 mt-2 font-mono">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex justify-start">
              <div className="max-w-2xl px-4 py-3 rounded-lg bg-stone-900/50 text-stone-400 border border-stone-800/50">
                <p className="font-mono text-sm">thinking...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      {mode === 'text' && (
        <div className="glass border-t border-stone-800/50 px-6 py-4">
          <div className="max-w-4xl mx-auto flex space-x-4">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              className="flex-1 px-4 py-3 bg-stone-900/50 border border-stone-800/50 rounded-lg text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-600 focus:border-transparent font-mono text-sm"
              autoFocus
            />
            <button
              onClick={sendTextMessage}
              disabled={!textInput.trim() || isThinking}
              className="px-6 py-3 bg-stone-800/50 hover:bg-stone-700/50 disabled:bg-stone-900/30 disabled:cursor-not-allowed text-stone-100 font-mono text-sm rounded-lg transition-colors duration-200 border border-stone-700/50"
            >
              send
            </button>
          </div>
        </div>
      )}

      {/* Voice Interface */}
      {mode === 'voice' && (
        <div className="glass border-t border-stone-800/50 px-6 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full border-2 mb-4 ${
              isListening ? 'border-stone-400 bg-stone-800/50' : 'border-stone-600 bg-stone-900/50'
            }`}>
              <div className={`w-3 h-3 rounded-full ${
                isListening ? 'bg-stone-400 animate-pulse' : 'bg-stone-600'
              }`}></div>
            </div>
            <p className="text-stone-400 font-mono text-sm">
              {isListening ? 'listening...' : 'processing...'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}