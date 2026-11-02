import { z } from "zod";

import { db } from "@/lib/db";
import { writingQuestions } from "@/lib/db/schema";
import { requireAdmin } from "../../_auth";

const writingExamSchema = z.object({
  testTitle: z.string().trim().min(1),
  content: z.string().trim().min(1),
  imageUrl: z.string().trim().optional(),
  sourceUrl: z.string().trim().optional(),
  taskNumber: z.enum(["1", "2"]),
});

export async function POST(req: Request) {
  const admin = await requireAdmin(req);
  if (!admin.ok) return admin.response;

  const parsed = writingExamSchema.safeParse(await req.json());
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid writing question", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const [question] = await db
    .insert(writingQuestions)
    .values({
      testTitle: data.testTitle,
      content: data.content,
      imageUrl: data.imageUrl || null,
      sourceUrl: data.sourceUrl || null,
      taskNumber: data.taskNumber,
    })
    .returning();

  return Response.json({ ok: true, id: question.id });
}
