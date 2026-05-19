import { EventSetupShell } from "@/components/events/setup/EventSetupShell";
import { AccessSetupPanel } from "@/components/events/setup/SetupPanels";
import { getEventAccessConfig, getEventConfigPackage } from "@/services/events/eventConfigRepository";

export default function EventSetupSubroutePage({ params }: { params: { eventId: string } }) {
  const config = getEventConfigPackage(params.eventId);
  const access = getEventAccessConfig(config.event.slug);
  if (!access) throw new Error(`Access config missing for ${config.event.slug}.`);
  return (
    <EventSetupShell eventId={params.eventId} active="access" eyebrow="Setup · Access" title="Access setup">
      <AccessSetupPanel crewKey={access.crewPasswordEnvKey} roles={access.specialGuestCodes} />
    </EventSetupShell>
  );
}
