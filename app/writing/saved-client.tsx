"use client";

import { useEffect, useState } from "react";
import type { ComponentProps } from "react";
import { authFetch } from "@/lib/auth/client-request";
import WritingPageClient from "./client";

type Saved = NonNullable<
  ComponentProps<typeof WritingPageClient>["savedConversation"]
>;

export default function SavedWritingClient({
  conversationId,
}: {
  conversationId: string;
}) {
  const [saved, setSaved] = useState<Saved | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await authFetch(
          `/api/conversations/${conversationId}/messages`,
          { cache: "no-store" }
        );

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        const msgs = data.messages;

        if (!Array.isArray(msgs) || msgs.length < 2) {
          throw new Error("Missing writing history");
        }

        const userMsg = JSON.parse(msgs[0].content);
        const assistantMsg = JSON.parse(msgs[1].content);

        if (
          userMsg.type !== "writing_submission" ||
          assistantMsg.type !== "writing_feedback"
        ) {
          throw new Error("Invalid writing history");
        }

        const result: Saved = {
          conversationId,
          submission: {
            taskNumber: userMsg.taskNumber,
            question: userMsg.question,
            essay: userMsg.essay,
            imageUrl: userMsg.imageUrl,
            wordCount: userMsg.wordCount || 0,
            timeSpent: userMsg.timeSpent,
          },
          assessment: {
            overview: assistantMsg.overview != null ? {
              overview: assistantMsg.overview,
              strengths: assistantMsg.strengths,
              weaknesses: assistantMsg.weaknesses,
            } : null,
            scoring: assistantMsg.taskResponseHighLevel != null ? {
              taskResponseHighLevel: assistantMsg.taskResponseHighLevel,
              taskResponseStrengths: assistantMsg.taskResponseStrengths,
              taskResponseWeaknesses: assistantMsg.taskResponseWeaknesses,
              taskResponseScore: assistantMsg.taskResponseScore,
              coherenceHighLevel: assistantMsg.coherenceHighLevel,
              coherenceStrengths: assistantMsg.coherenceStrengths,
              coherenceWeaknesses: assistantMsg.coherenceWeaknesses,
              coherenceScore: assistantMsg.coherenceScore,
            } : null,
            languageAnalysis: assistantMsg.correctedEssay != null ? {
              lexicalResourceHighLevel: assistantMsg.lexicalResourceHighLevel,
              lexicalResourceStrengths: assistantMsg.lexicalResourceStrengths,
              lexicalResourceWeaknesses: assistantMsg.lexicalResourceWeaknesses,
              grammaticalRangeHighLevel: assistantMsg.grammaticalRangeHighLevel,
              grammaticalRangeStrengths: assistantMsg.grammaticalRangeStrengths,
              grammaticalRangeWeaknesses: assistantMsg.grammaticalRangeWeaknesses,
              correctedEssay: assistantMsg.correctedEssay,
              keyChanges: assistantMsg.keyChanges,
              lexicalResourceScore: assistantMsg.lexicalResourceScore,
              grammaticalRangeScore: assistantMsg.grammaticalRangeScore,
            } : null,
            improvement: assistantMsg.improvedEssay != null ? {
              improvedEssay: assistantMsg.improvedEssay,
              vocabularyExplanations: assistantMsg.vocabularyExplanations,
              ...(assistantMsg.expandIdeas != null ? {
                expandIdeas: assistantMsg.expandIdeas,
                alternativeDirection: assistantMsg.alternativeDirection,
                alternativeEssay: assistantMsg.alternativeEssay,
                alternativeVocabulary: assistantMsg.alternativeVocabulary,
              } : {}),
            } : null,
            done: true,
            failedSections: {},
          },
          followUpMessages: msgs.slice(2)
            .filter(
              (m: { role: string }) =>
                m.role === "user" || m.role === "assistant"
            )
            .map(
              (m: { id: string; role: string; content: string }) => ({
                id: m.id,
                role: m.role as "user" | "assistant",
                content: m.content,
              })
            ),
        };

        if (!cancelled) setSaved(result);
      } catch (e) {
        console.error("[writing] Load failed", e);
        if (!cancelled) setError(true);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [conversationId]);

  if (error) {
    return <div className="p-6">
      Cannot access this conversation. <a href="/chat">Back to Chat</a>
    </div>;
  }

  if (!saved) {
    return <div className="p-6">Loading writing history...</div>;
  }

  return (
    <WritingPageClient
      initialQuestions={null}
      savedConversation={saved}
    />
  );
}
