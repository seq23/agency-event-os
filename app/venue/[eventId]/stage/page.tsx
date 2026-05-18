import { MainStagePage } from "@/components/venue/VenuePages";
export default function Stage({ params }: { params: { eventId: string } }) { return <MainStagePage eventId={params.eventId} />; }
