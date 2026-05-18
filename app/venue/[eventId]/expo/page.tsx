import { ExpoDirectory } from "@/components/venue/VenuePages";
export default function Expo({ params }: { params: { eventId: string } }) { return <ExpoDirectory eventId={params.eventId} />; }
