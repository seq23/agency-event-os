import { ProductionCommandCenter } from "@/components/production/ProductionCommandCenter";
import { ManageEventTabs } from "@/components/events/ManageEventTabs";

export default async function EventCommandCenterPage({ params }: { params: Promise<{ eventId: string }> }) {
  const resolvedParams = await params;
  return <div className="space-y-6"><ManageEventTabs eventId={resolvedParams.eventId} /><ProductionCommandCenter eventId={resolvedParams.eventId} /></div>;
}
