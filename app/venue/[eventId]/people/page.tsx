import { PeopleDirectory } from "@/components/venue/VenuePages";
export default function People({ params }: { params: { eventId: string } }) { return <PeopleDirectory eventId={params.eventId} />; }
