'use client';

import { AGENTS } from '@/lib/constants/agents';
import { useConversationManager } from '@/lib/hooks/use-conversation-manager';
import { useEffect, useRef, useState } from 'react';

interface DebugEvent {
  timestamp: string;
  type: string;
  details: Record<string, unknown>;
}

export function ConversationDebug() {
  const [events, setEvents] = useState<DebugEvent[]>([]);
  const [showDebug, setShowDebug] = useState(false);

  const addEvent = (type: string, details: Record<string, unknown>) => {
    setEvents(prev => [...prev.slice(-19), {
      timestamp: new Date().toISOString(),
      type,
      details,
    }]);
  };

  const {
    status,
    messages,
    currentAgent,
    sessionToken,
    error,
    isConnected,
    isConnecting,
    startConversation,
    stopConversation,
    switchAgent,
  } = useConversationManager(AGENTS, {
    onConnect: () => addEvent('onConnect', { status: 'connected' }),
    onDisconnect: (reason) => addEvent('onDisconnect', { reason }),
    onMessage: (msg) => addEvent('onMessage', { type: msg.type, length: msg.message.length }),
    onError: (err) => addEvent('onError', { message: err.message }),
    onStatusChange: (newStatus) => addEvent('onStatusChange', { newStatus }),
  });

  // Log status changes (skip initial mount)
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    addEvent('statusChange', { status, isConnected, isConnecting });
  }, [status, isConnected, isConnecting]);

  // Log errors
  useEffect(() => {
    if (error) {
      addEvent('errorState', {
        message: error.message,
        cause: (error as Error & { cause?: Error }).cause?.message,
      });
    }
  }, [error]);

  const handleStart = async () => {
    addEvent('userAction', { action: 'startConversation' });
    try {
      await startConversation();
      addEvent('startSuccess', {});
    } catch (err) {
      addEvent('startError', { error: err instanceof Error ? err.message : 'Unknown' });
    }
  };

  const handleStop = async () => {
    addEvent('userAction', { action: 'stopConversation' });
    try {
      await stopConversation();
      addEvent('stopSuccess', {});
    } catch (err) {
      addEvent('stopError', { error: err instanceof Error ? err.message : 'Unknown' });
    }
  };

  const handleSwitch = async (agent: typeof AGENTS[0]) => {
    addEvent('userAction', { action: 'switchAgent', to: agent.id });
    try {
      await switchAgent(agent);
      addEvent('switchSuccess', { agent: agent.id });
    } catch (err) {
      addEvent('switchError', { error: err instanceof Error ? err.message : 'Unknown' });
    }
  };

  const runTests = async () => {
    setEvents([]);

    // Test state flow
    const response = await fetch('/api/test-connection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'test-state-flow' }),
    });
    const data = await response.json();
    addEvent('testStateFlow', data);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setShowDebug(!showDebug)}
        className="bg-purple-600 text-white px-3 py-1 rounded text-xs font-mono mb-2"
      >
        {showDebug ? 'hide' : 'show'} debug
      </button>

      {showDebug && (
        <div className="bg-black/95 border border-purple-600 rounded-lg p-4 w-96 max-h-[600px] overflow-y-auto font-mono text-xs text-gray-300">
          <h3 className="text-purple-400 mb-2 font-bold">conversation debug</h3>

          {/* Current State */}
          <div className="mb-4 p-2 bg-gray-900 rounded">
            <div className="text-purple-400 mb-1">current state:</div>
            <div>status: <span className={`font-bold ${
              status === 'connected' ? 'text-green-400' :
              status === 'connecting' ? 'text-yellow-400' :
              status === 'disconnecting' ? 'text-orange-400' :
              status === 'disconnected' ? 'text-gray-400' :
              'text-gray-400'
            }`}>{status}</span></div>
            <div>agent: {currentAgent.id}</div>
            <div>session: {sessionToken.slice(0, 8)}...</div>
            <div>messages: {messages.length}</div>
            {error && (
              <div className="text-red-400 mt-1">
                error: {error.message}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="mb-4 space-y-2">
            <button
              onClick={handleStart}
              disabled={isConnecting || isConnected}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-2 py-1 rounded"
            >
              start conversation
            </button>
            <button
              onClick={handleStop}
              disabled={!isConnected}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-2 py-1 rounded"
            >
              stop conversation
            </button>
            <div className="flex gap-2">
              {AGENTS.slice(0, 3).map(agent => (
                <button
                  key={agent.id}
                  onClick={() => handleSwitch(agent)}
                  disabled={agent.id === currentAgent.id || isConnecting}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-2 py-1 rounded truncate"
                >
                  {agent.id}
                </button>
              ))}
            </div>
            <button
              onClick={runTests}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
            >
              run tests
            </button>
          </div>

          {/* Event Log */}
          <div className="space-y-1">
            <div className="text-purple-400 mb-1">event log:</div>
            {events.length === 0 ? (
              <div className="text-gray-500">no events yet</div>
            ) : (
              events.map((event, i) => (
                <div key={i} className={`p-1 rounded ${
                  event.type.includes('Error') ? 'bg-red-900/30' :
                  event.type.includes('Success') ? 'bg-green-900/30' :
                  event.type === 'onConnect' ? 'bg-green-900/30' :
                  event.type === 'onDisconnect' ? 'bg-yellow-900/30' :
                  'bg-gray-900/30'
                }`}>
                  <div className="text-gray-500">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </div>
                  <div className="font-bold text-white">{event.type}</div>
                  {Object.keys(event.details).length > 0 && (
                    <pre className="text-gray-400 text-[10px] mt-1">
                      {JSON.stringify(event.details, null, 2)}
                    </pre>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}