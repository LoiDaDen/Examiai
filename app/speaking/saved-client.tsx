"use client";

import { useEffect, useState } from "react";
import type { ComponentProps } from "react";
import { authFetch } from "@/lib/auth/client-request";
import SpeakingPageClient from "./client";

type Saved = NonNullable<
  ComponentProps<typeof SpeakingPageClient>["savedConversation"]
>;

export default function SavedSpeakingClient({
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
        const messages = data.messages;

        if (!Array.isArray(messages) || messages.length === 0) {
          throw new Error("No saved messages");
        }

        const config = JSON.parse(messages[0].content);

        if (
          messages[0].role !== "system" ||
          config.type !== "speaking_config" ||
          !Array.isArray(config.questions)
        ) {
          throw new Error("Invalid speaking history");
        }

        const result: Saved = {
          conversationId,
          questions: config.questions,
          messages: messages.slice(1)
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
        console.error("[speaking] Load failed", e);
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
    return <div className="p-6">Loading speaking history...</div>;
  }

  return <SpeakingPageClient savedConversation={saved} />;
}
