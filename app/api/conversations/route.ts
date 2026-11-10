import { z } from "zod";

import {
  createConversation,
  getConversation,
  getUserConversations,
  deleteConversation,
  updateConversationTitle,
  upsertProfile,
} from "@/lib/db/queries";

import { requireUser } from "@/lib/auth/require-user";

const createSchema = z.object({
  userId: z.string().uuid().optional(),
  type: z.enum([
    "general",
    "writing",
    "speaking",
    "reading",
    "listening",
  ]).default("general"),
  title: z.string().trim().max(255).optional(),
});

const renameSchema = z.object({
  id: z.string().uuid(),
  title: z.string().trim().min(1).max(255),
});

const deleteSchema = z.object({
  id: z.string().uuid(),
});

async function parseBody(req: Request) {
  try {
    return await req.json();
  } catch {
    return null;
  }
}

function forbidden() {
  return Response.json(
    { error: "Forbidden" },
    { status: 403 }
  );
}

function notFound() {
  return Response.json(
    { error: "Conversation not found" },
    { status: 404 }
  );
}

export async function GET(req: Request) {
  const auth = await requireUser(req);
  if (!auth.ok) return auth.response;

  const userId = new URL(req.url)
    .searchParams.get("userId");

  if (userId && userId !== auth.user.id) {
    return forbidden();
  }

  const conversations =
    await getUserConversations(auth.user.id);

  return Response.json({ conversations });
}

export async function POST(req: Request) {
  const auth = await requireUser(req);
  if (!auth.ok) return auth.response;

  const parsed = createSchema.safeParse(
    await parseBody(req)
  );

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }

  const data = parsed.data;

  if (
    data.userId &&
    data.userId !== auth.user.id
  ) {
    return forbidden();
  }

  await upsertProfile({ id: auth.user.id });

  const conversation = await createConversation({
    userId: auth.user.id,
    type: data.type,
    title: data.title,
  });

  return Response.json(conversation, {
    status: 201,
  });
}

export async function PATCH(req: Request) {
  const auth = await requireUser(req);
  if (!auth.ok) return auth.response;

  const parsed = renameSchema.safeParse(
    await parseBody(req)
  );

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }

  const { id, title } = parsed.data;
  const conversation = await getConversation(id);

  if (
    !conversation ||
    conversation.userId !== auth.user.id
  ) {
    return notFound();
  }

  await updateConversationTitle(id, title);

  return Response.json({ success: true });
}

export async function DELETE(req: Request) {
  const auth = await requireUser(req);
  if (!auth.ok) return auth.response;

  const parsed = deleteSchema.safeParse(
    await parseBody(req)
  );

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }

  const { id } = parsed.data;
  const conversation = await getConversation(id);

  if (
    !conversation ||
    conversation.userId !== auth.user.id
  ) {
    return notFound();
  }

  await deleteConversation(id);

  return Response.json({ success: true });
}
