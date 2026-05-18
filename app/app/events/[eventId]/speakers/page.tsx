import { SpeakerManager } from "@/components/speakers/SpeakerManager";
export default function SpeakersPage({ params }: { params: { eventId: string } }){ return <SpeakerManager eventId={params.eventId} />; }
