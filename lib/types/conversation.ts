/**
 * Type definitions for conversation system
 */

export interface ConversationMessage {
  id?: string;
  type: 'user' | 'agent';
  message: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface ConversationState {
  status: 'idle' | 'connecting' | 'connected' | 'disconnected' | 'error';
  error?: Error;
  messages: ConversationMessage[];
  sessionToken: string;
  currentAgent: AgentConfig;
}

export interface AgentConfig {
  id: string;
  name: string;
  displayName: string;
  description: string;
  firstMessage: string;
  promptFile: string;
  voiceId: string;
  temperature: number;
  stability: number;
  similarity: number;
  speed: number;
  accentColor: string;
  icon?: string;
  elevenlabsAgentId: string;
}

export interface ConversationCallbacks {
  onConnect?: () => void;
  onDisconnect?: (reason?: string) => void;
  onMessage?: (message: ConversationMessage) => void;
  onError?: (error: Error) => void;
  onStatusChange?: (status: ConversationState['status']) => void;
}

export interface ConversationControls {
  startConversation: () => Promise<void>;
  stopConversation: () => Promise<void>;
  switchAgent: (agent: AgentConfig) => Promise<void>;
  sendMessage?: (message: string) => Promise<void>;
}

export interface DatabaseConversation {
  id: number;
  sessionId: string;
  message: string;
  isUserMessage: boolean;
  agentPersonality?: string | null;
  metadata?: unknown | null;
  createdAt: Date;
}

export interface UserSession {
  id: string;
  sessionToken: string;
  metadata?: unknown | null;
  createdAt: Date;
  updatedAt: Date;
}