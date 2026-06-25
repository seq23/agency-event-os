import { EventOverview } from "@/components/events/EventOverview";

export default async function EventOverviewPage({ params }: { params: Promise<{ eventId: string }> }) {
  const resolvedParams = await params;
  return <EventOverview eventId={resolvedParams.eventId} />;
}
