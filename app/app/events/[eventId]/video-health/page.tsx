import { VideoHealthPanel } from "@/components/production/VideoHealthPanel";

export default function EventVideoHealthPage({ params }: { params: { eventId: string } }) {
  return <VideoHealthPanel eventId={params.eventId} />;
}
