"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Headphones,
  Loader2,
  Mic,
  PenLine,
  Plus,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { UserProfileMenu } from "@/components/user-profile-menu";
import { useI18n } from "@/lib/i18n/provider";
import { supabase } from "@/lib/supabase/client";
import type { ListeningQuestionType, ReadingQuestionType } from "@/lib/types";
import { useRouter } from "next/navigation";

type Mode = "writing" | "speaking" | "reading" | "listening";

interface QuestionForm<T extends string> {
  questionType: T;
  questionText: string;
  optionsText: string;
  correctAnswer: string;
  explanation: string;
}

interface ListeningSectionForm {
  sectionNumber: number;
  sectionTitle: string;
  audioUrl: string;
  transcript: string;
  questions: QuestionForm<ListeningQuestionType>[];
}

const readingQuestionTypes: ReadingQuestionType[] = [
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
];

const listeningQuestionTypes: ListeningQuestionType[] = [
  "multiple-choice",
  "form-completion",
  "note-completion",
  "sentence-completion",
  "matching",
  "map-label",
];

const selectClassName =
  "h-9 w-full rounded-full border border-input bg-input/30 px-3 text-sm text-foreground outline-none dark:[color-scheme:dark] [&_option]:bg-background [&_option]:text-foreground";

function newReadingQuestion(): QuestionForm<ReadingQuestionType> {
  return {
    questionType: "multiple-choice",
    questionText: "",
    optionsText: "",
    correctAnswer: "",
    explanation: "",
  };
}

function newListeningQuestion(): QuestionForm<ListeningQuestionType> {
  return {
    questionType: "multiple-choice",
    questionText: "",
    optionsText: "",
    correctAnswer: "",
    explanation: "",
  };
}

function newListeningSection(sectionNumber: number): ListeningSectionForm {
  return {
    sectionNumber,
    sectionTitle: "",
    audioUrl: "",
    transcript: "",
    questions: [newListeningQuestion()],
  };
}

function parseOptions(optionsText: string) {
  return optionsText
    .split("\n")
    .map((option) => option.trim())
    .filter(Boolean);
}

export function ExamAdminForm() {
  const router = useRouter();
  const { t } = useI18n();
  const [mode, setMode] = useState<Mode>("writing");
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImportingPdf, setIsImportingPdf] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [writing, setWriting] = useState({
    testTitle: "",
    taskNumber: "2" as "1" | "2",
    imageUrl: "",
    sourceUrl: "",
    content: "",
  });

  const [speaking, setSpeaking] = useState({
    testTitle: "",
    partNumber: "1" as "1" | "2" | "3",
    sourceUrl: "",
    content: "",
  });

  const [reading, setReading] = useState({
    title: "",
    difficulty: "medium",
    sourceUrl: "",
    passageText: "",
    questions: [newReadingQuestion()],
  });

  const [listening, setListening] = useState({
    testTitle: "",
    difficulty: "medium",
    sections: [newListeningSection(1)],
  });

  useEffect(() => {
    let cancelled = false;

    async function checkAdminAccess() {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.replace("/");
        return;
      }

      const res = await fetch(`/api/profile?userId=${data.user.id}`);
      const profile = res.ok ? await res.json() : null;

      if (profile?.role !== "admin") {
        router.replace("/chat");
        return;
      }

      if (!cancelled) setIsCheckingAdmin(false);
    }

    checkAdminAccess();

    return () => {
      cancelled = true;
    };
  }, [router]);

  async function getAccessToken() {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  }

  async function submitWriting() {
    const token = await getAccessToken();
    if (!token) throw new Error(t.admin.signInRequired);

    const res = await fetch("/api/admin/exams/writing", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(writing),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      throw new Error(body?.error ?? t.admin.failedWriting);
    }

    setWriting({
      testTitle: "",
      taskNumber: "2",
      imageUrl: "",
      sourceUrl: "",
      content: "",
    });
  }

  async function submitSpeaking() {
    const token = await getAccessToken();
    if (!token) throw new Error(t.admin.signInRequired);

    const res = await fetch("/api/admin/exams/speaking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(speaking),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      throw new Error(body?.error ?? t.admin.failedSpeaking);
    }

    setSpeaking({
      testTitle: "",
      partNumber: "1",
      sourceUrl: "",
      content: "",
    });
  }

  async function submitReading() {
    const token = await getAccessToken();
    if (!token) throw new Error(t.admin.signInRequired);

    const res = await fetch("/api/admin/exams/reading", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: reading.title,
        difficulty: reading.difficulty,
        sourceUrl: reading.sourceUrl,
        passageText: reading.passageText,
        questions: reading.questions.map((question) => ({
          questionType: question.questionType,
          questionText: question.questionText,
          options: parseOptions(question.optionsText),
          correctAnswer: question.correctAnswer,
          explanation: question.explanation,
        })),
      }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      throw new Error(body?.error ?? t.admin.failedReading);
    }

    setReading({
      title: "",
      difficulty: "medium",
      sourceUrl: "",
      passageText: "",
      questions: [newReadingQuestion()],
    });
  }

  async function submitListening() {
    const token = await getAccessToken();
    if (!token) throw new Error(t.admin.signInRequired);

    const res = await fetch("/api/admin/exams/listening", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        testTitle: listening.testTitle,
        difficulty: listening.difficulty,
        sections: listening.sections.map((section) => ({
          sectionNumber: section.sectionNumber,
          sectionTitle: section.sectionTitle,
          audioUrl: section.audioUrl,
          transcript: section.transcript,
          questions: section.questions.map((question) => ({
            questionType: question.questionType,
            questionText: question.questionText,
            options: parseOptions(question.optionsText),
            correctAnswer: question.correctAnswer,
            explanation: question.explanation,
          })),
        })),
      }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      const fieldErrors = body?.issues?.fieldErrors
        ? Object.entries(body.issues.fieldErrors)
            .map(([field, errors]) => `${field}: ${(errors as string[]).join(", ")}`)
            .join("; ")
        : "";
      throw new Error(
        fieldErrors
          ? `${body?.error ?? t.admin.failedListening}: ${fieldErrors}`
          : body?.error ?? t.admin.failedListening
      );
    }

    setListening({
      testTitle: "",
      difficulty: "medium",
      sections: [newListeningSection(1)],
    });
  }

  async function handlePdfImport(targetMode: "reading" | "listening", file: File) {
    const token = await getAccessToken();
    if (!token) throw new Error(t.admin.signInRequired);

    setIsImportingPdf(true);
    setMessage(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`/api/admin/exams/${targetMode}/import-pdf`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        let body: { error?: string } | null = null;
        try {
          body = text ? JSON.parse(text) : null;
        } catch {
          body = null;
        }
        throw new Error(
          body?.error ??
            (text ? `${t.admin.pdfImportFailed} ${text.slice(0, 160)}` : t.admin.pdfImportFailed)
        );
      }

      const imported = await res.json();
      if (targetMode === "reading") {
        setReading({
          title: imported.title ?? "",
          difficulty: imported.difficulty ?? "medium",
          sourceUrl: imported.sourceUrl ?? "",
          passageText: imported.passageText ?? "",
          questions:
            imported.questions?.length > 0
              ? imported.questions.map((question: QuestionForm<ReadingQuestionType>) => ({
                  questionType:
                    question.questionType ?? "multiple-choice",
                  questionText: question.questionText ?? "",
                  optionsText: question.optionsText ?? "",
                  correctAnswer: question.correctAnswer ?? "",
                  explanation: question.explanation ?? "",
                }))
              : [newReadingQuestion()],
        });
      } else {
        setListening({
          testTitle: imported.testTitle ?? "",
          difficulty: imported.difficulty ?? "medium",
          sections:
            imported.sections?.length > 0
              ? imported.sections.map(
                  (section: ListeningSectionForm, index: number) => ({
                    sectionNumber: section.sectionNumber || index + 1,
                    sectionTitle: section.sectionTitle ?? "",
                    audioUrl: section.audioUrl ?? "",
                    transcript: section.transcript ?? "",
                    questions:
                      section.questions?.length > 0
                        ? section.questions.map((question) => ({
                            questionType:
                              question.questionType ?? "multiple-choice",
                            questionText: question.questionText ?? "",
                            optionsText: question.optionsText ?? "",
                            correctAnswer: question.correctAnswer ?? "",
                            explanation: question.explanation ?? "",
                          }))
                        : [newListeningQuestion()],
                  })
                )
              : [newListeningSection(1)],
        });
      }
      setMessage(t.admin.pdfImported);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.admin.pdfImportFailed);
    } finally {
      setIsImportingPdf(false);
    }
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      if (mode === "writing") {
        await submitWriting();
        setMessage(t.admin.writingCreated);
      } else if (mode === "speaking") {
        await submitSpeaking();
        setMessage(t.admin.speakingCreated);
      } else if (mode === "reading") {
        await submitReading();
        setMessage(t.admin.readingCreated);
      } else {
        await submitListening();
        setMessage(t.admin.listeningCreated);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t.common.error);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isCheckingAdmin) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-background">
        <Spinner className="size-8" />
      </main>
    );
  }

  return (
    <div className="min-h-dvh bg-muted/20">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div>
            <h1 className="text-lg font-semibold">{t.admin.title}</h1>
            <p className="text-sm text-muted-foreground">
              {t.admin.subtitle}
            </p>
          </div>
          <UserProfileMenu />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="mb-4 flex w-fit rounded-full border border-border bg-background p-1">
          <Button
            type="button"
            size="sm"
            variant={mode === "writing" ? "default" : "ghost"}
            onClick={() => setMode("writing")}
          >
            <PenLine className="size-4" />
            {t.chat.writing}
          </Button>
          <Button
            type="button"
            size="sm"
            variant={mode === "speaking" ? "default" : "ghost"}
            onClick={() => setMode("speaking")}
          >
            <Mic className="size-4" />
            {t.chat.speaking}
          </Button>
          <Button
            type="button"
            size="sm"
            variant={mode === "reading" ? "default" : "ghost"}
            onClick={() => setMode("reading")}
          >
            <BookOpen className="size-4" />
            {t.chat.reading}
          </Button>
          <Button
            type="button"
            size="sm"
            variant={mode === "listening" ? "default" : "ghost"}
            onClick={() => setMode("listening")}
          >
            <Headphones className="size-4" />
            {t.chat.listening}
          </Button>
        </div>

        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle>
              {mode === "writing"
                ? t.admin.createWriting
                : mode === "speaking"
                  ? t.admin.createSpeaking
                  : mode === "reading"
                    ? t.admin.createReading
                    : t.admin.createListening}
            </CardTitle>
            <CardDescription>
              {t.admin.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {mode === "writing" ? (
              <WritingFields writing={writing} setWriting={setWriting} />
            ) : mode === "speaking" ? (
              <SpeakingFields speaking={speaking} setSpeaking={setSpeaking} />
            ) : mode === "reading" ? (
              <ReadingFields
                reading={reading}
                setReading={setReading}
                isImportingPdf={isImportingPdf}
                onImportPdf={(file) => handlePdfImport("reading", file)}
              />
            ) : (
              <ListeningFields
                listening={listening}
                setListening={setListening}
                isImportingPdf={isImportingPdf}
                onImportPdf={(file) => handlePdfImport("listening", file)}
              />
            )}

            {(message || error) && (
              <div
                className={`rounded-lg border px-3 py-2 text-sm ${
                  error
                    ? "border-destructive/40 bg-destructive/10 text-destructive"
                    : "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  {!error && <CheckCircle2 className="size-4" />}
                  <span>{error ?? message}</span>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                {t.admin.saveExam}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}

function PdfImportButton({
  isImportingPdf,
  onImportPdf,
}: {
  isImportingPdf: boolean;
  onImportPdf: (file: File) => Promise<void>;
}) {
  const { t } = useI18n();

  return (
    <div className="flex justify-end">
      <label className="inline-flex">
        <input
          type="file"
          accept="application/pdf"
          className="sr-only"
          disabled={isImportingPdf}
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (file) void onImportPdf(file);
          }}
        />
        <span
          className={`inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-full border border-border bg-input/30 px-3 text-sm font-medium transition-all hover:bg-input/50 ${
            isImportingPdf ? "pointer-events-none opacity-50" : ""
          }`}
        >
          {isImportingPdf && <Loader2 className="size-4 animate-spin" />}
          {isImportingPdf ? t.admin.importingPdf : t.admin.importPdf}
        </span>
      </label>
    </div>
  );
}

function WritingFields({
  writing,
  setWriting,
}: {
  writing: {
    testTitle: string;
    taskNumber: "1" | "2";
    imageUrl: string;
    sourceUrl: string;
    content: string;
  };
  setWriting: React.Dispatch<
    React.SetStateAction<{
      testTitle: string;
      taskNumber: "1" | "2";
      imageUrl: string;
      sourceUrl: string;
      content: string;
    }>
  >;
}) {
  const { t } = useI18n();

  return (
    <>
      <div className="grid gap-4 md:grid-cols-[1fr_160px]">
        <Field label={t.admin.testTitle}>
          <Input
            value={writing.testTitle}
            onChange={(event) =>
              setWriting((prev) => ({ ...prev, testTitle: event.target.value }))
            }
          />
        </Field>
        <Field label={t.admin.taskNumber}>
          <select
            className={selectClassName}
            value={writing.taskNumber}
            onChange={(event) =>
              setWriting((prev) => ({
                ...prev,
                taskNumber: event.target.value as "1" | "2",
              }))
            }
          >
            <option value="1">Task 1</option>
            <option value="2">Task 2</option>
          </select>
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label={t.admin.imageUrl}>
          <Input
            placeholder="Task 1 chart/image URL"
            value={writing.imageUrl}
            onChange={(event) =>
              setWriting((prev) => ({ ...prev, imageUrl: event.target.value }))
            }
          />
        </Field>
        <Field label={t.admin.sourceUrl}>
          <Input
            value={writing.sourceUrl}
            onChange={(event) =>
              setWriting((prev) => ({ ...prev, sourceUrl: event.target.value }))
            }
          />
        </Field>
      </div>

      <Field label={t.admin.questionContent}>
        <Textarea
          className="min-h-56"
          value={writing.content}
          onChange={(event) =>
            setWriting((prev) => ({ ...prev, content: event.target.value }))
          }
        />
      </Field>
    </>
  );
}

function SpeakingFields({
  speaking,
  setSpeaking,
}: {
  speaking: {
    testTitle: string;
    partNumber: "1" | "2" | "3";
    sourceUrl: string;
    content: string;
  };
  setSpeaking: React.Dispatch<
    React.SetStateAction<{
      testTitle: string;
      partNumber: "1" | "2" | "3";
      sourceUrl: string;
      content: string;
    }>
  >;
}) {
  const { t } = useI18n();

  return (
    <>
      <div className="grid gap-4 md:grid-cols-[1fr_160px]">
        <Field label={t.admin.testTitle}>
          <Input
            value={speaking.testTitle}
            onChange={(event) =>
              setSpeaking((prev) => ({ ...prev, testTitle: event.target.value }))
            }
          />
        </Field>
        <Field label={t.admin.partNumber}>
          <select
            className={selectClassName}
            value={speaking.partNumber}
            onChange={(event) =>
              setSpeaking((prev) => ({
                ...prev,
                partNumber: event.target.value as "1" | "2" | "3",
              }))
            }
          >
            <option value="1">Part 1</option>
            <option value="2">Part 2</option>
            <option value="3">Part 3</option>
          </select>
        </Field>
      </div>

      <Field label={t.admin.sourceUrl}>
        <Input
          value={speaking.sourceUrl}
          onChange={(event) =>
            setSpeaking((prev) => ({ ...prev, sourceUrl: event.target.value }))
          }
        />
      </Field>

      <Field label={t.admin.questionContent}>
        <Textarea
          className="min-h-56"
          placeholder={t.admin.speakingContentPlaceholder}
          value={speaking.content}
          onChange={(event) =>
            setSpeaking((prev) => ({ ...prev, content: event.target.value }))
          }
        />
      </Field>
    </>
  );
}

function ReadingFields({
  reading,
  setReading,
  isImportingPdf,
  onImportPdf,
}: {
  reading: {
    title: string;
    difficulty: string;
    sourceUrl: string;
    passageText: string;
    questions: QuestionForm<ReadingQuestionType>[];
  };
  setReading: React.Dispatch<
    React.SetStateAction<{
      title: string;
      difficulty: string;
      sourceUrl: string;
      passageText: string;
      questions: QuestionForm<ReadingQuestionType>[];
    }>
  >;
  isImportingPdf: boolean;
  onImportPdf: (file: File) => Promise<void>;
}) {
  const { t } = useI18n();

  return (
    <>
      <PdfImportButton
        isImportingPdf={isImportingPdf}
        onImportPdf={onImportPdf}
      />

      <div className="grid gap-4 md:grid-cols-[1fr_180px]">
        <Field label={t.admin.passageTitle}>
          <Input
            value={reading.title}
            onChange={(event) =>
              setReading((prev) => ({ ...prev, title: event.target.value }))
            }
          />
        </Field>
        <Field label={t.admin.difficulty}>
          <Input
            value={reading.difficulty}
            onChange={(event) =>
              setReading((prev) => ({ ...prev, difficulty: event.target.value }))
            }
          />
        </Field>
      </div>
      <Field label={t.admin.sourceUrl}>
        <Input
          value={reading.sourceUrl}
          onChange={(event) =>
            setReading((prev) => ({ ...prev, sourceUrl: event.target.value }))
          }
        />
      </Field>
      <Field label={t.admin.passageText}>
        <Textarea
          className="min-h-56"
          value={reading.passageText}
          onChange={(event) =>
            setReading((prev) => ({ ...prev, passageText: event.target.value }))
          }
        />
      </Field>
      <QuestionEditor
        questionTypes={readingQuestionTypes}
        questions={reading.questions}
        onAdd={() =>
          setReading((prev) => ({
            ...prev,
            questions: [...prev.questions, newReadingQuestion()],
          }))
        }
        onRemove={(index) =>
          setReading((prev) => ({
            ...prev,
            questions: prev.questions.filter((_, itemIndex) => itemIndex !== index),
          }))
        }
        onChange={(index, question) =>
          setReading((prev) => ({
            ...prev,
            questions: prev.questions.map((item, itemIndex) =>
              itemIndex === index ? question : item
            ),
          }))
        }
      />
    </>
  );
}

function ListeningFields({
  listening,
  setListening,
  isImportingPdf,
  onImportPdf,
}: {
  listening: {
    testTitle: string;
    difficulty: string;
    sections: ListeningSectionForm[];
  };
  setListening: React.Dispatch<
    React.SetStateAction<{
      testTitle: string;
      difficulty: string;
      sections: ListeningSectionForm[];
    }>
  >;
  isImportingPdf: boolean;
  onImportPdf: (file: File) => Promise<void>;
}) {
  const { t } = useI18n();

  return (
    <>
      <PdfImportButton
        isImportingPdf={isImportingPdf}
        onImportPdf={onImportPdf}
      />

      <div className="grid gap-4 md:grid-cols-[1fr_180px]">
        <Field label={t.admin.testTitle}>
          <Input
            value={listening.testTitle}
            onChange={(event) =>
              setListening((prev) => ({ ...prev, testTitle: event.target.value }))
            }
          />
        </Field>
        <Field label={t.admin.difficulty}>
          <Input
            value={listening.difficulty}
            onChange={(event) =>
              setListening((prev) => ({ ...prev, difficulty: event.target.value }))
            }
          />
        </Field>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">{t.admin.sections}</h2>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={listening.sections.length >= 4}
            onClick={() =>
              setListening((prev) => ({
                ...prev,
                sections: [
                  ...prev.sections,
                  newListeningSection(prev.sections.length + 1),
                ],
              }))
            }
          >
            <Plus className="size-4" />
            {t.admin.addSection}
          </Button>
        </div>

        {listening.sections.map((section, sectionIndex) => (
          <div
            key={sectionIndex}
            className="rounded-xl border border-border bg-background p-4"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold">
                {t.admin.section} {sectionIndex + 1}
              </p>
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                disabled={listening.sections.length === 1}
                onClick={() =>
                  setListening((prev) => ({
                    ...prev,
                    sections: prev.sections.filter(
                      (_, itemIndex) => itemIndex !== sectionIndex
                    ),
                  }))
                }
              >
                <Trash2 className="size-4" />
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-[160px_1fr]">
              <Field label={t.admin.sectionNumber}>
                <Input
                  type="number"
                  min={1}
                  max={4}
                  value={section.sectionNumber}
                  onChange={(event) =>
                    setListening((prev) => ({
                      ...prev,
                      sections: prev.sections.map((item, itemIndex) =>
                        itemIndex === sectionIndex
                          ? {
                              ...item,
                              sectionNumber: Number(event.target.value),
                            }
                          : item
                      ),
                    }))
                  }
                />
              </Field>
              <Field label={t.admin.sectionTitle}>
                <Input
                  value={section.sectionTitle}
                  onChange={(event) =>
                    setListening((prev) => ({
                      ...prev,
                      sections: prev.sections.map((item, itemIndex) =>
                        itemIndex === sectionIndex
                          ? { ...item, sectionTitle: event.target.value }
                          : item
                      ),
                    }))
                  }
                />
              </Field>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Field label={t.admin.audioUrl}>
                <Input
                  placeholder={t.admin.audioUrlPlaceholder}
                  value={section.audioUrl}
                  onChange={(event) =>
                    setListening((prev) => ({
                      ...prev,
                      sections: prev.sections.map((item, itemIndex) =>
                        itemIndex === sectionIndex
                          ? { ...item, audioUrl: event.target.value }
                          : item
                      ),
                    }))
                  }
                />
              </Field>
              <Field label={t.admin.privateTranscript}>
                <Textarea
                  className="min-h-24"
                  placeholder={t.admin.privateTranscriptPlaceholder}
                  value={section.transcript}
                  onChange={(event) =>
                    setListening((prev) => ({
                      ...prev,
                      sections: prev.sections.map((item, itemIndex) =>
                        itemIndex === sectionIndex
                          ? { ...item, transcript: event.target.value }
                          : item
                      ),
                    }))
                  }
                />
              </Field>
            </div>

            <div className="mt-4">
              <QuestionEditor
                questionTypes={listeningQuestionTypes}
                questions={section.questions}
                onAdd={() =>
                  setListening((prev) => ({
                    ...prev,
                    sections: prev.sections.map((item, itemIndex) =>
                      itemIndex === sectionIndex
                        ? {
                            ...item,
                            questions: [
                              ...item.questions,
                              newListeningQuestion(),
                            ],
                          }
                        : item
                    ),
                  }))
                }
                onRemove={(index) =>
                  setListening((prev) => ({
                    ...prev,
                    sections: prev.sections.map((item, itemIndex) =>
                      itemIndex === sectionIndex
                        ? {
                            ...item,
                            questions: item.questions.filter(
                              (_, questionIndex) => questionIndex !== index
                            ),
                          }
                        : item
                    ),
                  }))
                }
                onChange={(index, question) =>
                  setListening((prev) => ({
                    ...prev,
                    sections: prev.sections.map((item, itemIndex) =>
                      itemIndex === sectionIndex
                        ? {
                            ...item,
                            questions: item.questions.map(
                              (currentQuestion, questionIndex) =>
                                questionIndex === index
                                  ? question
                                  : currentQuestion
                            ),
                          }
                        : item
                    ),
                  }))
                }
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function QuestionEditor<T extends string>({
  questionTypes,
  questions,
  onAdd,
  onRemove,
  onChange,
}: {
  questionTypes: T[];
  questions: QuestionForm<T>[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, question: QuestionForm<T>) => void;
}) {
  const { t } = useI18n();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">{t.admin.questions}</h2>
        <Button type="button" size="sm" variant="outline" onClick={onAdd}>
          <Plus className="size-4" />
          {t.admin.addQuestion}
        </Button>
      </div>

      {questions.map((question, index) => (
        <div key={index} className="rounded-lg border border-border bg-background p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold">
              {t.admin.question} {index + 1}
            </p>
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              disabled={questions.length === 1}
              onClick={() => onRemove(index)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-[220px_1fr]">
            <Field label={t.admin.questionType}>
              <select
                className={selectClassName}
                value={question.questionType}
                onChange={(event) =>
                  onChange(index, {
                    ...question,
                    questionType: event.target.value as T,
                  })
                }
              >
                {questionTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t.admin.correctAnswer}>
              <Input
                value={question.correctAnswer}
                onChange={(event) =>
                  onChange(index, {
                    ...question,
                    correctAnswer: event.target.value,
                  })
                }
              />
            </Field>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field label={t.admin.questionText}>
              <Textarea
                className="min-h-28"
                value={question.questionText}
                onChange={(event) =>
                  onChange(index, {
                    ...question,
                    questionText: event.target.value,
                  })
                }
              />
            </Field>
            <Field label={t.admin.options}>
              <Textarea
                className="min-h-28"
                placeholder={t.admin.optionsPlaceholder}
                value={question.optionsText}
                onChange={(event) =>
                  onChange(index, {
                    ...question,
                    optionsText: event.target.value,
                  })
                }
              />
            </Field>
          </div>

          <Field label={t.admin.explanation}>
            <Textarea
              className="mt-1.5 min-h-24"
              value={question.explanation}
              onChange={(event) =>
                onChange(index, {
                  ...question,
                  explanation: event.target.value,
                })
              }
            />
          </Field>
        </div>
      ))}
    </div>
  );
}
