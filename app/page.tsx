'use client';

import dynamic from 'next/dynamic';

// Dynamically import to avoid SSR issues with browser APIs
const MinimalistConversationV2 = dynamic(
  () => import('./components/minimalist-conversation-v2'),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-stone-500 font-mono text-xs">loading conversation...</div>
      </div>
    )
  }
);

export default function Home() {
  return <MinimalistConversationV2 />;
}
