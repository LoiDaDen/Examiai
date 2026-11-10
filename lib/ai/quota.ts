import { sql } from "drizzle-orm";
import { db } from "@/lib/db";

type AiFeature = "chat" | "speaking" | "writing";
type LimitScope = "global" | "user";

const GLOBAL_DAILY_LIMIT = 35;
const USER_DAILY_LIMIT = 15;

const FEATURE_COST: Record<AiFeature, number> = {
  chat: 1,
  speaking: 3,
  writing: 12,
};

const GLOBAL_SUBJECT_ID =
  "00000000-0000-0000-0000-000000000000";

class QuotaExceeded extends Error {
  constructor(readonly scope: LimitScope) {
    super(`AI quota exceeded: ${scope}`);
    this.name = "QuotaExceeded";
  }
}

export async function reserveAiQuota(
  userId: string,
  feature: AiFeature
): Promise<Response | null> {
  const units = FEATURE_COST[feature];

  try {
    await db.transaction(async (tx) => {
      // Reserve from the shared Staging budget.
      const globalRows = await tx.execute(sql`
        INSERT INTO public.ai_daily_quota
          (quota_date, scope, subject_id, used_units)
        VALUES (
          (NOW() AT TIME ZONE 'UTC')::date,
          'global',
          ${GLOBAL_SUBJECT_ID}::uuid,
          ${units}
        )
        ON CONFLICT (quota_date, scope, subject_id)
        DO UPDATE SET
          used_units =
            ai_daily_quota.used_units + EXCLUDED.used_units,
          updated_at = NOW()
        WHERE
          ai_daily_quota.used_units + EXCLUDED.used_units
            <= ${GLOBAL_DAILY_LIMIT}
        RETURNING used_units
      `);

      if (globalRows.length === 0) {
        throw new QuotaExceeded("global");
      }

      // Reserve from this user's individual budget.
      const userRows = await tx.execute(sql`
        INSERT INTO public.ai_daily_quota
          (quota_date, scope, subject_id, used_units)
        VALUES (
          (NOW() AT TIME ZONE 'UTC')::date,
          'user',
          ${userId}::uuid,
          ${units}
        )
        ON CONFLICT (quota_date, scope, subject_id)
        DO UPDATE SET
          used_units =
            ai_daily_quota.used_units + EXCLUDED.used_units,
          updated_at = NOW()
        WHERE
          ai_daily_quota.used_units + EXCLUDED.used_units
            <= ${USER_DAILY_LIMIT}
        RETURNING used_units
      `);

      if (userRows.length === 0) {
        throw new QuotaExceeded("user");
      }
    });

    return null;
  } catch (error) {
    if (!(error instanceof QuotaExceeded)) {
      throw error;
    }

    const resetAt = new Date();
    resetAt.setUTCHours(24, 0, 0, 0);

    return Response.json(
      {
        error: "AI_QUOTA_EXCEEDED",
        scope: error.scope,
        feature,
        message:
          "AI usage limit reached. Please try again later.",
        resetAt: resetAt.toISOString(),
      },
      {
        status: 429,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}
