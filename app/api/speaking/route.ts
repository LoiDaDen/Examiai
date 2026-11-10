import { streamText, tool, stepCountIs, convertToModelMessages } from "ai";
import { z } from "zod";
import type { UIMessage } from "ai";
import { requireUser } from "@/lib/auth/require-user";
import { chatModel } from "@/lib/ai/models";
import { reserveAiQuota } from "@/lib/ai/quota";
import {
  SPEAKING_SYSTEM_PROMPT,
  SPEAKING_FIRST_QUESTION_PROMPT,
} from "@/lib/ai/prompts";
import {
  getRandomSpeakingQuestions,
  addMessage,
  getConversation,
} from "@/lib/db/queries";

export const maxDuration = 60;

const uiMessageSchema = z.custom<UIMessage>((value) => {
  if (!value || typeof value !== "object") return false;

  const msg = value as Record<string, unknown>;

  return (
    typeof msg.id === "string" &&
    msg.id.length > 0 &&
    (msg.role === "user" || msg.role === "assistant") &&
    Array.isArray(msg.parts) &&
    msg.parts.every(
      (part: unknown) =>
        !!part &&
        typeof part === "object" &&
        typeof (part as Record<string, unknown>).type === "string"
    )
  );
});

const requestSchema = z.object({
  messages: z.array(uiMessageSchema).min(1).max(80),
  questions: z.array(
    z.object({
      partNumber: z.enum(["1", "2", "3"]),
      title: z.string().min(1).max(300),
      content: z.string().min(1).max(5000),
    })
  ).min(1).max(20),
  conversationId: z.string().uuid().nullable().optional(),
});

export async function POST(req: Request) {
  const auth = await requireUser(req);
  if (!auth.ok) return auth.response;

  let raw: string;

  try {
    const length = Number(req.headers.get("content-length") || 0);

    if (length > 100000) {
      return Response.json(
        { error: "Request too large" },
        { status: 413 }
      );
    }

    raw = await req.text();
  } catch {
    return Response.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }

  if (raw.length > 100000) {
    return Response.json(
      { error: "Request too large" },
      { status: 413 }
    );
  }

  let body: unknown;

  try {
    body = JSON.parse(raw);
  } catch {
    return Response.json(
      { error: "Invalid JSON" },
      { status: 400 }
    );
  }

  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid Speaking request" },
      { status: 400 }
    );
  }

  const { messages, questions, conversationId } = parsed.data;

  if (conversationId) {
    const conversation = await getConversation(conversationId);

    if (
      !conversation ||
      conversation.userId !== auth.user.id
    ) {
      return Response.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }
  }

  const questionsContext = questions
    .map(
      (q: { partNumber: string; title: string; content: string }) =>
        `Part ${q.partNumber} - ${q.title}:\n${q.content}`,
    )
    .join("\n\n");

  const isFirstTurn =
    messages.length === 1 && messages[0]?.role === "user";

  const systemPrompt = (
    isFirstTurn ? SPEAKING_FIRST_QUESTION_PROMPT : SPEAKING_SYSTEM_PROMPT
  ).replace("{{QUESTIONS}}", questionsContext);

  const quotaFailure = await reserveAiQuota(
    auth.user.id,
    "speaking"
  );

  if (quotaFailure) return quotaFailure;

  const result = streamText({
    model: chatModel(),
    maxRetries: 0,
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    tools: isFirstTurn
      ? undefined
      : {
          fetchMoreQuestions: tool({
            description:
              "Fetch additional speaking questions when the user explicitly asks to continue practicing. Only use this when the user requests more questions after completing the current set.",
            inputSchema: z.object({
              partNumbers: z
                .array(z.enum(["1", "2", "3"]))
                .describe("Which parts to fetch questions for"),
            }),
            execute: async ({ partNumbers }) => {
              const newQuestions =
                await getRandomSpeakingQuestions(partNumbers);
              return newQuestions.map((q) => ({
                partNumber: q.partNumber,
                title: q.testTitle,
                content: q.content,
              }));
            },
          }),
        },
    stopWhen: stepCountIs(3),
    onFinish: async ({ text }) => {
      if (conversationId && text) {
        try {
          await addMessage({
            conversationId,
            role: "assistant",
            content: text,
          });
        } catch (err) {
          console.error("[speaking] Failed to save assistant message:", err);
        }
      }
    },
  });

  return result.toUIMessageStreamResponse({
    onError: (error) => {
      const apiError = error as {
        statusCode?: number;
        message?: string;
      };

      const message = apiError?.message ?? "";

      if (
        apiError?.statusCode === 429 ||
        /rate limit|free-models-per-day/i.test(message)
      ) {
        return "AI_FREE_QUOTA_EXCEEDED";
      }

      console.error("[speaking] Stream failed:", message);
      return "AI_SPEAKING_UNAVAILABLE";
    },
  });
}
