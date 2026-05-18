import { SessionDirectory } from "@/components/venue/VenuePages";
export default function Sessions({ params }: { params: { eventId: string } }) { return <SessionDirectory eventId={params.eventId} />; }
