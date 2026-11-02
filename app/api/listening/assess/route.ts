import { generateObject } from "ai";
import { z } from "zod";
import { chatModel } from "@/lib/ai/models";

export const maxDuration = 60;

const listeningAssessmentSchema = z.object({
  overview: z.string(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  strategyAdvice: z.array(z.string()),
  questionReviews: z.array(
    z.object({
      questionNumber: z.number(),
      result: z.enum(["correct", "incorrect"]),
      studentAnswer: z.string(),
      correctAnswer: z.string(),
      feedback: z.string(),
      evidence: z.string(),
      strategy: z.string(),
    })
  ),
});

interface ListeningQuestionInput {
  id: string;
  prompt: string;
  type: string;
  answer: string;
  explanation: string;
}

export async function POST(req: Request) {
  const {
    title,
    transcript,
    questions,
    answers,
    score,
    total,
    language,
  }: {
    title: string;
    transcript?: string | null;
    questions: ListeningQuestionInput[];
    answers: Record<string, string>;
    score: number;
    total: number;
    language?: "en" | "vi";
  } = await req.json();

  const questionSummary = questions
    .map((question, index) => {
      const userAnswer = answers[question.id] || "(blank)";
      const result = userAnswer === question.answer ? "correct" : "incorrect";
      return [
        `${index + 1}. ${question.prompt}`,
        `Type: ${question.type}`,
        `Student answer: ${userAnswer}`,
        `Correct answer: ${question.answer}`,
        `Result: ${result}`,
        `Explanation: ${question.explanation}`,
      ].join("\n");
    })
    .join("\n\n");

  const { object } = await generateObject({
    model: chatModel(),
    schema: listeningAssessmentSchema,
    prompt: `You are an IELTS Listening tutor. Give concise, practical feedback on this student's Listening practice.
Reply in ${language === "vi" ? "Vietnamese with full diacritics" : "English"}.

Section title: ${title}

Transcript:
${transcript || "No transcript was provided. Base feedback on the question results and explanations."}

Score: ${score}/${total}

Question results:
${questionSummary}

Return:
- overview: 1-2 sentences about performance
- strengths: specific listening strengths shown by the answers
- weaknesses: specific weaknesses, only if meaningful
- strategyAdvice: actionable IELTS Listening strategies for the missed question types
- questionReviews: one short review per question, especially clear for incorrect answers. Include the question number, result, studentAnswer, correctAnswer, a concise feedback sentence, transcript evidence or explanation if available, and a listening strategy for that question type.

Use simple language. Do not use em dashes.`,
  });

  return Response.json(object);
}
