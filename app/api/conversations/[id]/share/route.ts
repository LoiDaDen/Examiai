import { z } from "zod";

import {
  getConversation,
  setConversationShareId,
} from "@/lib/db/queries";

import { requireUser } from "@/lib/auth/require-user";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireUser(req);
  if (!auth.ok) return auth.response;

  const { id } = await params;

  if (!z.string().uuid().safeParse(id).success) {
    return Response.json(
      { error: "Invalid conversation ID" },
      { status: 400 }
    );
  }

  const conversation = await getConversation(id);

  if (
    !conversation ||
    conversation.userId !== auth.user.id
  ) {
    return Response.json(
      { error: "Conversation not found" },
      { status: 404 }
    );
  }

  const shareId = await setConversationShareId(id);

  return Response.json({ shareId });
}
