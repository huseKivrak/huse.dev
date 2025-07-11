'use client';

import { useEffect } from 'react';

interface KeyboardHandlerProps {
  onToggleDevMode?: () => void;
  onNextAgent?: () => void;
  onPreviousAgent?: () => void;
  onToggleHistory?: () => void;
}

export default function KeyboardHandler({
  onToggleDevMode,
  onNextAgent,
  onPreviousAgent,
  onToggleHistory
}: KeyboardHandlerProps) {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Check for modifier keys
      const isCmd = e.metaKey || e.ctrlKey;
      const isShift = e.shiftKey;

      // Dev mode toggle: Cmd/Ctrl + D
      if (isCmd && e.key === 'd' && onToggleDevMode) {
        e.preventDefault();
        onToggleDevMode();
      }

      // Next agent: Right arrow or Tab (when not in input)
      if ((e.key === 'ArrowRight' || e.key === 'Tab') && !e.target) {
        e.preventDefault();
        onNextAgent?.();
      }

      // Previous agent: Left arrow or Shift+Tab
      if ((e.key === 'ArrowLeft' || (e.key === 'Tab' && isShift)) && !e.target) {
        e.preventDefault();
        onPreviousAgent?.();
      }

      // Toggle history: Cmd/Ctrl + H
      if (isCmd && e.key === 'h' && onToggleHistory) {
        e.preventDefault();
        onToggleHistory();
      }

      // Help: ?
      if (e.key === '?' && !isCmd && !isShift) {
        e.preventDefault();
        showHelp();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onToggleDevMode, onNextAgent, onPreviousAgent, onToggleHistory]);

  const showHelp = () => {
    // Simple alert for now, could be replaced with a modal
    alert(`Keyboard Shortcuts:

→ / Tab: Next agent
← / Shift+Tab: Previous agent
Cmd/Ctrl + D: Toggle dev mode
Cmd/Ctrl + H: Toggle history
?: Show this help`);
  };

  return null;
}