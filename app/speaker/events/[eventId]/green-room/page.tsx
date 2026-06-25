import { SpeakerGreenRoom } from "@/components/speakers/SpeakerGreenRoom";
export default async function SpeakerGreenRoomPage({ params }: { params: Promise<{ eventId: string }> }) {
  const resolvedParams = await params; return <SpeakerGreenRoom eventId={resolvedParams.eventId} />; }
