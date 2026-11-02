import { z } from "zod";

import { db } from "@/lib/db";
import { readingPassages, readingQuestions } from "@/lib/db/schema";
import { requireAdmin } from "../../_auth";

const readingQuestionTypes = [
  "multiple-choice",
  "true-false-not-given",
  "yes-no-not-given",
  "matching-headings",
  "matching-information",
  "matching-features",
  "matching-sentence-endings",
  "sentence-completion",
  "summary-completion",
  "table-completion",
  "flow-chart-completion",
  "diagram-label",
  "choose-a-title",
  "short-answer",
  "classification",
] as const;

const readingExamSchema = z.object({
  title: z.string().trim().min(1),
  passageText: z.string().trim().min(1),
  sourceUrl: z.string().trim().optional(),
  difficulty: z.string().trim().min(1).default("medium"),
  questions: z
    .array(
      z.object({
        questionType: z.enum(readingQuestionTypes),
        questionText: z.string().trim().min(1),
        options: z.array(z.string().trim().min(1)).default([]),
        correctAnswer: z.string().trim().min(1),
        explanation: z.string().trim().min(1),
      })
    )
    .min(1),
});

export async function POST(req: Request) {
  const admin = await requireAdmin(req);
  if (!admin.ok) return admin.response;

  const parsed = readingExamSchema.safeParse(await req.json());
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid reading exam", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  const result = await db.transaction(async (tx) => {
    const [passage] = await tx
      .insert(readingPassages)
      .values({
        title: data.title,
        passageText: data.passageText,
        sourceUrl: data.sourceUrl || null,
        difficulty: data.difficulty,
      })
      .returning();

    await tx.insert(readingQuestions).values(
      data.questions.map((question, index) => ({
        passageId: passage.id,
        questionType: question.questionType,
        questionText: question.questionText,
        options: question.options.length > 0 ? question.options : null,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        orderIndex: index + 1,
      }))
    );

    return passage;
  });

  return Response.json({ ok: true, id: result.id });
}
