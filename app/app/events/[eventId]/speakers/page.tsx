import { SpeakerManager } from "@/components/speakers/SpeakerManager";
export default async function SpeakersPage({ params }: { params: Promise<{ eventId: string }> }) {
  const resolvedParams = await params; return <SpeakerManager eventId={resolvedParams.eventId} />; }
