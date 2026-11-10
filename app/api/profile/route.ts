import {
  getProfile,
  updateSpeakingAutoplay,
  upsertProfile,
} from "@/lib/db/queries";

import { requireUser } from "@/lib/auth/require-user";

export async function GET(req: Request) {
  const auth = await requireUser(req);

  if (!auth.ok) {
    return auth.response;
  }

  const userId = new URL(req.url).searchParams.get("userId");

  if (userId && userId !== auth.user.id) {
    return Response.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  const profile =
    (await getProfile(auth.user.id)) ??
    (await upsertProfile({ id: auth.user.id }));

  return Response.json(profile);
}

export async function PATCH(req: Request) {
  const auth = await requireUser(req);

  if (!auth.ok) {
    return auth.response;
  }

  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return Response.json(
      { error: "Invalid JSON" },
      { status: 400 }
    );
  }

  if (!body || typeof body !== "object") {
    return Response.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }

  const data = body as {
    userId?: unknown;
    speakingAutoplay?: unknown;
  };

  if (
    data.userId !== undefined &&
    data.userId !== auth.user.id
  ) {
    return Response.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  if (typeof data.speakingAutoplay !== "boolean") {
    return Response.json(
      { error: "Invalid speakingAutoplay" },
      { status: 400 }
    );
  }

  await updateSpeakingAutoplay(
    auth.user.id,
    data.speakingAutoplay
  );

  return Response.json({ ok: true });
}
