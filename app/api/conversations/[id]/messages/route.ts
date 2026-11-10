import { z } from "zod";

import {
  getConversation,
  getMessages,
  addMessage,
} from "@/lib/db/queries";

import { requireUser } from "@/lib/auth/require-user";

const idSchema = z.string().uuid();

const messageSchema = z.object({
  role: z.enum(["user", "system"]),
  content: z.string().min(1).max(100000),
});

async function authorizeConversation(
  req: Request,
  id: string
) {
  const auth = await requireUser(req);

  if (!auth.ok) return auth;

  if (!idSchema.safeParse(id).success) {
    return {
      ok: false as const,
      response: Response.json(
        { error: "Invalid conversation ID" },
        { status: 400 }
      ),
    };
  }

  const conversation = await getConversation(id);

  if (
    !conversation ||
    conversation.userId !== auth.user.id
  ) {
    return {
      ok: false as const,
      response: Response.json(
        { error: "Conversation not found" },
        { status: 404 }
      ),
    };
  }

  return { ok: true as const };
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const auth = await authorizeConversation(req, id);
  if (!auth.ok) return auth.response;

  const msgs = await getMessages(id);

  return Response.json({ messages: msgs });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const auth = await authorizeConversation(req, id);
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

  const parsed = messageSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid message" },
      { status: 400 }
    );
  }

  const message = await addMessage({
    conversationId: id,
    ...parsed.data,
  });

  return Response.json(message, { status: 201 });
}
