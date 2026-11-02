import { getRandomListeningSection } from "@/lib/db/queries";

export async function POST() {
  let result;
  try {
    result = await getRandomListeningSection();
  } catch {
    return Response.json(
      {
        error:
          "Listening tables are not ready. Run db/listening-schema.sql and db/seed-listening.sql.",
      },
      { status: 503 }
    );
  }

  if (!result) {
    return Response.json(
      { error: "No listening sections available" },
      { status: 404 }
    );
  }

  return Response.json({
    section: {
      id: result.section.id,
      testId: result.section.testId,
      title: result.section.title,
      testTitle: result.section.testTitle,
      sectionNumber: result.section.sectionNumber,
      audioUrl: result.section.audioUrl,
      transcript: result.section.transcript,
      difficulty: result.section.difficulty,
    },
    questions: result.questions.map((question) => ({
      id: question.id,
      type: question.questionType,
      prompt: question.questionText,
      options: question.options ?? [],
      answer: question.correctAnswer,
      explanation: question.explanation,
      orderIndex: question.orderIndex,
    })),
  });
}
