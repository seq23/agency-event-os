import { EventSetupShell } from "@/components/events/setup/EventSetupShell";
import { VenueModulesSetupPanel } from "@/components/events/setup/SetupPanels";
import { getEventAccessConfig, getEventConfigPackage } from "@/services/events/eventConfigRepository";

export default function EventSetupSubroutePage({ params }: { params: { eventId: string } }) {
  const config = getEventConfigPackage(params.eventId);
  return (
    <EventSetupShell eventId={params.eventId} active="venue" eyebrow="Setup · Venue" title="Venue modules setup">
      <VenueModulesSetupPanel  />
    </EventSetupShell>
  );
}
