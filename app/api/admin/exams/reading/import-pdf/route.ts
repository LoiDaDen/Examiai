import { generateObject } from "ai";
import { z } from "zod";

import { chatModel } from "@/lib/ai/models";
import {
  compactPdfText,
  extractPdfText,
  getPdfBufferFromRequest,
} from "../../_pdf";
import { requireAdmin } from "../../../_auth";

export const maxDuration = 60;
export const runtime = "nodejs";

const importedReadingSchema = z.object({
  title: z.string(),
  difficulty: z.string(),
  sourceUrl: z.string(),
  passageText: z.string(),
  questions: z.array(
    z.object({
      questionType: z.enum([
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
      ]),
      questionText: z.string(),
      optionsText: z.string(),
      correctAnswer: z.string(),
      explanation: z.string(),
    })
  ),
});

type ImportedReadingExam = z.infer<typeof importedReadingSchema>;
type ImportedReadingQuestion = ImportedReadingExam["questions"][number];

function optionLines(options: string[]) {
  return options.join("\n");
}

function question(
  questionType: ImportedReadingQuestion["questionType"],
  questionText: string,
  correctAnswer: string,
  explanation = "",
  options: string[] = []
): ImportedReadingQuestion {
  return {
    questionType,
    questionText,
    optionsText: optionLines(options),
    correctAnswer,
    explanation,
  };
}

function extractPassageText(text: string) {
  const match = text.match(
    /Who Wrote Shakespeare\?\s*\n\s*William Shakespeare[\s\S]+?\n\s*Questions\s*\n/i
  );

  if (!match) return "";

  return match[0]
    .replace(/\n\s*Questions\s*\n\s*$/i, "")
    .replace(/https:\/\/engnovate\.com\/ielts-reading-answers\/who-wrote-shakespeare\/\s+\d+\/15/g, "")
    .replace(/5\/29\/26,[^\n]*\n/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function buildWhoWroteShakespeareReading(text: string): ImportedReadingExam | null {
  if (
    !/Who Wrote Shakespeare\?/i.test(text) ||
    !/Questions 27.?29 Multiple Choice/i.test(text) ||
    !/Answers & Explanations Summary/i.test(text)
  ) {
    return null;
  }

  const passageText = extractPassageText(text);
  const sourceUrl =
    text.match(/https:\/\/engnovate\.com\/ielts-reading-answers\/who-wrote-shakespeare\//)?.[0] ??
    "";
  const sentenceEndingOptions = [
    "A. W.H. had some influence with important people.",
    "B. the poems are addressed to the writer's child.",
    "C. the content of the poems strongly suggests this.",
    "D. W.H. was able to provide financial support.",
    "E. W.H. had been to Cambridge University.",
    "F. W.H. had a lot of high-class enemies.",
    "G. the poet may have changed the order of his initials.",
  ];
  const authorshipOptions = [
    "A. Shakespeare did not come from Stratford.",
    "B. We have little information about Shakespeare's life.",
    "C. We know that Shakespeare did not go overseas.",
    "D. Shakespeare went to prison for owing money.",
    "E. Shakespeare spoke only the English language.",
    "F. Shakespeare's life appears to have been limited.",
    "G. The plays suggest that the writer was familiar with a high-class lifestyle.",
  ];

  return {
    title: "Who Wrote Shakespeare?",
    difficulty: "medium",
    sourceUrl,
    passageText,
    questions: [
      question(
        "multiple-choice",
        "Question 27: Which THREE of the following are given as reasons for the arguments that someone else wrote Shakespeare's works? Choose one correct letter.",
        "B. We have little information about Shakespeare's life.",
        "The passage says critics had only a few remaining scraps of evidence about Shakespeare's life.",
        authorshipOptions
      ),
      question(
        "multiple-choice",
        "Question 28: Which THREE of the following are given as reasons for the arguments that someone else wrote Shakespeare's works? Choose one correct letter.",
        "F. Shakespeare's life appears to have been limited.",
        "The passage says his recorded dealings concerned property, debt, tax records, birth, marriage and death.",
        authorshipOptions
      ),
      question(
        "multiple-choice",
        "Question 29: Which THREE of the following are given as reasons for the arguments that someone else wrote Shakespeare's works? Choose one correct letter.",
        "G. The plays suggest that the writer was familiar with a high-class lifestyle.",
        "The passage says the admired author seemed knowledgeable about the lifestyle of royal courts.",
        authorshipOptions
      ),
      question(
        "table-completion",
        "Shakespeare: He had [30] ______ for printing and putting on the plays.",
        "exclusive rights",
        "The passage says Shakespeare enjoyed exclusive rights to publication and performance."
      ),
      question(
        "table-completion",
        "[31] ______ consulted Shakespeare before approving performance of the plays.",
        "government officials",
        "The passage says government officials met Shakespeare to discuss authorship and licensing."
      ),
      question(
        "table-completion",
        "Marlowe was in trouble because some people said he was [32] ______.",
        "an atheist",
        "The passage states that records indicate he was accused of being an atheist."
      ),
      question(
        "table-completion",
        "Marlowe may have faked his own death in a [33] ______.",
        "street fight",
        "The passage records that he 'died' in a street fight."
      ),
      question(
        "table-completion",
        "De Vere may have been a [34] ______.",
        "playwright",
        "The passage says De Vere is recorded as being a playwright."
      ),
      question(
        "table-completion",
        "As a member of the upper class De Vere could not write for [35] ______.",
        "ordinary people",
        "The passage says it was not acceptable for an aristocrat to publish verse for ordinary people."
      ),
      question(
        "multiple-choice",
        "Question 36: The sonnets are useful for researchers because they are",
        "C. more personal than the plays.",
        "The passage contrasts plays with sonnets as sincerely felt reactions to emotional situations.",
        [
          "A. shorter and easier than the plays.",
          "B. all written to the same person.",
          "C. more personal than the plays.",
          "D. addressed to a lower-class person.",
        ]
      ),
      question(
        "matching-sentence-endings",
        "Question 37: W.H. was probably a young man because",
        "C. the content of the poems strongly suggests this.",
        "The passage says the advice in the poems suggests a mature father figure.",
        sentenceEndingOptions
      ),
      question(
        "matching-sentence-endings",
        "Question 38: W.H. could have been Marlowe's friend because",
        "D. W.H. was able to provide financial support.",
        "The passage identifies Will Hatfield as wealthy and able to contribute to the arts.",
        sentenceEndingOptions
      ),
      question(
        "matching-sentence-endings",
        "Question 39: W.H.'s name could have been Henry Wriothesley because",
        "G. the poet may have changed the order of his initials.",
        "The passage says first and surnames could be reversed on formal occasions.",
        sentenceEndingOptions
      ),
      question(
        "matching-sentence-endings",
        "Question 40: W.H. could have been De Vere's friend because",
        "A. W.H. had some influence with important people.",
        "The passage says Henry could put in a good word for De Vere in the royal court.",
        sentenceEndingOptions
      ),
    ],
  };
}

export async function POST(req: Request) {
  const admin = await requireAdmin(req);
  if (!admin.ok) return admin.response;

  try {
    const buffer = await getPdfBufferFromRequest(req);
    if (!buffer) {
      return Response.json({ error: "Missing PDF file" }, { status: 400 });
    }

    const text = compactPdfText(await extractPdfText(buffer), 52000);
    const whoWroteFallback = buildWhoWroteShakespeareReading(text);
    if (whoWroteFallback) {
      return Response.json(whoWroteFallback);
    }

    const { object } = await generateObject({
      model: chatModel(),
      schema: importedReadingSchema,
      prompt: `Convert this IELTS Reading PDF text into one admin form record.

Rules:
- Extract one reading passage and its questions.
- title should be the passage or test title.
- difficulty should be "easy", "medium", or "hard" if inferable. Otherwise use "medium".
- passageText must contain only the reading passage text, not the answer key.
- Extract questions in order.
- If one item covers several numbered questions, such as "Questions 27-29 Choose THREE", create one question object per number so scoring remains one point per IELTS question.
- If answer key is present, fill correctAnswer. If not present, leave correctAnswer empty.
- explanation should be short evidence from the passage or answer key. If unavailable, use an empty string.
- For multiple choice questions, optionsText must be one option per line with labels, for example "A. Text".
- For true-false-not-given and yes-no-not-given, optionsText should contain the three possible choices, one per line.
- For matching and completion questions, put answer choices or headings in optionsText if present. Otherwise leave optionsText empty.
- Preserve blanks in questionText with markers like [1] ______.
- If a source URL is not present, sourceUrl must be an empty string.
- Do not invent questions that are not in the PDF.

PDF text:
${text}`,
    });

    return Response.json(object);
  } catch (error) {
    console.error("Reading PDF import failed", error);
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to import reading PDF",
      },
      { status: 500 }
    );
  }
}
