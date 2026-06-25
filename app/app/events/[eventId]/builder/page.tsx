import { EventOverview } from "@/components/events/EventOverview";

export default async function EventBuilderPage({ params }: { params: Promise<{ eventId: string }> }) {
  const resolvedParams = await params;
  return <EventOverview eventId={resolvedParams.eventId} />;
}
