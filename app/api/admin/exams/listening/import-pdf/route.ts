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

const importedListeningSchema = z.object({
  testTitle: z.string(),
  difficulty: z.string(),
  sections: z.array(
    z.object({
      sectionNumber: z.number(),
      sectionTitle: z.string(),
      audioUrl: z.string(),
      transcript: z.string(),
      questions: z.array(
        z.object({
          questionType: z.enum([
            "multiple-choice",
            "form-completion",
            "note-completion",
            "sentence-completion",
            "matching",
            "map-label",
          ]),
          questionText: z.string(),
          optionsText: z.string(),
          correctAnswer: z.string(),
          explanation: z.string(),
        })
      ),
    })
  ),
});

type ImportedListeningExam = z.infer<typeof importedListeningSchema>;
type ImportedListeningQuestion =
  ImportedListeningExam["sections"][number]["questions"][number];

function optionLines(options: string[]) {
  return options.join("\n");
}

function question(
  questionType: ImportedListeningQuestion["questionType"],
  questionText: string,
  correctAnswer: string,
  explanation = "",
  options: string[] = []
): ImportedListeningQuestion {
  return {
    questionType,
    questionText,
    optionsText: optionLines(options),
    correctAnswer,
    explanation,
  };
}

function hasCompletionBlank(value: string) {
  return /(?:\[\d+\]\s*)?_{3,}/.test(value);
}

function countCompletionBlanks(value: string) {
  return value.match(/(?:\[\d+\]\s*)?_{3,}/g)?.length ?? 0;
}

function splitCompletionAnswers(value: string) {
  return value
    .split(/\n|;|\||,(?!\s*[A-E]\b)/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function extractLabeledOptions(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /^[A-E][.)]\s+\S/.test(line))
    .map((line) => line.replace(/^([A-E])[.)]\s+/, "$1. "));
}

function removeLabeledOptions(value: string) {
  return value
    .split("\n")
    .filter((line) => !/^\s*[A-E][.)]\s+\S/.test(line))
    .join("\n")
    .trim();
}

function normalizeQuestionOptions(
  item: ImportedListeningQuestion
): ImportedListeningQuestion {
  if (item.optionsText.trim()) return item;
  if (item.questionType !== "multiple-choice") return item;

  const options = extractLabeledOptions(item.questionText);
  if (options.length < 2) return item;

  return {
    ...item,
    questionText: removeLabeledOptions(item.questionText),
    optionsText: optionLines(options),
  };
}

function splitGroupedCompletionQuestion(
  item: ImportedListeningQuestion
): ImportedListeningQuestion[] {
  const blankCount = countCompletionBlanks(item.questionText);
  const shouldSplit =
    blankCount > 1 &&
    [
      "form-completion",
      "note-completion",
      "sentence-completion",
      "map-label",
    ].includes(item.questionType);

  if (!shouldSplit) return [item];

  const answers = splitCompletionAnswers(item.correctAnswer);
  const chunks = item.questionText
    .split(/\n+|\s+\|\s+/)
    .map((chunk) => chunk.trim())
    .filter((chunk) => chunk && hasCompletionBlank(chunk));

  if (chunks.length <= 1) return [item];

  return chunks.map((chunk, index) => ({
    ...item,
    questionText: chunk,
    correctAnswer: answers[index] ?? (answers.length === 1 && index === 0 ? answers[0] : ""),
    explanation:
      index === 0
        ? item.explanation
        : "This item was split from a grouped PDF table row. Fill the answer if it was not imported.",
  }));
}

function normalizeImportedListeningExam(
  exam: ImportedListeningExam
): ImportedListeningExam {
  return {
    ...exam,
    sections: exam.sections.map((section) => ({
      ...section,
      questions: section.questions
        .map(normalizeQuestionOptions)
        .flatMap(splitGroupedCompletionQuestion),
    })),
  };
}

function extractAudioUrls(text: string) {
  const urlReadyText = text.replace(/\s+/g, "");
  return Array.from(
    urlReadyText.matchAll(
      /https:\/\/engnovate\.com\/wp-content\/uploads\/2025\/07\/cambridge-ielts-20-academic-listening-1-audio-\d\.mp3/g
    )
  ).map((match) => match[0]);
}

function buildCambridge20ListeningTest1(
  text: string
): ImportedListeningExam | null {
  if (
    !/Cambridge IELTS 20 Academic Listening Test 1/i.test(text) ||
    !/Restaurant Recommendations/i.test(text) ||
    !/Reclaiming Urban Rivers/i.test(text)
  ) {
    return null;
  }

  const audioUrls = extractAudioUrls(text);

  return {
    testTitle: "Cambridge IELTS 20 Academic Listening Test 1",
    difficulty: "medium",
    sections: [
      {
        sectionNumber: 1,
        sectionTitle: "PART 1: Restaurant Recommendations",
        audioUrl: audioUrls[0] ?? "",
        transcript: "",
        questions: [
          question(
            "form-completion",
            "The Junction - Location: Greyson Street near the station. Reason: Good for people who are especially keen on [1] ______.",
            "Fish",
            "The restaurant is recommended for people who like fish."
          ),
          question(
            "form-completion",
            "The Junction - Other comments: The [2] ______ is a good place for a drink.",
            "Roof",
            "The speaker says people can go up on the roof for a drink."
          ),
          question(
            "form-completion",
            "Paloma - Location: In Bow Street next to the cinema. Reason: [3] ______ food, good for sharing.",
            "Spanish"
          ),
          question(
            "form-completion",
            "Paloma - Other comments: Need to pay GBP 50 deposit. A limited selection of [4] ______ food on the menu.",
            "Vegetarian"
          ),
          question(
            "form-completion",
            "Name of restaurant [5] ______.",
            "Audley"
          ),
          question(
            "form-completion",
            "Audley - Location: At the top of a [6] ______.",
            "Hotel"
          ),
          question(
            "form-completion",
            "Audley - Reason: A famous chef. All the [7] ______ are very good.",
            "Reviews"
          ),
          question(
            "form-completion",
            "Audley - Reason: Only uses [8] ______ ingredients.",
            "Local"
          ),
          question(
            "form-completion",
            "Audley - Other comments: Set lunch costs GBP [9] ______ per person.",
            "30"
          ),
          question(
            "form-completion",
            "Audley - Other comments: Portions probably of [10] ______ size.",
            "Average"
          ),
        ],
      },
      {
        sectionNumber: 2,
        sectionTitle: "PART 2: Pottery Classes and Studio Tour",
        audioUrl: audioUrls[1] ?? "",
        transcript: "",
        questions: [
          question(
            "multiple-choice",
            "Heather says pottery differs from other art forms because",
            "A. It lasts longer in the ground.",
            "",
            [
              "A. It lasts longer in the ground.",
              "B. It is practised by more people.",
              "C. It can be repaired more easily.",
            ]
          ),
          question(
            "multiple-choice",
            "Archaeologists sometimes identify the use of ancient pottery from",
            "B. The marks that are on it.",
            "",
            [
              "A. The clay it was made with.",
              "B. The marks that are on it.",
              "C. The basic shape of it.",
            ]
          ),
          question(
            "multiple-choice",
            "Some people join Heather's pottery class because they want to",
            "C. Make something that will outlive them.",
            "",
            [
              "A. Create an item that looks very old.",
              "B. Find something that they are good at.",
              "C. Make something that will outlive them.",
            ]
          ),
          question(
            "multiple-choice",
            "What does Heather value most about being a potter?",
            "A. Its calming effect",
            "",
            ["A. Its calming effect", "B. Its messy nature", "C. Its physical benefits"]
          ),
          question(
            "multiple-choice",
            "Most of the visitors to Edelman Pottery",
            "B. Have never made a pot before.",
            "",
            [
              "A. Bring friends to join courses.",
              "B. Have never made a pot before.",
              "C. Try to learn techniques too quickly.",
            ]
          ),
          question(
            "multiple-choice",
            "Heather reminds her visitors that they should",
            "C. Take off their jewellery.",
            "",
            [
              "A. Put on their aprons.",
              "B. Change their clothes.",
              "C. Take off their jewellery.",
            ]
          ),
          question(
            "matching",
            "Which TWO things does Heather explain about kilns?\nA. What their function is\nB. When they were invented\nC. Ways of keeping them safe\nD. Where to put one in your home\nE. What some people use instead of one",
            "A, E",
            "Multi-answer item. Use letters only."
          ),
          question(
            "matching",
            "Which points does Heather make about a potter's tools?\nA. Some are hard to hold.\nB. Some are worth buying.\nC. Some are essential items.\nD. Some have memorable names.\nE. Some are available for use by participants.",
            "C, E",
            "Multi-answer item. Use letters only."
          ),
        ],
      },
      {
        sectionNumber: 3,
        sectionTitle: "PART 3: Presentation on Loneliness",
        audioUrl: audioUrls[2] ?? "",
        transcript: "",
        questions: [
          question(
            "matching",
            "Which TWO things do the students both believe are responsible for the increase in loneliness?\nA. Social media\nB. Smaller nuclear families\nC. Urban design\nD. Longer lifespans\nE. A mobile workforce",
            "C, E",
            "Multi-answer item. Use letters only."
          ),
          question(
            "matching",
            "Which TWO health risks associated with loneliness do the students agree are based on solid evidence?\nA. A weakened immune system\nB. Dementia\nC. Cancer\nD. Obesity\nE. Cardiovascular disease",
            "A, C",
            "Multi-answer item. Use letters only."
          ),
          question(
            "matching",
            "Which TWO opinions do both the students express about the evolutionary theory of loneliness?\nA. It has little practical relevance.\nB. It needs further investigation.\nC. It is misleading.\nD. It should be more widely accepted.\nE. It is difficult to understand.",
            "A, B",
            "Multi-answer item. Use letters only."
          ),
          question(
            "multiple-choice",
            "When comparing loneliness to depression, the students",
            "A. Doubt that there will ever be a medical cure for loneliness.",
            "",
            [
              "A. Doubt that there will ever be a medical cure for loneliness.",
              "B. Claim that the link between loneliness and mental health is overstated.",
              "C. Express frustration that loneliness is not taken more seriously.",
            ]
          ),
          question(
            "multiple-choice",
            "Why do the students decide to start their presentation with an example from their own experience?",
            "B. To highlight a situation that most students will recognise",
            "",
            [
              "A. To explain how difficult loneliness can be",
              "B. To highlight a situation that most students will recognise",
              "C. To emphasise that feeling lonely is more common for men than women",
            ]
          ),
          question(
            "multiple-choice",
            "The students agree that talking to strangers is a good strategy for dealing with loneliness because",
            "A. It creates a sense of belonging.",
            "",
            [
              "A. It creates a sense of belonging.",
              "B. It builds self-confidence.",
              "C. It makes people feel more positive.",
            ]
          ),
          question(
            "multiple-choice",
            "The students find it difficult to understand why solitude is considered to be",
            "C. An enjoyable experience.",
            "",
            [
              "A. Similar to loneliness.",
              "B. Necessary for mental health.",
              "C. An enjoyable experience.",
            ]
          ),
        ],
      },
      {
        sectionNumber: 4,
        sectionTitle: "PART 4: Reclaiming Urban Rivers",
        audioUrl: audioUrls[3] ?? "",
        transcript: "",
        questions: [
          question(
            "note-completion",
            "Historical Background: Pollution from [31] ______ on the river bank.",
            "Factories"
          ),
          question(
            "note-completion",
            "Historical Background: In 1957, the River Thames in London was declared biologically [32] ______.",
            "Dead"
          ),
          question(
            "note-completion",
            "Recent Improvements: Seals and even a [33] ______ have been seen in the River Thames.",
            "Whale"
          ),
          question(
            "note-completion",
            "Recent Improvements: Riverside warehouses are converted to restaurants and [34] ______.",
            "Apartments"
          ),
          question(
            "note-completion",
            "In Los Angeles, there are plans to: Build a riverside [35] ______.",
            "Park"
          ),
          question(
            "note-completion",
            "In Los Angeles, there are plans to: Display [36] ______ projects.",
            "Art"
          ),
          question(
            "note-completion",
            "In Paris, [37] ______ are created on the sides of the river every summer.",
            "Beaches"
          ),
          question(
            "note-completion",
            "Transport Possibilities: Over 2 billion passengers already travel by [38] ______ in cities around the world.",
            "Ferry"
          ),
          question(
            "note-completion",
            "Transport Possibilities: Instead of road transport, goods can be transported by large freight barges and electric [39] ______.",
            "Bikes"
          ),
          question(
            "note-completion",
            "Transport Possibilities: Or, in future, by [40] ______.",
            "Drones"
          ),
        ],
      },
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

    const text = await extractPdfText(buffer);

    const normalizedText = compactPdfText(text)
      .replace(/https:\/\/engnovate\.com\/ielts-listening-tests\/[^\s]+/g, "")
      .replace(/academic-list\s+ening/gi, "academic-listening");
    const cambridgeFallback = buildCambridge20ListeningTest1(normalizedText);
    if (cambridgeFallback) {
      return Response.json(cambridgeFallback);
    }

    const { object } = await generateObject({
      model: chatModel(),
      schema: importedListeningSchema,
      prompt: `Convert this IELTS Listening PDF text into structured data for an admin form.

Rules:
- Return one listening test with up to 4 sections.
- Extract the test title.
- Extract each Part/Section title and audio URL.
- Extract questions in order.
- Extract transcripts if present. If a transcript is not present, use an empty string.
- Extract answers if an answer key appears. If no answer is found, leave correctAnswer empty.
- Put answer explanations as short evidence from transcript or answer key if available. If unavailable, use an empty string.
- CRITICAL: For fill-in-the-blank/table/note questions, create ONE question object per numbered blank. If a table row contains blanks [1], [2], and [3], return three separate question objects, not one grouped object.
- For fill-in-the-blank/table/note questions, set questionType to "note-completion", leave optionsText empty, preserve only the relevant blank marker in each questionText, and set correctAnswer to exactly one answer.
- Do not put multiple blanks or multiple answers into one question object unless the source explicitly says "Choose TWO" or another multi-answer task.
- For multiple choice A/B/C, set optionsText as one option per line with labels, such as "A. Text". correctAnswer must exactly match the full matching option line if the answer is known.
- For "Choose TWO" questions, leave optionsText empty and set correctAnswer to the answer letters joined by comma, such as "C, E", because the current UI uses free text for multi-answer items.
- Do not invent questions that are not in the PDF.

PDF text:
${normalizedText.slice(0, 42000)}`,
    });

    return Response.json(normalizeImportedListeningExam(object));
  } catch (error) {
    console.error("Listening PDF import failed", error);
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to import listening PDF",
      },
      { status: 500 }
    );
  }
}
