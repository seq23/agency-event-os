import { ManageEventTabs } from "@/components/events/ManageEventTabs";
import { EventCommunicationsDashboard } from "@/components/communications/EventCommunicationsDashboard";

export default async function EventCommunicationsPage({ params }: { params: Promise<{ eventId: string }> }) {
  const resolvedParams = await params;
  return <div className="space-y-6"><ManageEventTabs eventId={resolvedParams.eventId} /><EventCommunicationsDashboard eventId={resolvedParams.eventId} /></div>;
}
