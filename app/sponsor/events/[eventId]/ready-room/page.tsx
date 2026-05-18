import { SponsorReadyRoom } from "@/components/sponsors/SponsorReadyRoom";
export default function SponsorReadyRoomPage({ params }: { params: { eventId: string } }) { return <SponsorReadyRoom eventId={params.eventId} />; }
