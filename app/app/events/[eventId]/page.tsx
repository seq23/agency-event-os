import { ProductionCommandCenter } from "@/components/production/ProductionCommandCenter";
import { ManageEventTabs } from "@/components/events/ManageEventTabs";

export default function EventCommandCenterPage({ params }: { params: { eventId: string } }) {
  return <div className="space-y-6"><ManageEventTabs eventId={params.eventId} /><ProductionCommandCenter eventId={params.eventId} /></div>;
}
