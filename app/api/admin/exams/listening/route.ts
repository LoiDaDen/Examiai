import { z } from "zod";

import { db } from "@/lib/db";
import {
  listeningQuestions,
  listeningSections,
  listeningTests,
} from "@/lib/db/schema";
import { requireAdmin } from "../../_auth";

const listeningQuestionTypes = [
  "multiple-choice",
  "form-completion",
  "note-completion",
  "sentence-completion",
  "matching",
  "map-label",
] as const;

const listeningExamSchema = z.object({
  testTitle: z.string().trim().min(1),
  difficulty: z.string().trim().min(1).default("medium"),
  sections: z
    .array(
      z.object({
        sectionNumber: z.coerce.number().int().min(1).max(4),
        sectionTitle: z.string().trim().min(1),
        audioUrl: z.string().trim().optional(),
        transcript: z.string().trim().optional(),
        questions: z
          .array(
            z.object({
              questionType: z.enum(listeningQuestionTypes),
              questionText: z.string().trim().min(1),
              options: z.array(z.string().trim().min(1)).default([]),
              correctAnswer: z.string().trim().default(""),
              explanation: z.string().trim().default(""),
            })
          )
          .min(1),
      })
    )
    .min(1),
});

export async function POST(req: Request) {
  const admin = await requireAdmin(req);
  if (!admin.ok) return admin.response;

  const parsed = listeningExamSchema.safeParse(await req.json());
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid listening exam", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  const result = await db.transaction(async (tx) => {
    const [test] = await tx
      .insert(listeningTests)
      .values({
        title: data.testTitle,
        difficulty: data.difficulty,
      })
      .returning();

    const sectionIds: string[] = [];

    for (const sectionData of data.sections) {
      const [section] = await tx
        .insert(listeningSections)
        .values({
          testId: test.id,
          sectionNumber: sectionData.sectionNumber,
          title: sectionData.sectionTitle,
          audioUrl: sectionData.audioUrl || null,
          transcript: sectionData.transcript || null,
        })
        .returning();

      sectionIds.push(section.id);

      await tx.insert(listeningQuestions).values(
        sectionData.questions.map((question, index) => ({
          sectionId: section.id,
          questionType: question.questionType,
          questionText: question.questionText,
          options: question.options.length > 0 ? question.options : null,
          correctAnswer: question.correctAnswer,
          explanation: question.explanation,
          orderIndex: index + 1,
        }))
      );
    }

    return { test, sectionIds };
  });

  return Response.json({
    ok: true,
    testId: result.test.id,
    sectionIds: result.sectionIds,
  });
}
