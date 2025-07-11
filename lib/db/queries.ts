import { and, count, desc, eq, gt, sql } from 'drizzle-orm';
import { db } from './index';
import type { NewConversation, NewUserPreference } from './schema';
import { conversations, userPreferences, userSessions } from './schema';

// Session Management
export async function createUserSession(sessionToken: string) {
  const [session] = await db
    .insert(userSessions)
    .values({ sessionToken })
    .returning();
  return session;
}

export async function getUserSession(sessionToken: string) {
  const [session] = await db
    .select()
    .from(userSessions)
    .where(eq(userSessions.sessionToken, sessionToken));
  return session;
}

export async function updateUserSession(sessionToken: string) {
  const [session] = await db
    .update(userSessions)
    .set({
      lastVisit: new Date(),
      visitCount: sql`${userSessions.visitCount} + 1`
    })
    .where(eq(userSessions.sessionToken, sessionToken))
    .returning();
  return session;
}

// Conversation Management
export async function saveConversation(conversation: NewConversation) {
  const [saved] = await db
    .insert(conversations)
    .values(conversation)
    .returning();
  return saved;
}

export async function getConversationHistory(sessionId: string, limit = 50) {
  const history = await db
    .select()
    .from(conversations)
    .where(eq(conversations.sessionId, sessionId))
    .orderBy(desc(conversations.timestamp))
    .limit(limit);
  return history;
}

export async function getRecentConversations(sessionId: string, hours = 24) {
  const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
  const recent = await db
    .select()
    .from(conversations)
    .where(
      and(
        eq(conversations.sessionId, sessionId),
        gt(conversations.timestamp, cutoff)
      )
    )
    .orderBy(desc(conversations.timestamp));
  return recent;
}

// Enhanced Analytics for MCP Integration
export async function getConversationAnalytics(sessionId?: string) {
  const baseQuery = db
    .select({
      totalConversations: count(),
      userMessages: sql<number>`COUNT(CASE WHEN ${conversations.isUserMessage} = true THEN 1 END)`,
      agentMessages: sql<number>`COUNT(CASE WHEN ${conversations.isUserMessage} = false THEN 1 END)`,
      avgLength: sql<number>`AVG(LENGTH(${conversations.message}))`,
      firstConversation: sql<Date>`MIN(${conversations.timestamp})`,
      lastConversation: sql<Date>`MAX(${conversations.timestamp})`
    })
    .from(conversations);

  if (sessionId) {
    const [result] = await baseQuery.where(eq(conversations.sessionId, sessionId));
    return result;
  } else {
    const [result] = await baseQuery;
    return result;
  }
}

export async function getTopAgentPersonalities() {
  const personalities = await db
    .select({
      personality: conversations.agentPersonality,
      count: count(),
      lastUsed: sql<Date>`MAX(${conversations.timestamp})`
    })
    .from(conversations)
    .where(sql`${conversations.agentPersonality} IS NOT NULL`)
    .groupBy(conversations.agentPersonality)
    .orderBy(desc(count()))
    .limit(10);
  return personalities;
}

export async function getSessionSummary(sessionId: string) {
  const sessionInfo = await db
    .select()
    .from(userSessions)
    .where(eq(userSessions.sessionToken, sessionId))
    .limit(1);

  const conversationStats = await getConversationAnalytics(sessionId);

  const recentConversations = await getRecentConversations(sessionId, 24);

  return {
    session: sessionInfo[0],
    stats: conversationStats,
    recentActivity: recentConversations.slice(0, 5)
  };
}

// Database Schema Information for MCP
export async function getDatabaseSchema() {
  return {
    tables: [
      {
        name: 'user_sessions',
        description: 'Stores user session information',
        columns: [
          { name: 'id', type: 'uuid', description: 'Primary key' },
          { name: 'session_token', type: 'text', description: 'Unique session token' },
          { name: 'first_visit', type: 'timestamp', description: 'First visit timestamp' },
          { name: 'last_visit', type: 'timestamp', description: 'Last visit timestamp' },
          { name: 'visit_count', type: 'integer', description: 'Number of visits' }
        ]
      },
      {
        name: 'conversations',
        description: 'Stores conversation history',
        columns: [
          { name: 'id', type: 'uuid', description: 'Primary key' },
          { name: 'session_id', type: 'uuid', description: 'Foreign key to user_sessions' },
          { name: 'message', type: 'text', description: 'Message content' },
          { name: 'is_user_message', type: 'boolean', description: 'Whether message is from user' },
          { name: 'timestamp', type: 'timestamp', description: 'Message timestamp' },
          { name: 'agent_personality', type: 'text', description: 'Agent personality used' },
          { name: 'metadata', type: 'jsonb', description: 'Additional metadata' }
        ]
      },
      {
        name: 'user_preferences',
        description: 'Stores user preferences',
        columns: [
          { name: 'session_id', type: 'uuid', description: 'Primary key, foreign key to user_sessions' },
          { name: 'voice_preference', type: 'text', description: 'Preferred voice' },
          { name: 'conversation_style', type: 'text', description: 'Conversation style' },
          { name: 'topics_of_interest', type: 'text[]', description: 'Array of topics' },
          { name: 'updated_at', type: 'timestamp', description: 'Last updated timestamp' }
        ]
      }
    ]
  };
}

// User Preferences
export async function saveUserPreferences(preferences: NewUserPreference) {
  const [saved] = await db
    .insert(userPreferences)
    .values(preferences)
    .onConflictDoUpdate({
      target: userPreferences.sessionId,
      set: {
        voicePreference: preferences.voicePreference,
        conversationStyle: preferences.conversationStyle,
        topicsOfInterest: preferences.topicsOfInterest,
        updatedAt: new Date(),
      },
    })
    .returning();
  return saved;
}

export async function getUserPreferences(sessionId: string) {
  const [preferences] = await db
    .select()
    .from(userPreferences)
    .where(eq(userPreferences.sessionId, sessionId));
  return preferences;
}

// Analytics helpers
export async function getConversationCount(sessionId: string) {
  const [result] = await db
    .select({ count: count() })
    .from(conversations)
    .where(eq(conversations.sessionId, sessionId));
  return result?.count || 0;
}

export async function getOrCreateSession(sessionToken: string) {
  let session = await getUserSession(sessionToken);

  if (!session) {
    session = await createUserSession(sessionToken);
  } else {
    session = await updateUserSession(sessionToken);
  }

  return session;
}