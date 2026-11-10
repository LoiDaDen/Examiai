import { z } from "zod";

import {
  getConversation,
  updateConversationTitle,
} from "@/lib/db/queries";

import { requireUser } from "@/lib/auth/require-user";

const schema = z.object({
  message: z.string().trim().min(1).max(10000),
  conversationId: z.string().uuid(),
});

export async function POST(req: Request) {
  const auth = await requireUser(req);
  if (!auth.ok) return auth.response;

  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return Response.json(
      { error: "Invalid JSON" },
      { status: 400 }
    );
  }

  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }

  const { message, conversationId } = parsed.data;

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

  // Generate a short title without calling AI.
  const title =
    message.replace(/\s+/g, " ").trim().slice(0, 80) ||
    "IELTS Practice";

  await updateConversationTitle(conversationId, title);

  return Response.json({ title });
}
