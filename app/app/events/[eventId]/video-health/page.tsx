import { VideoHealthPanel } from "@/components/production/VideoHealthPanel";

export default async function EventVideoHealthPage({ params }: { params: Promise<{ eventId: string }> }) {
  const resolvedParams = await params;
  return <VideoHealthPanel eventId={resolvedParams.eventId} />;
}
