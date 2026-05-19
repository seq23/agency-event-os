import { EventPublishPanel } from "@/components/events/EventPublishPanel";

export default function EventPublishPage({ params }: { params: { eventId: string } }) {
  return <EventPublishPanel eventId={params.eventId} />;
}
