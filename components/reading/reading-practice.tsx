"use client";

import { useEffect, useEffectEvent, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  Clock,
  FileQuestion,
  Home,
  ListChecks,
  Loader2,
  Send,
  Sparkles,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { UserProfileMenu } from "@/components/user-profile-menu";
import { useI18n } from "@/lib/i18n/provider";
import type {
  ReadingAssessmentFeedback,
  ReadingQuestionData,
  ReadingQuestionType,
} from "@/lib/types";

interface ReadingPassage {
  id: string;
  title: string;
  passageText: string;
  difficulty: string;
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

function questionTypeLabel(type: ReadingQuestionType) {
  const labels: Record<ReadingQuestionType, string> = {
    "multiple-choice": "Multiple choice",
    "true-false-not-given": "True / False / Not Given",
    "yes-no-not-given": "Yes / No / Not Given",
    "matching-headings": "Matching headings",
    "matching-information": "Matching information",
    "matching-features": "Matching features",
    "matching-sentence-endings": "Matching sentence endings",
    "sentence-completion": "Sentence completion",
    "summary-completion": "Summary completion",
    "table-completion": "Table completion",
    "flow-chart-completion": "Flow-chart completion",
    "diagram-label": "Diagram label",
    "choose-a-title": "Choose a title",
    "short-answer": "Short answer",
    classification: "Classification",
  };

  return labels[type];
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

function answerSet(value?: string) {
  return new Set(splitAnswerParts(value).map(canonicalAnswerPart));
}

function isAnswerCorrect(userAnswer: string | undefined, correctAnswer: string) {
  const userSet = answerSet(userAnswer);
  const correctSet = answerSet(correctAnswer);

  if (userSet.size === 0 || userSet.size !== correctSet.size) return false;
  return Array.from(correctSet).every((part) => userSet.has(part));
}

function isMultiAnswerQuestion(question: ReadingQuestionData) {
  const combinedText = [question.prompt, ...question.options].join("\n");
  return (
    answerSet(question.answer).size > 1 ||
    /\bchoose\s+(two|three|four)\b/i.test(combinedText) ||
    /\bwhich\s+(two|three|four)\b/i.test(combinedText)
  );
}

function selectedOptions(value?: string) {
  return splitAnswerParts(value);
}

function joinSelectedOptions(options: string[]) {
  return options.join("\n");
}

function requiredAnswerCount(question: ReadingQuestionData) {
  const countFromAnswer = answerSet(question.answer).size;
  if (countFromAnswer > 1) return countFromAnswer;

  const combinedText = [question.prompt, ...question.options].join(" ");
  if (/\b(two|2)\b/i.test(combinedText)) return 2;
  if (/\b(three|3)\b/i.test(combinedText)) return 3;
  if (/\b(four|4)\b/i.test(combinedText)) return 4;
  return 1;
}

export function ReadingPractice() {
  const router = useRouter();
  const { language, t } = useI18n();
  const [passage, setPassage] = useState<ReadingPassage | null>(null);
  const [questions, setQuestions] = useState<ReadingQuestionData[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAssessing, setIsAssessing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [assessment, setAssessment] = useState<ReadingAssessmentFeedback | null>(null);
  const [timeLeft, setTimeLeft] = useState(20 * 60);
  const assessmentLanguageRef = useRef<string | null>(null);

  const reportReadingError = useEffectEvent(() => {
    setLoadError(t.practice.readingDataMissing);
  });

  useEffect(() => {
    let cancelled = false;

    async function loadReadingTest() {
      setIsLoading(true);
      setLoadError(null);
      try {
        const res = await fetch("/api/reading/questions", { method: "POST" });
        if (!res.ok) throw new Error("No reading test available");
        const data = await res.json();
        if (cancelled) return;
        setPassage(data.passage);
        setQuestions(data.questions);
        setAnswers({});
        setSubmitted(false);
        setAssessment(null);
        setTimeLeft(20 * 60);
      } catch {
        if (!cancelled) {
          reportReadingError();
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadReadingTest();

    return () => {
      cancelled = true;
    };
  }, []);

  const answeredCount = Object.values(answers).filter((answer) =>
    answer.trim()
  ).length;
  const totalQuestions = questions.length;
  const score = useMemo(
    () =>
      questions.filter((question) =>
        isAnswerCorrect(answers[question.id], question.answer)
      )
        .length,
    [answers, questions]
  );

  useEffect(() => {
    if (submitted || !passage || timeLeft <= 0) return;

    const interval = window.setInterval(() => {
      setTimeLeft((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [passage, submitted, timeLeft]);

  async function assessReading(targetLanguage: typeof language) {
    if (!passage || questions.length === 0) return;
    assessmentLanguageRef.current = targetLanguage;
    setIsAssessing(true);
    setAssessment(null);

    try {
      const res = await fetch("/api/reading/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: passage.title,
          passage: passage.passageText,
          questions,
          answers,
          score,
          total: totalQuestions,
          language: targetLanguage,
        }),
      });
      if (!res.ok) throw new Error("Assessment failed");
      setAssessment(await res.json());
    } catch {
      setAssessment({
        overview: t.practice.readingFallbackOverview,
        strengths: [],
        weaknesses: [],
        strategyAdvice: [t.practice.readingFallbackStrategy],
      });
    } finally {
      setIsAssessing(false);
    }
  }

  async function handleSubmit() {
    if (!passage || questions.length === 0) return;
    if (submitted) return;
    setSubmitted(true);
    await assessReading(language);
  }

  useEffect(() => {
    if (!passage || submitted || timeLeft > 0) return;
    handleSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passage, submitted, timeLeft]);

  useEffect(() => {
    if (!submitted || !passage || questions.length === 0) return;
    if (assessmentLanguageRef.current === language) return;

    assessReading(language);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, submitted]);

  return (
    <div className="flex h-dvh flex-col bg-background">
      <header className="border-b border-border">
        <div className="flex items-center justify-between px-4 py-3 sm:px-6">
          <Button variant="ghost" size="sm" onClick={() => router.push("/chat")}>
            <Home className="size-4" />
            <span className="ml-1">{t.common.home}</span>
          </Button>

          <div className="hidden items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-sm font-medium text-muted-foreground sm:flex">
            <BookOpen className="size-3.5" />
            {t.practice.ieltsReading}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-sm font-medium tabular-nums">
              <Clock className="size-3.5" />
              {formatTime(timeLeft)}
            </div>
            <UserProfileMenu />
          </div>
        </div>
      </header>

      {isLoading ? (
        <main className="flex flex-1 items-center justify-center">
          <Spinner className="size-8" />
        </main>
      ) : loadError || !passage ? (
        <main className="flex flex-1 items-center justify-center px-6">
          <div className="max-w-md text-center">
            <h1 className="text-xl font-semibold">
              {t.practice.readingDataNotReady}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">{loadError}</p>
            <Button className="mt-5" onClick={() => router.push("/chat")}>
              {t.practice.backToChat}
            </Button>
          </div>
        </main>
      ) : (
        <main className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)]">
          <section className="flex min-h-0 flex-col border-b border-border lg:border-b-0 lg:border-r">
            <div className="flex items-center justify-between px-4 py-3 sm:px-6">
              <div>
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <BookOpen className="size-3.5" />
                  {t.practice.passage}
                </p>
                <h1 className="mt-1 text-xl font-semibold tracking-tight">
                  {passage.title}
                </h1>
              </div>
              <Button variant="ghost" size="sm" onClick={() => router.back()}>
                <ChevronLeft className="size-4" />
                {t.common.back}
              </Button>
            </div>

            <ScrollArea className="min-h-0 flex-1">
              <article className="px-4 pb-8 sm:px-6">
                <div className="max-w-3xl whitespace-pre-wrap text-[15px] leading-8 text-foreground">
                  {passage.passageText}
                </div>
              </article>
            </ScrollArea>
          </section>

          <section className="flex min-h-0 flex-col">
            <div className="flex items-center justify-between px-4 py-3 sm:px-6">
              <div>
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <FileQuestion className="size-3.5" />
                  {t.practice.questions}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {answeredCount}/{totalQuestions} {t.practice.answered}
                </p>
              </div>

              {submitted ? (
                <div className="rounded-full bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
                  {score}/{totalQuestions}
                </div>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={answeredCount === 0}
                  className="font-medium"
                >
                  <Send className="size-4" />
                  {t.common.submit}
                </Button>
              )}
            </div>

            <ScrollArea className="min-h-0 flex-1">
              <div className="space-y-4 px-4 pb-8 sm:px-6">
                {submitted && (
                  <div className="rounded-lg border border-border bg-card p-4">
                    <p className="flex items-center gap-2 text-sm font-semibold">
                      <Sparkles className="size-4 text-primary" />
                      {t.practice.aiReadingFeedback}
                    </p>
                    {isAssessing ? (
                      <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="size-4 animate-spin" />
                        {t.practice.reviewingAnswers}
                      </div>
                    ) : assessment ? (
                      <div className="mt-3 space-y-3 text-sm">
                        <p className="leading-6 text-muted-foreground">
                          {assessment.overview}
                        </p>
                        {assessment.strengths.length > 0 && (
                          <div>
                            <p className="font-medium">{t.practice.strengths}</p>
                            <ul className="mt-1 list-disc space-y-1 pl-5 text-muted-foreground">
                              {assessment.strengths.map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {assessment.weaknesses.length > 0 && (
                          <div>
                            <p className="font-medium">{t.practice.focusAreas}</p>
                            <ul className="mt-1 list-disc space-y-1 pl-5 text-muted-foreground">
                              {assessment.weaknesses.map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {assessment.strategyAdvice.length > 0 && (
                          <div>
                            <p className="font-medium">{t.practice.strategy}</p>
                            <ul className="mt-1 list-disc space-y-1 pl-5 text-muted-foreground">
                              {assessment.strategyAdvice.map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {assessment.questionReviews &&
                          assessment.questionReviews.length > 0 && (
                            <div>
                              <p className="font-medium">
                                {t.practice.questionReview}
                              </p>
                              <div className="mt-2 space-y-2">
                                {assessment.questionReviews.map((item) => (
                                  <div
                                    key={item.questionNumber}
                                    className="rounded-md border border-border bg-background px-3 py-2"
                                  >
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className="text-xs font-semibold">
                                        Q{item.questionNumber}
                                      </span>
                                      <span
                                        className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                                          item.result === "correct"
                                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                                            : "bg-destructive/10 text-destructive"
                                        }`}
                                      >
                                        {item.result === "correct"
                                          ? t.practice.correct
                                          : t.practice.review}
                                      </span>
                                    </div>
                                    <p className="mt-2 text-muted-foreground">
                                      {item.feedback}
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                      <span className="font-medium text-foreground">
                                        {t.practice.yourAnswer}:
                                      </span>{" "}
                                      {item.studentAnswer}
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                      <span className="font-medium text-foreground">
                                        {t.practice.correctAnswer}:
                                      </span>{" "}
                                      {item.correctAnswer}
                                    </p>
                                    {item.evidence && (
                                      <p className="mt-2 text-xs leading-5 text-muted-foreground">
                                        <span className="font-medium text-foreground">
                                          {t.practice.evidence}:
                                        </span>{" "}
                                        {item.evidence}
                                      </p>
                                    )}
                                    {item.strategy && (
                                      <p className="mt-2 text-xs leading-5 text-muted-foreground">
                                        <span className="font-medium text-foreground">
                                          {t.practice.strategy}:
                                        </span>{" "}
                                        {item.strategy}
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                      </div>
                    ) : null}
                  </div>
                )}

                {questions.map((question, index) => {
                  const selected = answers[question.id];
                  const isFreeText = question.options.length === 0;
                  const isMultiAnswer = isMultiAnswerQuestion(question);
                  const selectedSet = new Set(selectedOptions(selected));
                  const correctSet = answerSet(question.answer);
                  const requiredCount = requiredAnswerCount(question);
                  const isCorrect = isAnswerCorrect(selected, question.answer);

                  return (
                    <div
                      key={question.id}
                      className="rounded-lg border border-border bg-card p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                          {index + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-semibold leading-6">
                              {question.prompt}
                            </p>
                            <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                              {questionTypeLabel(question.type)}
                            </span>
                          </div>

                          {isFreeText ? (
                            <div className="mt-3">
                              <input
                                type="text"
                                disabled={submitted}
                                value={selected ?? ""}
                                onChange={(event) =>
                                  setAnswers((prev) => ({
                                    ...prev,
                                    [question.id]: event.target.value,
                                  }))
                                }
                                className={`h-10 w-full rounded-md border bg-background px-3 text-sm outline-none transition-colors ${
                                  submitted
                                    ? isCorrect
                                      ? "border-emerald-500/50 bg-emerald-500/10"
                                      : "border-destructive/50 bg-destructive/10"
                                    : "border-border focus:border-primary/60"
                                }`}
                                placeholder={t.practice.typeYourAnswer}
                              />
                            </div>
                          ) : (
                            <div className="mt-3 space-y-2">
                              {isMultiAnswer && (
                                <p className="text-xs font-medium text-muted-foreground">
                                  {t.practice.chooseAnswers.replace(
                                    "{count}",
                                    String(requiredCount)
                                  )}
                                </p>
                              )}
                              {question.options.map((option) => {
                              const isSelected = isMultiAnswer
                                ? selectedSet.has(option)
                                : selected === option;
                              const showCorrect =
                                submitted &&
                                correctSet.has(canonicalAnswerPart(option));
                              const showWrong =
                                submitted &&
                                isSelected &&
                                !correctSet.has(canonicalAnswerPart(option));

                              return (
                                <button
                                  key={option}
                                  type="button"
                                  disabled={submitted}
                                  onClick={() => {
                                    setAnswers((prev) => {
                                      if (!isMultiAnswer) {
                                        return { ...prev, [question.id]: option };
                                      }

                                      const next = new Set(
                                        selectedOptions(prev[question.id])
                                      );
                                      if (next.has(option)) {
                                        next.delete(option);
                                      } else {
                                        if (next.size >= requiredCount) {
                                          return prev;
                                        }
                                        next.add(option);
                                      }

                                      const nextAnswers = { ...prev };
                                      if (next.size === 0) {
                                        delete nextAnswers[question.id];
                                      } else {
                                        nextAnswers[question.id] =
                                          joinSelectedOptions(Array.from(next));
                                      }
                                      return nextAnswers;
                                    });
                                  }}
                                  className={`flex w-full items-start gap-2 rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                                    showCorrect
                                      ? "border-emerald-500/50 bg-emerald-500/10"
                                      : showWrong
                                        ? "border-destructive/50 bg-destructive/10"
                                        : isSelected
                                          ? "border-primary/60 bg-primary/10"
                                          : "border-border hover:bg-muted/60"
                                  }`}
                                >
                                  <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center">
                                    {showCorrect ? (
                                      <CheckCircle2 className="size-4 text-emerald-600" />
                                    ) : showWrong ? (
                                      <XCircle className="size-4 text-destructive" />
                                    ) : (
                                      <span
                                        className={`flex size-4 items-center justify-center ${
                                          isMultiAnswer ? "rounded-[3px]" : "rounded-full"
                                        } border ${
                                          isSelected
                                            ? "border-primary bg-primary"
                                            : "border-muted-foreground/40"
                                        }`}
                                      >
                                        {isSelected && isMultiAnswer && (
                                          <CheckCircle2 className="size-3 text-primary-foreground" />
                                        )}
                                      </span>
                                    )}
                                  </span>
                                  <span>{option}</span>
                                </button>
                              );
                              })}
                            </div>
                          )}

                          {submitted && (
                            <div className="mt-3 rounded-md bg-muted px-3 py-2 text-sm">
                              <p className="flex items-center gap-1.5 font-medium">
                                <ListChecks className="size-3.5" />
                                {isCorrect
                                  ? t.practice.correct
                                  : t.practice.review}
                              </p>
                              <p className="mt-1 leading-6 text-muted-foreground">
                                {question.explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </section>
        </main>
      )}
    </div>
  );
}
