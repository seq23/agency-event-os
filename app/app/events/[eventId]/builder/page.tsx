import { EventOverview } from "@/components/events/EventOverview";

export default function EventBuilderPage({ params }: { params: { eventId: string } }) {
  return <EventOverview eventId={params.eventId} />;
}
