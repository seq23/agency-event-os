import { EventSetupShell } from "@/components/events/setup/EventSetupShell";
import { BrandingSetupPanel } from "@/components/events/setup/SetupPanels";
import { getEventAccessConfig, getEventConfigPackage } from "@/services/events/eventConfigRepository";

export default function EventSetupSubroutePage({ params }: { params: { eventId: string } }) {
  const config = getEventConfigPackage(params.eventId);
  return (
    <EventSetupShell eventId={params.eventId} active="branding" eyebrow="Setup · Branding" title="Branding setup">
      <BrandingSetupPanel branding={config.branding} />
    </EventSetupShell>
  );
}
