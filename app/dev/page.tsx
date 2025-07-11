'use client';

import { ConversationDebug } from '../components/conversation-debug';
import ConversationalAgent from '../components/conversational-agent';

export default function DevPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <ConversationalAgent />
      {/* Debug component to help trace connection issues */}
      <ConversationDebug />
    </div>
  );
}