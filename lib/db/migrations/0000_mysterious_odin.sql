CREATE TABLE "conversations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid,
	"message" text NOT NULL,
	"is_user_message" boolean NOT NULL,
	"timestamp" timestamp DEFAULT NOW(),
	"agent_personality" text,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "user_preferences" (
	"session_id" uuid PRIMARY KEY NOT NULL,
	"voice_preference" text,
	"conversation_style" text,
	"topics_of_interest" text[],
	"updated_at" timestamp DEFAULT NOW()
);
--> statement-breakpoint
CREATE TABLE "user_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_token" text NOT NULL,
	"first_visit" timestamp DEFAULT NOW(),
	"last_visit" timestamp DEFAULT NOW(),
	"visit_count" integer DEFAULT 1,
	CONSTRAINT "user_sessions_session_token_unique" UNIQUE("session_token")
);
--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_session_id_user_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."user_sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_session_id_user_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."user_sessions"("id") ON DELETE no action ON UPDATE no action;