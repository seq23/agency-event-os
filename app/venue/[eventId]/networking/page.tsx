import { NetworkingPage } from "@/components/venue/VenuePages";
export default function Networking({ params }: { params: { eventId: string } }) { return <NetworkingPage eventId={params.eventId} />; }
