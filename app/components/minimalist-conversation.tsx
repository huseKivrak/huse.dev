'use client';

import { AGENTS, type AgentConfig } from '@/lib/constants/agents';
import { useConversation } from '@elevenlabs/react';
import { nanoid } from 'nanoid';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import KeyboardHandler from './keyboard-handler';

interface ConversationMessage {
  type: 'user' | 'agent';
  message: string;
  timestamp: Date;
}

export default function MinimalistConversation() {
  const router = useRouter();
  const [sessionToken, setSessionToken] = useState<string>('');
  const [currentAgent, setCurrentAgent] = useState<AgentConfig>(AGENTS[0]);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize session
  useEffect(() => {
    const token = localStorage.getItem('sessionToken') || nanoid();
    setSessionToken(token);
    localStorage.setItem('sessionToken', token);
  }, []);

  const conversation = useConversation({
    onConnect: () => {
      setIsConnected(true);
      setIsSwitching(false);
    },
    onDisconnect: () => {
      setIsConnected(false);
    },
    onMessage: (message) => {
      const messageText = message.message;
      const isUserMessage = message.source === 'user';

      if (messageText) {
        setMessages(prev => [...prev, {
          type: isUserMessage ? 'user' : 'agent',
          message: messageText,
          timestamp: new Date()
        }]);

        // Save to database
        saveMessage(messageText, isUserMessage);
      }
    },
    onError: () => {
      setIsConnected(false);
      setIsSwitching(false);
    }
  });

  const saveMessage = async (message: string, isUserMessage: boolean) => {
    try {
      await fetch('/api/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          isUserMessage,
          sessionToken,
          agentPersonality: currentAgent.name,
          metadata: {
            agentId: currentAgent.id,
            voiceId: currentAgent.voiceId
          }
        }),
      });
    } catch {
      // Silent fail for message logging
    }
  };

  const switchAgent = useCallback(async (agent: AgentConfig) => {
    if (agent.id === currentAgent.id || isSwitching) return;

    setIsSwitching(true);

    // End current conversation if connected
    if (conversation.status === 'connected') {
      await conversation.endSession();
    }

    // Clear messages and switch agent
    setMessages([]);
    setCurrentAgent(agent);

    // Small delay to ensure clean disconnect
    setTimeout(() => {
      setIsSwitching(false);
    }, 500);
  }, [conversation, currentAgent, isSwitching]);

  const startConversation = useCallback(async () => {
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Use the hardcoded public agent ID
      const agentId = currentAgent.elevenlabsAgentId;

      await conversation.startSession({
        agentId,
        dynamicVariables: {
          session_token: sessionToken
        }
      });
    } catch (error) {
      console.error('Failed to start conversation:', error);
      alert('Failed to start conversation. Please check your microphone permissions.');
    }
  }, [conversation, sessionToken, currentAgent]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
    setMessages([]);
  }, [conversation]);

  // Keyboard shortcut handlers
  const handleNextAgent = useCallback(() => {
    const currentIndex = AGENTS.findIndex(a => a.id === currentAgent.id);
    const nextIndex = (currentIndex + 1) % AGENTS.length;
    switchAgent(AGENTS[nextIndex]);
  }, [currentAgent, switchAgent]);

  const handlePreviousAgent = useCallback(() => {
    const currentIndex = AGENTS.findIndex(a => a.id === currentAgent.id);
    const prevIndex = currentIndex === 0 ? AGENTS.length - 1 : currentIndex - 1;
    switchAgent(AGENTS[prevIndex]);
  }, [currentAgent, switchAgent]);

  const handleToggleDevMode = useCallback(() => {
    router.push('/dev');
  }, [router]);

  const handleToggleHistory = useCallback(() => {
    setShowHistory(prev => !prev);
  }, []);

  return (
    <>
      <KeyboardHandler
        onNextAgent={handleNextAgent}
        onPreviousAgent={handlePreviousAgent}
        onToggleDevMode={handleToggleDevMode}
        onToggleHistory={handleToggleHistory}
      />

      <div className="h-screen flex flex-col bg-black text-gray-100 font-mono">
        {/* Agent Selector - Minimal top bar */}
        <div className="border-b border-gray-900 p-4">
          <div className="max-w-7xl mx-auto">
            {/* Mobile layout */}
            {isMobile ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <select
                    value={currentAgent.id}
                    onChange={(e) => {
                      const agent = AGENTS.find(a => a.id === e.target.value);
                      if (agent) switchAgent(agent);
                    }}
                    disabled={isSwitching}
                    className="bg-black text-gray-100 border border-gray-800 px-3 py-1 text-xs rounded-none focus:border-gray-600"
                    style={{ borderColor: currentAgent.accentColor }}
                  >
                    {AGENTS.map(agent => (
                      <option key={agent.id} value={agent.id}>
                        {agent.displayName}
                      </option>
                    ))}
                  </select>

                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-1 h-1 rounded-full transition-all duration-300 ${
                        isConnected ? 'bg-green-500' : 'bg-gray-700'
                      }`}
                    />
                    <span className="text-xs text-gray-500">
                      {isConnected ? 'on' : 'off'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* Desktop layout */
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-8">
                  {AGENTS.map((agent) => (
                    <button
                      key={agent.id}
                      onClick={() => switchAgent(agent)}
                      disabled={isSwitching}
                      className={`
                        text-xs lowercase tracking-wider transition-all duration-300
                        ${currentAgent.id === agent.id
                          ? 'text-gray-100'
                          : 'text-gray-600 hover:text-gray-400'
                        }
                        ${isSwitching ? 'opacity-50' : ''}
                      `}
                      style={{
                        borderBottom: currentAgent.id === agent.id
                          ? `2px solid ${agent.accentColor}`
                          : '2px solid transparent',
                        paddingBottom: '2px'
                      }}
                    >
                      {agent.displayName}
                    </button>
                  ))}
                </div>

                {/* Status indicator */}
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-1 h-1 rounded-full transition-all duration-300 ${
                      isConnected ? 'bg-green-500' : 'bg-gray-700'
                    }`}
                  />
                  <span className="text-xs text-gray-500">
                    {isConnected ? 'connected' : 'disconnected'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex items-center justify-center relative overflow-hidden">
          {/* Background gradient based on current agent */}
          <div
            className="absolute inset-0 opacity-5 transition-all duration-1000"
            style={{
              background: `radial-gradient(circle at center, ${currentAgent.accentColor} 0%, transparent 70%)`
            }}
          />

          {/* Messages (minimal, fading) */}
          <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-8 max-w-4xl mx-auto">
            {messages.slice(showHistory ? -10 : -3).map((msg, index, arr) => (
              <div
                key={index}
                className={`
                  mb-2 md:mb-4 text-xs md:text-sm transition-all duration-500
                  ${index === arr.length - 1
                    ? 'opacity-100'
                    : index === arr.length - 2
                      ? 'opacity-50'
                      : 'opacity-25'
                  }
                `}
              >
                <span className={msg.type === 'user' ? 'text-gray-500' : 'text-gray-300'}>
                  {msg.type === 'user' ? 'you' : currentAgent.displayName}: {msg.message}
                </span>
              </div>
            ))}
          </div>

          {/* Center control */}
          <div className="relative z-10 text-center px-4">
            {!isConnected && !isSwitching && (
              <>
                <h1 className="text-4xl md:text-6xl mb-2 transition-all duration-500" style={{ color: currentAgent.accentColor }}>
                  {currentAgent.icon || '●'}
                </h1>
                <h2 className="text-xl md:text-2xl mb-1 lowercase tracking-wider">
                  {currentAgent.displayName}
                </h2>
                <p className="text-xs text-gray-500 mb-6 md:mb-8">
                  {currentAgent.description}
                </p>
                <button
                  onClick={startConversation}
                  className="text-xs lowercase tracking-widest text-gray-400 hover:text-gray-100 transition-all duration-300 border border-gray-800 hover:border-gray-600 px-4 md:px-6 py-2 md:py-3"
                >
                  start conversation
                </button>
              </>
            )}

            {isConnected && (
              <div className="space-y-4">
                <div className="flex flex-col items-center space-y-2">
                  <div className="text-3xl md:text-4xl animate-pulse" style={{ color: currentAgent.accentColor }}>
                    {currentAgent.icon || '●'}
                  </div>
                  <p className="text-xs text-gray-500">
                    {conversation.isSpeaking ? 'speaking' : 'listening'}
                  </p>
                </div>
                <button
                  onClick={stopConversation}
                  className="text-xs lowercase tracking-widest text-gray-600 hover:text-gray-400 transition-all duration-300"
                >
                  end conversation
                </button>
              </div>
            )}

            {isSwitching && (
              <div className="text-xs text-gray-500 animate-pulse">
                switching consciousness...
              </div>
            )}
          </div>
        </div>

        {/* Minimal footer */}
        <div className="border-t border-gray-900 p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center text-xs text-gray-600">
            <span>huse.dev</span>
            <button
              onClick={() => alert('Keyboard shortcuts:\n\n→/Tab: Next agent\n←/Shift+Tab: Previous agent\nCmd/Ctrl+D: Dev mode\nCmd/Ctrl+H: Toggle history\n?: Help')}
              className="hover:text-gray-400 transition-colors"
            >
              press ? for help
            </button>
            <span>powered by elevenlabs</span>
          </div>
        </div>
      </div>
    </>
  );
}