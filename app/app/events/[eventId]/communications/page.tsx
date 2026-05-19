import { ManageEventTabs } from "@/components/events/ManageEventTabs";
import { EventCommunicationsDashboard } from "@/components/communications/EventCommunicationsDashboard";

export default function EventCommunicationsPage({ params }: { params: { eventId: string } }) {
  return <div className="space-y-6"><ManageEventTabs eventId={params.eventId} /><EventCommunicationsDashboard eventId={params.eventId} /></div>;
}
