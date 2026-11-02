import { getRandomReadingPassage } from "@/lib/db/queries";

export async function POST() {
  let result;
  try {
    result = await getRandomReadingPassage();
  } catch {
    return Response.json(
      { error: "Reading tables are not ready. Run db/reading-schema.sql and db/seed-reading.sql." },
      { status: 503 }
    );
  }

  if (!result) {
    return Response.json(
      { error: "No reading passages available" },
      { status: 404 }
    );
  }

  return Response.json({
    passage: {
      id: result.passage.id,
      title: result.passage.title,
      passageText: result.passage.passageText,
      difficulty: result.passage.difficulty,
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
