import { ExpoBoothPage } from "@/components/venue/VenuePages";
export default function Booth({ params }: { params: { eventId: string; boothId: string } }) { return <ExpoBoothPage eventId={params.eventId} boothId={params.boothId} />; }
