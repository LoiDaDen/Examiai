import { after } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth/require-user";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const BUCKET = "tts-cache";

async function hashText(text: string): Promise<string> {
  const encoded = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

const ttsSchema = z.object({
  text: z.string().trim().min(1).max(4000),
});

export async function POST(req: Request) {
  const auth = await requireUser(req);
  if (!auth.ok) return auth.response;

  const contentLength = Number(
    req.headers.get("content-length") || 0
  );

  if (contentLength > 20000) {
    return Response.json(
      { error: "Text request too large" },
      { status: 413 }
    );
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

  const parsed = ttsSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid TTS text" },
      { status: 400 }
    );
  }

  const { text } = parsed.data;
  const hash = await hashText(text);
  const filePath = `${hash}.mp3`;

  const supabase = createServerSupabaseClient();

  // Check cache
  const { data: cached } = await supabase.storage
    .from(BUCKET)
    .download(filePath);

  if (cached) {
    return new Response(cached, {
      headers: { "Content-Type": "audio/mpeg" },
    });
  }

  // Generate from Deepgram
  const response = await fetch(
    "https://api.deepgram.com/v1/speak?model=aura-2-odysseus-en",
    {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
        "Content-Type": "text/plain",
      },
      body: text,
    },
  );

  if (!response.ok) {
    return new Response("TTS failed", { status: response.status });
  }

  const audioBuffer = await response.arrayBuffer();

  // Store to cache in background (doesn't delay the response)
  after(async () => {
    await supabase.storage
      .from(BUCKET)
      .upload(filePath, Buffer.from(audioBuffer), {
        contentType: "audio/mpeg",
        upsert: true,
      });
  });

  return new Response(audioBuffer, {
    headers: { "Content-Type": "audio/mpeg" },
  });
}
