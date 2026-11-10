import { redirect } from "next/navigation";
import { getWritingQuestionsById } from "@/lib/db/queries";
import WritingPageClient from "./client";
import SavedWritingClient from "./saved-client";

export default async function WritingPage({
  searchParams,
}: {
  searchParams: Promise<{
    task_1_id?: string;
    task_2_id?: string;
    conversation_id?: string;
  }>;
}) {
  const { task_1_id, task_2_id, conversation_id } = await searchParams;

  if (conversation_id) {
    return <SavedWritingClient conversationId={conversation_id} />;
  }

  const ids = [task_1_id, task_2_id].filter(Boolean) as string[];

  // No IDs → submission flow (handled client-side via sessionStorage)
  if (ids.length === 0) {
    return <WritingPageClient initialQuestions={null} />;
  }

  const rows = await getWritingQuestionsById(ids);
  if (rows.length === 0) {
    redirect("/chat");
  }

  const questions = rows.map((q) => ({
    id: q.id,
    title: q.testTitle,
    content: q.content,
    imageUrl: q.imageUrl ?? undefined,
    taskNumber: q.taskNumber,
  }));

  return <WritingPageClient initialQuestions={questions} />;
}
