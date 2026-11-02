import { z } from "zod";
import { sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { speakingQuestions } from "@/lib/db/schema";
import { requireAdmin } from "../../_auth";

const speakingExamSchema = z.object({
  testTitle: z.string().trim().min(1),
  content: z.string().trim().min(1),
  sourceUrl: z.string().trim().optional(),
  partNumber: z.enum(["1", "2", "3"]),
});

export async function POST(req: Request) {
  const admin = await requireAdmin(req);
  if (!admin.ok) return admin.response;

  const parsed = speakingExamSchema.safeParse(await req.json());
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid speaking question", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  const [question] = await db.transaction(async (tx) => {
    const [row] = await tx
      .select({
        nextId: sql<number>`coalesce(max(${speakingQuestions.id}), 0) + 1`,
      })
      .from(speakingQuestions);

    return tx
      .insert(speakingQuestions)
      .values({
        id: row.nextId,
        testTitle: data.testTitle,
        content: data.content,
        sourceUrl: data.sourceUrl || null,
        partNumber: data.partNumber,
      })
      .returning();
  });

  return Response.json({ ok: true, id: question.id });
}
