import { SpeedNetworkingRoom } from "@/components/venue/SpeedNetworkingRoom";

export default function VenueNetworkingPage({ params }: { params: { eventId: string } }) {
  return <SpeedNetworkingRoom eventId={params.eventId} />;
}
