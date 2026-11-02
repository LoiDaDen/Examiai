import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getProfile, upsertProfile } from "@/lib/db/queries";

export async function requireAdmin(req: Request) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.match(/^Bearer\s+(.+)$/i)?.[1];

  if (!token) {
    return {
      ok: false as const,
      response: Response.json({ error: "Missing auth token" }, { status: 401 }),
    };
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return {
      ok: false as const,
      response: Response.json({ error: "Invalid auth token" }, { status: 401 }),
    };
  }

  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  const email = data.user.email?.toLowerCase();
  const isEnvAdmin =
    adminEmails.length === 0 ? false : !!email && adminEmails.includes(email);

  if (isEnvAdmin) {
    return { ok: true as const, user: data.user };
  }

  let isRoleAdmin = false;
  try {
    const profile =
      (await getProfile(data.user.id)) ??
      (await upsertProfile({
        id: data.user.id,
        displayName: data.user.user_metadata?.full_name,
        avatarUrl: data.user.user_metadata?.avatar_url,
      }));
    isRoleAdmin = profile.role === "admin";
  } catch (error) {
    console.error("Admin profile lookup failed", error);
    return {
      ok: false as const,
      response: Response.json(
        {
          error:
            "Admin profile lookup failed. Run db/profile-role-schema.sql, then set your profile role to admin.",
        },
        { status: 500 }
      ),
    };
  }

  if (!isRoleAdmin) {
    return {
      ok: false as const,
      response: Response.json({ error: "Admin access required" }, { status: 403 }),
    };
  }

  return { ok: true as const, user: data.user };
}
