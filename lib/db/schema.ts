import {
  pgTable,
  pgEnum,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  jsonb,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

// ── Enums ──────────────────────────────────────────────────────────────────

export const conversationTypeEnum = pgEnum("conversation_type", [
  "general",
  "writing",
  "speaking",
  "reading",
  "listening",
]);

export const messageRoleEnum = pgEnum("message_role", [
  "user",
  "assistant",
  "system",
]);

export const writingTaskNumberEnum = pgEnum("writing_task_number", ["1", "2"]);

export const speakingPartNumberEnum = pgEnum("speaking_part_number", [
  "1",
  "2",
  "3",
]);

export const readingQuestionTypeEnum = pgEnum("reading_question_type", [
  "multiple-choice",
  "true-false-not-given",
  "yes-no-not-given",
  "matching-headings",
  "matching-information",
  "matching-features",
  "matching-sentence-endings",
  "sentence-completion",
  "summary-completion",
  "table-completion",
  "flow-chart-completion",
  "diagram-label",
  "choose-a-title",
  "short-answer",
  "classification",
]);

export const listeningQuestionTypeEnum = pgEnum("listening_question_type", [
  "multiple-choice",
  "form-completion",
  "note-completion",
  "sentence-completion",
  "matching",
  "map-label",
]);

// ── Profiles ───────────────────────────────────────────────────────────────
// Linked to Supabase auth.users via id

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(), // matches auth.users.id
  displayName: varchar("display_name", { length: 100 }),
  avatarUrl: text("avatar_url"),
  language: varchar("language", { length: 5 }).default("en").notNull(), // "en" | "vi"
  theme: varchar("theme", { length: 10 }).default("light").notNull(), // "light" | "dark"
  role: varchar("role", { length: 32 }).default("user").notNull(),
  speakingAutoplay: boolean("speaking_autoplay").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ── Conversations ──────────────────────────────────────────────────────────

export const conversations = pgTable(
  "conversations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => profiles.id, {
      onDelete: "cascade",
    }),
    type: conversationTypeEnum("type").default("general").notNull(),
    title: varchar("title", { length: 255 }),
    shareId: uuid("share_id").unique(), // non-null = publicly shared; unique constraint provides the index
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("conversations_user_id_idx").on(table.userId)],
);

// ── Messages ───────────────────────────────────────────────────────────────
// Content is plain text for simple messages, or a JSON string for structured
// data (writing submissions, scoring feedback, speaking session config, etc.)

export const messages = pgTable(
  "messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    conversationId: uuid("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    role: messageRoleEnum("role").notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("messages_conversation_id_idx").on(table.conversationId),
  ],
);

// ── Writing Questions ──────────────────────────────────────────────────────

export const writingQuestions = pgTable("writing_questions", {
  id: uuid("id").primaryKey().defaultRandom(),
  testTitle: varchar("test_title", { length: 256 }).notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"), // Supabase Storage URL (Task 1 only)
  sourceUrl: text("source_url"),
  taskNumber: writingTaskNumberEnum("task_number").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ── Speaking Questions ─────────────────────────────────────────────────────

export const speakingQuestions = pgTable("speaking_questions", {
  id: integer("id").primaryKey(),
  testTitle: varchar("test_title", { length: 256 }).notNull(),
  content: text("content").notNull(),
  sourceUrl: text("source_url"),
  partNumber: speakingPartNumberEnum("part_number").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ── Reading Passages and Questions ──────────────────────────────────────────

export const readingPassages = pgTable("reading_passages", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 256 }).notNull(),
  passageText: text("passage_text").notNull(),
  sourceUrl: text("source_url"),
  difficulty: varchar("difficulty", { length: 32 }).default("medium").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const readingQuestions = pgTable(
  "reading_questions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    passageId: uuid("passage_id")
      .notNull()
      .references(() => readingPassages.id, { onDelete: "cascade" }),
    questionType: readingQuestionTypeEnum("question_type").notNull(),
    questionText: text("question_text").notNull(),
    options: jsonb("options").$type<string[]>(),
    correctAnswer: text("correct_answer").notNull(),
    explanation: text("explanation").notNull(),
    orderIndex: integer("order_index").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("reading_questions_passage_id_idx").on(table.passageId)],
);

// ── Listening Tests, Sections, and Questions ────────────────────────────────

export const listeningTests = pgTable("listening_tests", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 256 }).notNull(),
  difficulty: varchar("difficulty", { length: 32 }).default("medium").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const listeningSections = pgTable(
  "listening_sections",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    testId: uuid("test_id")
      .notNull()
      .references(() => listeningTests.id, { onDelete: "cascade" }),
    sectionNumber: integer("section_number").notNull(),
    title: varchar("title", { length: 256 }).notNull(),
    audioUrl: text("audio_url"),
    transcript: text("transcript"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("listening_sections_test_id_idx").on(table.testId)],
);

export const listeningQuestions = pgTable(
  "listening_questions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sectionId: uuid("section_id")
      .notNull()
      .references(() => listeningSections.id, { onDelete: "cascade" }),
    questionType: listeningQuestionTypeEnum("question_type").notNull(),
    questionText: text("question_text").notNull(),
    options: jsonb("options").$type<string[]>(),
    correctAnswer: text("correct_answer").notNull(),
    explanation: text("explanation").notNull(),
    orderIndex: integer("order_index").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("listening_questions_section_id_idx").on(table.sectionId)],
);

// ── IELTS Knowledge Documents ──────────────────────────────────────────────

export const ieltsKnowledge = pgTable("ielts_knowledge", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ── Type Exports ───────────────────────────────────────────────────────────

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;

export type Conversation = typeof conversations.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;

export type WritingQuestion = typeof writingQuestions.$inferSelect;
export type SpeakingQuestion = typeof speakingQuestions.$inferSelect;
export type ReadingPassage = typeof readingPassages.$inferSelect;
export type ReadingQuestion = typeof readingQuestions.$inferSelect;
export type ListeningTest = typeof listeningTests.$inferSelect;
export type ListeningSection = typeof listeningSections.$inferSelect;
export type ListeningQuestion = typeof listeningQuestions.$inferSelect;

export type IeltsKnowledge = typeof ieltsKnowledge.$inferSelect;
