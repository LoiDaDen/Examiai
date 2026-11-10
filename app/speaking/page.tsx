import SpeakingPageClient from "./client";
import SavedSpeakingClient from "./saved-client";

export default async function SpeakingPage({
  searchParams,
}: {
  searchParams: Promise<{ conversation_id?: string }>;
}) {
  const { conversation_id } = await searchParams;

  if (conversation_id) {
    return <SavedSpeakingClient conversationId={conversation_id} />;
  }

  return <SpeakingPageClient />;
}
