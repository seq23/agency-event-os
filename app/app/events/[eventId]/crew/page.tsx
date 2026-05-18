import { EventCrewBoard } from "@/components/contractors/ContractorBoard";
export default function CrewPage({ params }: { params: { eventId: string } }){ return <EventCrewBoard eventId={params.eventId} />; }
