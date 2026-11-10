import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function requireUser(req: Request) {
  const authorization = req.headers.get("authorization");

  const token = authorization
    ?.match(/^Bearer\s+(.+)$/i)?.[1];

  if (!token) {
    return {
      ok: false as const,
      response: Response.json(
        { error: "Missing auth token" },
        { status: 401 }
      ),
    };
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return {
      ok: false as const,
      response: Response.json(
        { error: "Invalid auth token" },
        { status: 401 }
      ),
    };
  }

  return {
    ok: true as const,
    user: data.user,
  };
}
