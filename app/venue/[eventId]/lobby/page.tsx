import { EventLobby } from "@/components/venue/VenuePages";
export default function Lobby({ params }: { params: { eventId: string } }) { return <EventLobby eventId={params.eventId} />; }
