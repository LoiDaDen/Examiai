CREATE TYPE "public"."conversation_type" AS ENUM('general', 'writing', 'speaking', 'reading', 'listening');--> statement-breakpoint
CREATE TYPE "public"."listening_question_type" AS ENUM('multiple-choice', 'form-completion', 'note-completion', 'sentence-completion', 'matching', 'map-label');--> statement-breakpoint
CREATE TYPE "public"."message_role" AS ENUM('user', 'assistant', 'system');--> statement-breakpoint
CREATE TYPE "public"."reading_question_type" AS ENUM('multiple-choice', 'true-false-not-given', 'yes-no-not-given', 'matching-headings', 'matching-information', 'matching-features', 'matching-sentence-endings', 'sentence-completion', 'summary-completion', 'table-completion', 'flow-chart-completion', 'diagram-label', 'choose-a-title', 'short-answer', 'classification');--> statement-breakpoint
CREATE TYPE "public"."speaking_part_number" AS ENUM('1', '2', '3');--> statement-breakpoint
CREATE TYPE "public"."writing_task_number" AS ENUM('1', '2');--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"type" "conversation_type" DEFAULT 'general' NOT NULL,
	"title" varchar(255),
	"share_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "conversations_share_id_unique" UNIQUE("share_id")
);
--> statement-breakpoint
CREATE TABLE "ielts_knowledge" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "listening_questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"section_id" uuid NOT NULL,
	"question_type" "listening_question_type" NOT NULL,
	"question_text" text NOT NULL,
	"options" jsonb,
	"correct_answer" text NOT NULL,
	"explanation" text NOT NULL,
	"order_index" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "listening_sections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"test_id" uuid NOT NULL,
	"section_number" integer NOT NULL,
	"title" varchar(256) NOT NULL,
	"audio_url" text,
	"transcript" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "listening_tests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(256) NOT NULL,
	"difficulty" varchar(32) DEFAULT 'medium' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" uuid NOT NULL,
	"role" "message_role" NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"display_name" varchar(100),
	"avatar_url" text,
	"language" varchar(5) DEFAULT 'en' NOT NULL,
	"theme" varchar(10) DEFAULT 'light' NOT NULL,
	"role" varchar(32) DEFAULT 'user' NOT NULL,
	"speaking_autoplay" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reading_passages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(256) NOT NULL,
	"passage_text" text NOT NULL,
	"source_url" text,
	"difficulty" varchar(32) DEFAULT 'medium' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reading_questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"passage_id" uuid NOT NULL,
	"question_type" "reading_question_type" NOT NULL,
	"question_text" text NOT NULL,
	"options" jsonb,
	"correct_answer" text NOT NULL,
	"explanation" text NOT NULL,
	"order_index" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "speaking_questions" (
	"id" integer PRIMARY KEY NOT NULL,
	"test_title" varchar(256) NOT NULL,
	"content" text NOT NULL,
	"source_url" text,
	"part_number" "speaking_part_number" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "writing_questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"test_title" varchar(256) NOT NULL,
	"content" text NOT NULL,
	"image_url" text,
	"source_url" text,
	"task_number" "writing_task_number" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listening_questions" ADD CONSTRAINT "listening_questions_section_id_listening_sections_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."listening_sections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listening_sections" ADD CONSTRAINT "listening_sections_test_id_listening_tests_id_fk" FOREIGN KEY ("test_id") REFERENCES "public"."listening_tests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reading_questions" ADD CONSTRAINT "reading_questions_passage_id_reading_passages_id_fk" FOREIGN KEY ("passage_id") REFERENCES "public"."reading_passages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "conversations_user_id_idx" ON "conversations" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "listening_questions_section_id_idx" ON "listening_questions" USING btree ("section_id");--> statement-breakpoint
CREATE INDEX "listening_sections_test_id_idx" ON "listening_sections" USING btree ("test_id");--> statement-breakpoint
CREATE INDEX "messages_conversation_id_idx" ON "messages" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "reading_questions_passage_id_idx" ON "reading_questions" USING btree ("passage_id");