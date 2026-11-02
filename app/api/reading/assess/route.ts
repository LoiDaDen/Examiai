import { generateObject } from "ai";
import { z } from "zod";
import { chatModel } from "@/lib/ai/models";

export const maxDuration = 60;

const readingAssessmentSchema = z.object({
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

interface ReadingQuestionInput {
  id: string;
  prompt: string;
  answer: string;
  explanation: string;
}

function normalizeAnswer(value?: string) {
  return (value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\s*,\s*/g, ", ")
    .toLowerCase();
}

function splitAnswerParts(value?: string) {
  const trimmed = (value ?? "").trim();
  if (!trimmed) return [];

  if (trimmed.includes("\n")) {
    return trimmed
      .split("\n")
      .map((part) => part.trim())
      .filter(Boolean);
  }

  if (/^[A-G](\s*[,/]\s*[A-G])+$/i.test(trimmed)) {
    return trimmed
      .split(/[,/]/)
      .map((part) => part.trim())
      .filter(Boolean);
  }

  return [trimmed];
}

function canonicalAnswerPart(value: string) {
  const labelMatch = value.trim().match(/^([A-G])(?:[.)]\s+.*)?$/i);
  return labelMatch ? labelMatch[1].toUpperCase() : normalizeAnswer(value);
}

function isAnswerCorrect(userAnswer: string | undefined, correctAnswer: string) {
  const userSet = new Set(splitAnswerParts(userAnswer).map(canonicalAnswerPart));
  const correctSet = new Set(
    splitAnswerParts(correctAnswer).map(canonicalAnswerPart)
  );

  if (userSet.size === 0 || userSet.size !== correctSet.size) return false;
  return Array.from(correctSet).every((part) => userSet.has(part));
}

export async function POST(req: Request) {
  const {
    title,
    passage,
    questions,
    answers,
    score,
    total,
    language,
  }: {
    title: string;
    passage: string;
    questions: ReadingQuestionInput[];
    answers: Record<string, string>;
    score: number;
    total: number;
    language?: "en" | "vi";
  } = await req.json();

  const questionSummary = questions
    .map((question, index) => {
      const userAnswer = answers[question.id] || "(blank)";
      const result = isAnswerCorrect(userAnswer, question.answer)
        ? "correct"
        : "incorrect";
      return [
        `${index + 1}. ${question.prompt}`,
        `Student answer: ${userAnswer}`,
        `Correct answer: ${question.answer}`,
        `Result: ${result}`,
        `Explanation: ${question.explanation}`,
      ].join("\n");
    })
    .join("\n\n");

  const { object } = await generateObject({
    model: chatModel(),
    schema: readingAssessmentSchema,
    prompt: `You are an IELTS Reading tutor. Give concise, practical feedback on this student's Reading practice.
Reply in ${language === "vi" ? "Vietnamese with full diacritics" : "English"}.

Passage title: ${title}

Passage:
${passage}

Score: ${score}/${total}

Question results:
${questionSummary}

Return:
- overview: 1-2 sentences about performance
- strengths: specific reading strengths shown by the answers
- weaknesses: specific weaknesses, only if meaningful
- strategyAdvice: actionable IELTS Reading strategies for the missed question types
- questionReviews: one short review per question, especially clear for incorrect answers. Include the question number, result, studentAnswer, correctAnswer, a concise feedback sentence, the passage evidence if available, and a strategy for that question type.

Use simple language. Do not use em dashes.`,
  });

  return Response.json(object);
}
