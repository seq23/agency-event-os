import { SponsorReadyRoom } from "@/components/sponsors/SponsorReadyRoom";
export default async function SponsorReadyRoomPage({ params }: { params: Promise<{ eventId: string }> }) {
  const resolvedParams = await params; return <SponsorReadyRoom eventId={resolvedParams.eventId} />; }
