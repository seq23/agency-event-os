import { EventSetupShell } from "@/components/events/setup/EventSetupShell";
import { BasicsSetupPanel } from "@/components/events/setup/SetupPanels";
import { getEventConfigPackage } from "@/services/events/eventConfigRepository";

export default function EventSetupPage({ params }: { params: { eventId: string } }) {
  const config = getEventConfigPackage(params.eventId);
  return (
    <EventSetupShell eventId={params.eventId} active="basics" eyebrow="Setup · Basics" title="Event basics">
      <BasicsSetupPanel event={config.event} />
    </EventSetupShell>
  );
}
