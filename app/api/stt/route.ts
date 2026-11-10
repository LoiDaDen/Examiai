import { requireUser } from "@/lib/auth/require-user";

export async function POST(request: Request) {
  const auth = await requireUser(request);
  if (!auth.ok) return auth.response;

  const contentLength = Number(
    request.headers.get("content-length") || 0
  );

  if (contentLength > 12 * 1024 * 1024) {
    return Response.json(
      { error: "Audio request too large" },
      { status: 413 }
    );
  }
  const { getRandomApiKey } = await import("@/lib/ai/models");
  const apiKey = getRandomApiKey();
  if (!apiKey) {
    return Response.json(
      { error: "STT service not configured" },
      { status: 500 },
    );
  }

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return Response.json(
      { error: "Invalid audio request" },
      { status: 400 }
    );
  }

  const audio = formData.get("audio");

  if (!(audio instanceof Blob) || audio.size === 0) {
    return Response.json(
      { error: "No valid audio provided" },
      { status: 400 }
    );
  }

  if (audio.size > 10 * 1024 * 1024) {
    return Response.json(
      { error: "Audio file too large" },
      { status: 413 }
    );
  }

  const fireworksForm = new FormData();
  fireworksForm.append("file", audio, "audio.webm");
  fireworksForm.append("model", "whisper-v3-turbo");
  fireworksForm.append("language", "en");
  fireworksForm.append("response_format", "json");

  const res = await fetch(
    "https://audio-turbo.api.fireworks.ai/v1/audio/transcriptions",
    {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: fireworksForm,
    },
  );

  if (!res.ok) {
    const error = await res.text();
    console.error("[STT] Fireworks error:", res.status, error);
    return Response.json(
      { error: "Transcription failed" },
      { status: res.status },
    );
  }

  const data = await res.json();
  return Response.json({ text: data.text || "" });
}

