import { VenueHelpPage } from "@/components/venue/VenuePages";
export default function Help({ params }: { params: { eventId: string } }) { return <VenueHelpPage eventId={params.eventId} />; }
