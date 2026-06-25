import { EventSetupShell } from "@/components/events/setup/EventSetupShell";
import { AccessSetupPanel } from "@/components/events/setup/SetupPanels";
import { getEventAccessConfig, getEventConfigPackage } from "@/services/events/eventConfigRepository";

export default async function EventSetupSubroutePage({ params }: { params: Promise<{ eventId: string }> }) {
  const resolvedParams = await params;
  const config = getEventConfigPackage(resolvedParams.eventId);
  const access = getEventAccessConfig(config.event.slug);
  if (!access) throw new Error(`Access config missing for ${config.event.slug}.`);
  return (
    <EventSetupShell eventId={resolvedParams.eventId} active="access" eyebrow="Setup · Access" title="Access setup">
      <AccessSetupPanel crewKey={access.crewPasswordEnvKey} roles={access.specialGuestCodes} />
    </EventSetupShell>
  );
}
