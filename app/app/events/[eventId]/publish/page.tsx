import { EventPublishPanel } from "@/components/events/EventPublishPanel";

export default async function EventPublishPage({ params }: { params: Promise<{ eventId: string }> }) {
  const resolvedParams = await params;
  return <EventPublishPanel eventId={resolvedParams.eventId} />;
}
