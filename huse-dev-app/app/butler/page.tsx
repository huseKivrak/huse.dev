'use client';

import ButlerAgent from '@/components/ButlerAgent';

export default function ButlerPage() {
  const butlerConfig = {
    agentName: 'butler',
    initialMessage: 'hello. i am butler, huse\'s digital assistant. how may i help you today?',
    placeholder: 'ask about huse\'s experience, projects, or technical expertise...',
    theme: 'dark' as const,
  };

  return (
    <div className="min-h-screen">
      <ButlerAgent config={butlerConfig} />
    </div>
  );
}