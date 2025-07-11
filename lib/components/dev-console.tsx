'use client';

import { logger } from '@/lib/utils/logger';
import { performanceMonitor } from '@/lib/utils/performance';
import { useCallback, useEffect, useState } from 'react';

interface DevConsoleProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DevConsole({ isOpen, onClose }: DevConsoleProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'logs' | 'performance' | 'state'>('logs');
  const [logLevel, setLogLevel] = useState<'all' | 'debug' | 'info' | 'warn' | 'error'>('all');
  const [autoScroll, setAutoScroll] = useState(true);

  // Update logs periodically
  useEffect(() => {
    if (!isOpen) return;

    const updateLogs = () => {
      const recentLogs = logger.getRecentLogs(100);
      const filtered = logLevel === 'all'
        ? recentLogs
        : recentLogs.filter(log => log.level === logLevel);

      setLogs(filtered.map(log => {
        const time = new Date(log.context.timestamp).toLocaleTimeString();
        const level = log.level.toUpperCase().padEnd(5);
        const agent = log.context.agent ? `[${log.context.agent}]` : '';
        return `[${time}] [${level}] ${agent} ${log.message}`;
      }));
    };

    updateLogs();
    const interval = setInterval(updateLogs, 1000);
    return () => clearInterval(interval);
  }, [isOpen, logLevel]);

  // Performance metrics
  const [metrics, setMetrics] = useState<{
    marks: Array<[string, { startTime: number; duration?: number }]>;
    vitals: Record<string, number>
  }>({
    marks: [],
    vitals: {}
  });

  useEffect(() => {
    if (!isOpen || activeTab !== 'performance') return;

    const updateMetrics = () => {
      setMetrics(performanceMonitor.exportMetrics());
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 2000);
    return () => clearInterval(interval);
  }, [isOpen, activeTab]);

  // Clear logs
  const clearLogs = useCallback(() => {
    logger.clearLogs();
    setLogs([]);
  }, []);

  // Export logs
  const exportLogs = useCallback(() => {
    const data = logger.exportLogs();
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs-${new Date().toISOString()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-96 bg-stone-900 border-t border-stone-800 z-50 font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between bg-stone-950 px-4 py-2 border-b border-stone-800">
        <div className="flex items-center gap-4">
          <h3 className="text-stone-300 font-semibold">dev console</h3>

          {/* Tabs */}
          <div className="flex gap-2">
            {(['logs', 'performance', 'state'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded transition-colors ${
                  activeTab === tab
                    ? 'bg-stone-700 text-stone-100'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-stone-400 hover:text-stone-200 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="h-full pb-12 overflow-hidden">
        {activeTab === 'logs' && (
          <div className="h-full flex flex-col">
            {/* Log controls */}
            <div className="flex items-center gap-4 px-4 py-2 border-b border-stone-800">
              <select
                value={logLevel}
                onChange={(e) => setLogLevel(e.target.value as 'all' | 'debug' | 'info' | 'warn' | 'error')}
                className="bg-stone-800 text-stone-300 px-2 py-1 rounded text-xs"
              >
                <option value="all">all</option>
                <option value="debug">debug</option>
                <option value="info">info</option>
                <option value="warn">warn</option>
                <option value="error">error</option>
              </select>

              <label className="flex items-center gap-2 text-stone-400">
                <input
                  type="checkbox"
                  checked={autoScroll}
                  onChange={(e) => setAutoScroll(e.target.checked)}
                  className="rounded"
                />
                auto scroll
              </label>

              <button
                onClick={clearLogs}
                className="text-stone-400 hover:text-stone-200 transition-colors"
              >
                clear
              </button>

              <button
                onClick={exportLogs}
                className="text-stone-400 hover:text-stone-200 transition-colors"
              >
                export
              </button>
            </div>

            {/* Log output */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {logs.length === 0 ? (
                <div className="text-stone-500">no logs to display</div>
              ) : (
                logs.map((log, i) => (
                  <div
                    key={i}
                    className={`
                      ${log.includes('[ERROR]') ? 'text-red-400' : ''}
                      ${log.includes('[WARN]') ? 'text-yellow-400' : ''}
                      ${log.includes('[INFO]') ? 'text-blue-400' : ''}
                      ${log.includes('[DEBUG]') ? 'text-stone-500' : ''}
                      ${!log.includes('[ERROR]') && !log.includes('[WARN]') && !log.includes('[INFO]') && !log.includes('[DEBUG]') ? 'text-stone-300' : ''}
                    `}
                  >
                    {log}
                  </div>
                ))
              )}
              {autoScroll && <div ref={el => el?.scrollIntoView()} />}
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="p-4 space-y-4 overflow-y-auto">
            {/* Web Vitals */}
            <div>
              <h4 className="text-stone-300 font-semibold mb-2">web vitals</h4>
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(metrics.vitals).map(([key, value]) => (
                  <div key={key} className="bg-stone-800 p-3 rounded">
                    <div className="text-stone-500">{key}</div>
                    <div className="text-stone-200 text-lg">
                      {typeof value === 'number' ? `${value.toFixed(2)}ms` : value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Marks */}
            <div>
              <h4 className="text-stone-300 font-semibold mb-2">performance marks</h4>
              <div className="space-y-2">
                {metrics.marks.length === 0 ? (
                  <div className="text-stone-500">no performance marks recorded</div>
                ) : (
                  metrics.marks.slice(-10).map(([name, mark], i) => (
                    <div key={i} className="flex justify-between text-stone-400">
                      <span>{name}</span>
                      <span>
                        {mark.duration
                          ? `${mark.duration.toFixed(2)}ms`
                          : `started at ${mark.startTime.toFixed(2)}ms`}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'state' && (
          <div className="p-4 space-y-4 overflow-y-auto">
            <div className="text-stone-400">
              <p>session token: {localStorage.getItem('sessionToken') || 'none'}</p>
              <p>environment: {process.env.NODE_ENV}</p>
              <p>build id: {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || 'dev'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}