import { SpeakerGreenRoom } from "@/components/speakers/SpeakerGreenRoom";

export default function SpeakerGreenRoomPage({ params }: { params: { eventId: string } }) {
  return <SpeakerGreenRoom eventId={params.eventId} />;
}
