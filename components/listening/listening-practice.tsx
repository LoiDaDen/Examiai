"use client";

import { useEffect, useEffectEvent, useMemo, useRef, useState } from "react";
import {
  Activity,
  CheckCircle2,
  ChevronLeft,
  Clock,
  FileQuestion,
  Home,
  ListChecks,
  Loader2,
  Play,
  Radio,
  Send,
  Sparkles,
  Square,
  Volume2,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { UserProfileMenu } from "@/components/user-profile-menu";
import { useI18n } from "@/lib/i18n/provider";
import type {
  ListeningAssessmentFeedback,
  ListeningQuestionData,
  ListeningQuestionType,
} from "@/lib/types";

interface ListeningSection {
  id: string;
  testId: string;
  title: string;
  testTitle: string;
  sectionNumber: number;
  audioUrl: string | null;
  transcript: string | null;
  difficulty: string;
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

function questionTypeLabel(type: ListeningQuestionType) {
  const labels: Record<ListeningQuestionType, string> = {
    "multiple-choice": "Multiple choice",
    "form-completion": "Form completion",
    "note-completion": "Note completion",
    "sentence-completion": "Sentence completion",
    matching: "Matching",
    "map-label": "Map label",
  };

  return labels[type];
}

function normalizeAnswer(value?: string) {
  return (value ?? "").trim().replace(/\s+/g, " ").toLowerCase();
}

function isAnswerCorrect(userAnswer: string | undefined, correctAnswer: string) {
  return normalizeAnswer(userAnswer) === normalizeAnswer(correctAnswer);
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function termToPattern(term: string) {
  return escapeRegExp(term.trim()).replace(/\s+/g, "\\s+");
}

interface TranscriptHighlight {
  term: string;
  questionNumbers: number[];
}

function addHighlight(
  highlights: Map<string, Set<number>>,
  term: string,
  questionNumber: number
) {
  const cleaned = term.trim();
  if (!cleaned) return;

  const key = normalizeAnswer(cleaned);
  const existing = highlights.get(key) ?? new Set<number>();
  existing.add(questionNumber);
  highlights.set(key, existing);
}

function extractTranscriptHighlights(
  questions: ListeningQuestionData[]
): TranscriptHighlight[] {
  const highlights = new Map<string, Set<number>>();
  const originalTerms = new Map<string, string>();

  for (const [index, question] of questions.entries()) {
    const questionNumber = index + 1;
    for (const answerPart of question.answer.split(",")) {
      const answer = answerPart.trim();
      if (answer.length >= 2 && !/^[A-E]$/i.test(answer)) {
        const key = normalizeAnswer(answer);
        originalTerms.set(key, answer);
        addHighlight(highlights, answer, questionNumber);
      }
    }

    const quotedEvidence = Array.from(
      question.explanation.matchAll(/["“](.+?)["”]/g)
    ).map((match) => match[1]);
    for (const phrase of quotedEvidence) {
      if (phrase.length >= 12 && phrase.length <= 180) {
        const key = normalizeAnswer(phrase);
        originalTerms.set(key, phrase);
        addHighlight(highlights, phrase, questionNumber);
      }
    }

    for (const sentence of question.explanation.split(/(?<=[.!?])\s+/)) {
      const cleaned = sentence.trim();
      if (
        cleaned.length >= 24 &&
        cleaned.length <= 180 &&
        cleaned.split(/\s+/).length >= 5
      ) {
        const key = normalizeAnswer(cleaned);
        originalTerms.set(key, cleaned);
        addHighlight(highlights, cleaned, questionNumber);
      }
    }
  }

  return Array.from(highlights.entries())
    .map(([key, questionNumbers]) => ({
      term: originalTerms.get(key) ?? key,
      questionNumbers: Array.from(questionNumbers).sort((a, b) => a - b),
    }))
    .sort((a, b) => b.term.length - a.term.length)
    .slice(0, 60);
}

function HighlightedTranscript({
  transcript,
  highlights,
}: {
  transcript: string;
  highlights: TranscriptHighlight[];
}) {
  if (highlights.length === 0) {
    return (
      <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
        {transcript}
      </p>
    );
  }

  const pattern = new RegExp(
    `(${highlights.map((highlight) => termToPattern(highlight.term)).join("|")})`,
    "gi"
  );
  const parts = transcript.split(pattern);

  return (
    <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
      {parts.map((part, index) => {
        const highlight = highlights.find(
          (item) => normalizeAnswer(item.term) === normalizeAnswer(part)
        );

        if (!highlight) {
          return <span key={`${part}-${index}`}>{part}</span>;
        }

        return (
          <mark
            key={`${part}-${index}`}
            className="inline rounded-sm bg-emerald-400/25 px-0.5 text-foreground underline decoration-emerald-500 decoration-2 underline-offset-4"
          >
            {part}
            <span className="ml-1 inline-flex translate-y-[-1px] items-center rounded bg-primary px-1 py-0.5 text-[10px] font-bold leading-none text-primary-foreground no-underline">
              {highlight.questionNumbers.join(",")}
            </span>
          </mark>
        );
      })}
    </p>
  );
}

export function ListeningPractice() {
  const router = useRouter();
  const { language, t } = useI18n();
  const [section, setSection] = useState<ListeningSection | null>(null);
  const [questions, setQuestions] = useState<ListeningQuestionData[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAssessing, setIsAssessing] = useState(false);
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [assessment, setAssessment] =
    useState<ListeningAssessmentFeedback | null>(null);
  const [timeLeft, setTimeLeft] = useState(10 * 60);
  const assessmentLanguageRef = useRef<string | null>(null);

  const reportListeningError = useEffectEvent(() => {
    setLoadError(t.practice.listeningDataMissing);
  });

  useEffect(() => {
    let cancelled = false;

    async function loadListeningSection() {
      setIsLoading(true);
      setLoadError(null);
      try {
        const res = await fetch("/api/listening/questions", { method: "POST" });
        if (!res.ok) throw new Error("No listening section available");
        const data = await res.json();
        if (cancelled) return;
        setSection(data.section);
        setQuestions(data.questions);
        setAnswers({});
        setSubmitted(false);
        setAssessment(null);
        setTimeLeft(10 * 60);
      } catch {
        if (!cancelled) {
          reportListeningError();
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadListeningSection();

    return () => {
      cancelled = true;
      window.speechSynthesis?.cancel();
    };
  }, []);

  useEffect(() => {
    if (submitted || !section || timeLeft <= 0) return;

    const interval = window.setInterval(() => {
      setTimeLeft((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [section, submitted, timeLeft]);

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = questions.length;
  const answerProgress =
    totalQuestions === 0 ? 0 : Math.round((answeredCount / totalQuestions) * 100);
  const score = useMemo(
    () =>
      questions.filter((question) =>
        isAnswerCorrect(answers[question.id], question.answer)
      )
        .length,
    [answers, questions]
  );
  const transcriptHighlights = useMemo(
    () => extractTranscriptHighlights(questions),
    [questions]
  );

  function playTranscript() {
    if (!section?.transcript || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(section.transcript);
    utterance.lang = "en-US";
    utterance.rate = 0.92;
    utterance.onend = () => setIsPlayingDemo(false);
    utterance.onerror = () => setIsPlayingDemo(false);
    setIsPlayingDemo(true);
    window.speechSynthesis.speak(utterance);
  }

  function stopTranscript() {
    window.speechSynthesis.cancel();
    setIsPlayingDemo(false);
  }

  async function assessListening(targetLanguage: typeof language) {
    if (!section || questions.length === 0) return;
    assessmentLanguageRef.current = targetLanguage;
    setIsAssessing(true);
    setAssessment(null);

    try {
      const res = await fetch("/api/listening/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: section.title,
          transcript: section.transcript,
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
        overview:
          t.practice.listeningFallbackOverview,
        strengths: [],
        weaknesses: [],
        strategyAdvice: [
          section.transcript
            ? t.practice.listeningFallbackTranscriptStrategy
            : t.practice.listeningFallbackAudioStrategy,
        ],
      });
    } finally {
      setIsAssessing(false);
    }
  }

  async function handleSubmit() {
    if (!section || questions.length === 0) return;
    setSubmitted(true);
    stopTranscript();
    await assessListening(language);
  }

  useEffect(() => {
    if (!submitted || !section || questions.length === 0) return;
    if (assessmentLanguageRef.current === language) return;

    assessListening(language);
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

          <div className="hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-muted-foreground sm:flex">
            <Radio className="size-3.5" />
            {t.practice.listeningLab}
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
      ) : loadError || !section ? (
        <main className="flex flex-1 items-center justify-center px-6">
          <div className="max-w-md text-center">
            <h1 className="text-xl font-semibold">
              {t.practice.listeningDataNotReady}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">{loadError}</p>
            <Button className="mt-5" onClick={() => router.push("/chat")}>
              {t.practice.backToChat}
            </Button>
          </div>
        </main>
      ) : (
        <main className="grid min-h-0 flex-1 bg-muted/20 lg:grid-cols-[minmax(320px,0.8fr)_minmax(460px,1.2fr)]">
          <section className="flex min-h-0 flex-col border-b border-border bg-background lg:border-b-0 lg:border-r">
            <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-6">
              <div>
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <Radio className="size-3.5" />
                  {t.practice.section} {section.sectionNumber}
                </p>
                <h1 className="mt-1 text-xl font-semibold tracking-tight">
                  {section.title}
                </h1>
              </div>
              <Button variant="ghost" size="sm" onClick={() => router.back()}>
                <ChevronLeft className="size-4" />
                {t.common.back}
              </Button>
            </div>

            <div className="px-4 py-4 sm:px-6">
              <div className="overflow-hidden rounded-lg border border-border bg-card">
                <div className="border-b border-border bg-muted/40 px-4 py-3">
                  <p className="flex items-center gap-2 text-sm font-semibold">
                    <Volume2 className="size-4 text-primary" />
                    {t.practice.audioConsole}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {section.testTitle}
                  </p>
                </div>

                <div className="space-y-4 p-4">
                  <div className="flex h-28 items-end gap-1 rounded-md border border-border bg-background px-3 py-4">
                    {Array.from({ length: 36 }).map((_, index) => {
                      const height = 24 + ((index * 17) % 54);

                      return (
                        <span
                          key={index}
                          className={`w-full rounded-full ${
                            isPlayingDemo
                              ? "bg-primary"
                              : "bg-muted-foreground/30"
                          }`}
                          style={{ height }}
                        />
                      );
                    })}
                  </div>

                  {section.audioUrl ? (
                    <audio
                      className="w-full"
                      src={section.audioUrl}
                      controls
                      preload="metadata"
                    />
                  ) : section.transcript ? (
                    <div className="flex flex-wrap items-center gap-2">
                      {isPlayingDemo ? (
                        <Button variant="outline" onClick={stopTranscript}>
                          <Square className="size-4" />
                          {t.practice.stopAudio}
                        </Button>
                      ) : (
                        <Button onClick={playTranscript}>
                          <Play className="size-4" />
                          {t.practice.playDemoAudio}
                        </Button>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {t.practice.seedAudioNote}
                      </span>
                    </div>
                  ) : (
                    <div className="rounded-md border border-dashed border-border px-3 py-2 text-sm text-muted-foreground">
                      {t.practice.noAudioAttached}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="px-4 pb-4 sm:px-6">
              <div className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-center justify-between text-sm">
                  <p className="flex items-center gap-2 font-medium">
                    <Activity className="size-4 text-primary" />
                    {t.practice.answerProgress}
                  </p>
                  <span className="font-semibold tabular-nums">
                    {answeredCount}/{totalQuestions}
                  </span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${answerProgress}%` }}
                  />
                </div>
              </div>
            </div>

            {!submitted && (
              <div className="px-4 pb-6 sm:px-6">
                <div className="rounded-lg border border-dashed border-border bg-card p-4 text-sm text-muted-foreground">
                  {section.transcript
                    ? t.practice.transcriptLocked
                    : t.practice.noScriptDuringTest}
                </div>
              </div>
            )}

            {submitted && section.transcript && (
              <ScrollArea className="min-h-0 flex-1">
                <div className="px-4 pb-8 sm:px-6">
                  <div className="rounded-lg border border-border bg-card p-4">
                    <p className="text-sm font-semibold">
                      {t.practice.transcript}
                    </p>
                    <HighlightedTranscript
                      transcript={section.transcript}
                      highlights={transcriptHighlights}
                    />
                  </div>
                </div>
              </ScrollArea>
            )}
          </section>

          <section className="flex min-h-0 flex-col bg-background">
            <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-6">
              <div>
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <FileQuestion className="size-3.5" />
                  {t.practice.answerSheet}
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
                      {t.practice.aiListeningFeedback}
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
                              {question.options.map((option) => {
                              const isSelected = selected === option;
                              const showCorrect =
                                submitted &&
                                isAnswerCorrect(option, question.answer);
                              const showWrong =
                                submitted &&
                                isSelected &&
                                !isAnswerCorrect(option, question.answer);

                              return (
                                <button
                                  key={option}
                                  type="button"
                                  disabled={submitted}
                                  onClick={() =>
                                    setAnswers((prev) => ({
                                      ...prev,
                                      [question.id]: option,
                                    }))
                                  }
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
                                        className={`size-3 rounded-full border ${
                                          isSelected
                                            ? "border-primary bg-primary"
                                            : "border-muted-foreground/40"
                                        }`}
                                      />
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
