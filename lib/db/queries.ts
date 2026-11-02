import { db } from "@/lib/db";
import {
  conversations,
  messages,
  writingQuestions,
  speakingQuestions,
  readingPassages,
  readingQuestions,
  listeningTests,
  listeningSections,
  listeningQuestions,
  ieltsKnowledge,
  profiles,
} from "./schema";
import { eq, sql, desc, asc, ilike, or } from "drizzle-orm";

// Writing questions

export async function getRandomWritingQuestions(
  taskNumbers: ("1" | "2")[]
) {
  const results = [];
  for (const taskNumber of taskNumbers) {
    const [question] = await db
      .select()
      .from(writingQuestions)
      .where(eq(writingQuestions.taskNumber, taskNumber))
      .orderBy(sql`RANDOM()`)
      .limit(1);
    if (question) results.push(question);
  }
  return results;
}

export async function getWritingQuestionsById(ids: string[]) {
  const results = [];
  for (const id of ids) {
    const [question] = await db
      .select()
      .from(writingQuestions)
      .where(eq(writingQuestions.id, id));
    if (question) results.push(question);
  }
  return results;
}

// Speaking questions

export async function getRandomSpeakingQuestions(
  partNumbers: ("1" | "2" | "3")[]
) {
  const results = [];
  for (const partNumber of partNumbers) {
    const [question] = await db
      .select()
      .from(speakingQuestions)
      .where(eq(speakingQuestions.partNumber, partNumber))
      .orderBy(sql`RANDOM()`)
      .limit(1);
    if (question) results.push(question);
  }
  return results;
}

// Reading passages/questions

export async function getRandomReadingPassage() {
  const [passage] = await db
    .select()
    .from(readingPassages)
    .orderBy(sql`RANDOM()`)
    .limit(1);

  if (!passage) return null;

  const questions = await db
    .select()
    .from(readingQuestions)
    .where(eq(readingQuestions.passageId, passage.id))
    .orderBy(asc(readingQuestions.orderIndex));

  return { passage, questions };
}

// Listening tests/sections/questions

export async function getRandomListeningSection() {
  const [section] = await db
    .select({
      id: listeningSections.id,
      testId: listeningSections.testId,
      sectionNumber: listeningSections.sectionNumber,
      title: listeningSections.title,
      audioUrl: listeningSections.audioUrl,
      transcript: listeningSections.transcript,
      testTitle: listeningTests.title,
      difficulty: listeningTests.difficulty,
    })
    .from(listeningSections)
    .innerJoin(listeningTests, eq(listeningSections.testId, listeningTests.id))
    .orderBy(sql`RANDOM()`)
    .limit(1);

  if (!section) return null;

  const questions = await db
    .select()
    .from(listeningQuestions)
    .where(eq(listeningQuestions.sectionId, section.id))
    .orderBy(asc(listeningQuestions.orderIndex));

  return { section, questions };
}

// IELTS Knowledge

export async function getIeltsKnowledge() {
  return db.select().from(ieltsKnowledge);
}

export async function searchIeltsKnowledge(query: string) {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return db.select().from(ieltsKnowledge).limit(5);
  }

  const terms = normalizedQuery
    .split(/\s+/)
    .map((term) => term.replace(/[^\w]/g, ""))
    .filter((term) => term.length > 2)
    .slice(0, 8);
  const patterns = (terms.length ? terms : [normalizedQuery]).map(
    (term) => `%${term}%`
  );

  return db
    .select()
    .from(ieltsKnowledge)
    .where(
      or(
        ...patterns.flatMap((pattern) => [
          ilike(ieltsKnowledge.title, pattern),
          ilike(ieltsKnowledge.content, pattern),
        ])
      )
    )
    .limit(5);
}

export async function getIeltsKnowledgeByTitle(title: string) {
  return db
    .select()
    .from(ieltsKnowledge)
    .where(eq(ieltsKnowledge.title, title));
}

// Conversations

export async function createConversation(data: {
  userId?: string;
  type?: "general" | "writing" | "speaking" | "reading" | "listening";
  title?: string;
}) {
  const [conversation] = await db
    .insert(conversations)
    .values({
      userId: data.userId || null,
      type: data.type || "general",
      title: data.title || null,
    })
    .returning();
  return conversation;
}

export async function getConversation(id: string) {
  const [conversation] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, id));
  return conversation;
}

export async function getUserConversations(userId: string) {
  return db
    .select()
    .from(conversations)
    .where(eq(conversations.userId, userId))
    .orderBy(desc(conversations.updatedAt));
}

export async function updateConversationTitle(id: string, title: string) {
  await db
    .update(conversations)
    .set({ title, updatedAt: new Date() })
    .where(eq(conversations.id, id));
}

export async function deleteConversation(id: string) {
  await db.delete(conversations).where(eq(conversations.id, id));
}

export async function setConversationShareId(id: string) {
  const shareId = crypto.randomUUID();
  await db
    .update(conversations)
    .set({ shareId, updatedAt: new Date() })
    .where(eq(conversations.id, id));
  return shareId;
}

export async function getConversationByShareId(shareId: string) {
  const [conversation] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.shareId, shareId));
  return conversation;
}

// Messages

export async function getMessages(conversationId: string) {
  return db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(asc(messages.createdAt));
}

export async function addMessage(data: {
  conversationId: string;
  role: "user" | "assistant" | "system";
  content: string;
}) {
  const [message] = await db.insert(messages).values(data).returning();
  await db
    .update(conversations)
    .set({ updatedAt: new Date() })
    .where(eq(conversations.id, data.conversationId));
  return message;
}

// Profiles

export async function getProfile(userId: string) {
  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, userId));
  return profile;
}

export async function upsertProfile(data: {
  id: string;
  displayName?: string;
  avatarUrl?: string;
  language?: string;
  theme?: string;
  role?: string;
  speakingAutoplay?: boolean;
}) {
  const [profile] = await db
    .insert(profiles)
    .values({
      id: data.id,
      displayName: data.displayName,
      avatarUrl: data.avatarUrl,
      language: data.language || "en",
      theme: data.theme || "light",
      role: data.role || "user",
      ...(data.speakingAutoplay !== undefined && { speakingAutoplay: data.speakingAutoplay }),
    })
    .onConflictDoUpdate({
      target: profiles.id,
      set: {
        displayName: data.displayName,
        avatarUrl: data.avatarUrl,
        ...(data.language && { language: data.language }),
        ...(data.theme && { theme: data.theme }),
        ...(data.role && { role: data.role }),
        ...(data.speakingAutoplay !== undefined && { speakingAutoplay: data.speakingAutoplay }),
        updatedAt: new Date(),
      },
    })
    .returning();
  return profile;
}

export async function updateSpeakingAutoplay(userId: string, autoplay: boolean) {
  await db
    .update(profiles)
    .set({ speakingAutoplay: autoplay, updatedAt: new Date() })
    .where(eq(profiles.id, userId));
}
