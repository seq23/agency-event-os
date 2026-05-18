import { EventOverview } from "@/components/events/EventOverview";

export default function EventOverviewPage({ params }: { params: { eventId: string } }) {
  return <EventOverview eventId={params.eventId} />;
}
