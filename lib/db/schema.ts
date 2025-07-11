import { sql } from 'drizzle-orm';
import { boolean, integer, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

// User sessions (anonymous but persistent)
export const userSessions = pgTable('user_sessions', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  sessionToken: text('session_token').unique().notNull(),
  firstVisit: timestamp('first_visit').default(sql`NOW()`),
  lastVisit: timestamp('last_visit').default(sql`NOW()`),
  visitCount: integer('visit_count').default(1),
});

// Conversation history
export const conversations = pgTable('conversations', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  sessionId: uuid('session_id').references(() => userSessions.id),
  message: text('message').notNull(),
  isUserMessage: boolean('is_user_message').notNull(),
  timestamp: timestamp('timestamp').default(sql`NOW()`),
  agentPersonality: text('agent_personality'),
  metadata: jsonb('metadata'), // for storing extra context
});

// User preferences
export const userPreferences = pgTable('user_preferences', {
  sessionId: uuid('session_id').primaryKey().references(() => userSessions.id),
  voicePreference: text('voice_preference'),
  conversationStyle: text('conversation_style'),
  topicsOfInterest: text('topics_of_interest').array(),
  updatedAt: timestamp('updated_at').default(sql`NOW()`),
});

// Types for TypeScript
export type UserSession = typeof userSessions.$inferSelect;
export type NewUserSession = typeof userSessions.$inferInsert;
export type Conversation = typeof conversations.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;
export type UserPreference = typeof userPreferences.$inferSelect;
export type NewUserPreference = typeof userPreferences.$inferInsert;