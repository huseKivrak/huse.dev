'use client';

import { DevConsole } from '@/lib/components/dev-console';
import { ErrorBoundary } from '@/lib/components/error-boundary';
import { AGENTS } from '@/lib/constants/agents';
import { useConversationManager } from '@/lib/hooks/use-conversation-manager';
import { logger } from '@/lib/utils/logger';
import { onRenderCallback } from '@/lib/utils/performance';
import { Profiler, useCallback, useEffect, useState } from 'react';
import KeyboardHandler from './keyboard-handler';

// Agent selector component
function AgentSelector({
  agents,
  currentAgent,
  onAgentSelect,
  isMobile,
  disabled
}: {
  agents: typeof AGENTS;
  currentAgent: typeof AGENTS[0];
  onAgentSelect: (agent: typeof AGENTS[0]) => void;
  isMobile: boolean;
  disabled: boolean;
}) {
  if (isMobile) {
    return (
      <select
        value={currentAgent.id}
        onChange={(e) => {
          const agent = agents.find(a => a.id === e.target.value);
          if (agent) onAgentSelect(agent);
        }}
        disabled={disabled}
        className="bg-transparent text-stone-400 text-xs font-mono focus:outline-none disabled:opacity-50"
      >
        {agents.map(agent => (
          <option key={agent.id} value={agent.id}>
            {agent.displayName}
          </option>
        ))}
      </select>
    );
  }

  return (
    <div className="flex gap-6">
      {agents.map(agent => (
        <button
          key={agent.id}
          onClick={() => onAgentSelect(agent)}
          disabled={disabled}
          className={`
            text-xs font-mono transition-all relative
            ${currentAgent.id === agent.id
              ? 'text-stone-100'
              : 'text-stone-500 hover:text-stone-300'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {agent.displayName}
          {currentAgent.id === agent.id && (
            <div
              className="absolute -bottom-2 left-0 right-0 h-px"
              style={{ backgroundColor: agent.accentColor }}
            />
          )}
        </button>
      ))}
    </div>
  );
}

// Message display component
function MessageDisplay({
  messages,
  showHistory,
  accentColor
}: {
  messages: Array<{ type: string; message: string; timestamp: Date }>;
  showHistory: boolean;
  accentColor: string;
}) {
  const displayCount = showHistory ? 10 : 3;
  const displayMessages = messages.slice(-displayCount);

  return (
    <div className="absolute bottom-0 left-0 right-0 p-8 pointer-events-none">
      <div className="max-w-4xl mx-auto space-y-3">
        {displayMessages.map((msg, index) => {
          const opacity = showHistory
            ? 1
            : 1 - (displayCount - index - 1) * 0.3;

          return (
            <div
              key={index}
              className={`
                text-xs font-mono transition-all duration-500
                ${msg.type === 'user' ? 'text-stone-500' : 'text-stone-300'}
              `}
              style={{ opacity }}
            >
              <span style={{ color: msg.type === 'user' ? '#6b7280' : accentColor }}>
                {msg.type === 'user' ? '>' : '<'}
              </span>
              {' '}
              {msg.message}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function MinimalistConversationV2() {
  const [showHistory, setShowHistory] = useState(false);
  const [showDevConsole, setShowDevConsole] = useState(false);
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

  // Use the conversation manager hook
  const {
    status,
    messages,
    currentAgent,
    error,
    isConnected,
    isConnecting,
    startConversation,
    stopConversation,
    switchAgent,
  } = useConversationManager(AGENTS, {
    onConnect: () => {
      logger.info('UI: Conversation connected');
    },
    onDisconnect: (reason) => {
      logger.info('UI: Conversation disconnected', { reason });
    },
    onMessage: (message) => {
      logger.debug('UI: Message received', {
        type: message.type,
        length: message.message.length,
      });
    },
    onError: (error) => {
      logger.error('UI: Conversation error', {}, error);
    },
  });

  // Keyboard shortcuts
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

  // Handle connection button click
  const handleConnectionToggle = useCallback(async () => {
    if (isConnected) {
      await stopConversation();
    } else {
      await startConversation();
    }
  }, [isConnected, startConversation, stopConversation]);

  // Error handling
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-stone-300 font-mono">
        <div className="text-center space-y-4">
          <div className="text-red-500 text-sm">error occurred</div>
          <p className="text-xs text-stone-500">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded text-xs"
          >
            reload
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Profiler id="MinimalistConversation" onRender={(id, phase, actualDuration) => {
        onRenderCallback(id, phase, actualDuration, 0, 0, 0, new Set());
      }}>
        <div className="relative min-h-screen bg-black text-stone-300 font-mono">
          {/* Header */}
          <header className="absolute top-0 left-0 right-0 p-6 z-10">
            <nav className="flex items-center justify-between">
              <AgentSelector
                agents={AGENTS}
                currentAgent={currentAgent}
                onAgentSelect={switchAgent}
                isMobile={isMobile}
                disabled={isConnecting || (isConnected && status !== 'connected')}
              />

              {/* Status Indicator */}
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <div
                  className={`
                    w-2 h-2 rounded-full transition-colors
                    ${isConnected ? 'bg-green-500' : 'bg-stone-600'}
                  `}
                />
                {status === 'connecting' ? 'connecting...' : status}
              </div>
            </nav>
          </header>

          {/* Center Content */}
          <main className="min-h-screen flex items-center justify-center p-8">
            <div className="text-center space-y-8">
              {/* Agent Icon */}
              <div
                className="text-6xl transition-all duration-300"
                style={{
                  color: currentAgent.accentColor,
                  opacity: isConnected ? 1 : 0.5,
                }}
              >
                {currentAgent.icon || '●'}
              </div>

              {/* Agent Info */}
              <div className="space-y-2">
                <h1 className="text-2xl text-stone-100">
                  {currentAgent.displayName}
                </h1>
                <p className="text-xs text-stone-500">
                  {currentAgent.description}
                </p>
              </div>

              {/* Connection Button */}
              <button
                onClick={handleConnectionToggle}
                disabled={isConnecting || status === 'connecting'}
                className={`
                  px-6 py-3 rounded-full text-sm transition-all
                  ${isConnected
                    ? 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                    : 'bg-stone-100 hover:bg-stone-200 text-black'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                {isConnecting || status === 'connecting'
                  ? 'connecting...'
                  : isConnected
                    ? 'end conversation'
                    : 'start conversation'}
              </button>

              {/* Help Text */}
              {!isConnected && (
                <p className="text-xs text-stone-600 mt-4">
                  press ? for keyboard shortcuts
                </p>
              )}
            </div>
          </main>

          {/* Messages */}
          <MessageDisplay
            messages={messages}
            showHistory={showHistory}
            accentColor={currentAgent.accentColor}
          />

          {/* Keyboard Handler */}
          <KeyboardHandler
            onToggleDevMode={() => setShowDevConsole(!showDevConsole)}
            onNextAgent={handleNextAgent}
            onPreviousAgent={handlePreviousAgent}
            onToggleHistory={() => setShowHistory(!showHistory)}
          />

          {/* Dev Console */}
          <DevConsole
            isOpen={showDevConsole}
            onClose={() => setShowDevConsole(false)}
          />
        </div>
      </Profiler>
    </ErrorBoundary>
  );
}