import { ReplayLibrary } from "@/components/venue/VenuePages";
export default function Replay({ params }: { params: { eventId: string } }) { return <ReplayLibrary eventId={params.eventId} />; }
