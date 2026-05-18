import { SessionRoomPage } from "@/components/venue/VenuePages";
export default function SessionRoom({ params }: { params: { eventId: string; sessionId: string } }) { return <SessionRoomPage eventId={params.eventId} sessionId={params.sessionId} />; }
