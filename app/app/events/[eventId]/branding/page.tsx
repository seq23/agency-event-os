import { EventSetupShell } from "@/components/events/setup/EventSetupShell";
import { BrandingSetupPanel } from "@/components/events/setup/SetupPanels";
import { getEventConfigPackage } from "@/services/events/eventConfigRepository";

export default async function EventSetupSubroutePage({ params }: { params: Promise<{ eventId: string }> }) {
  const resolvedParams = await params;
  const config = getEventConfigPackage(resolvedParams.eventId);
  return (
    <EventSetupShell eventId={resolvedParams.eventId} active="branding" eyebrow="Setup · Branding" title="Branding setup">
      <BrandingSetupPanel branding={config.branding} />
    </EventSetupShell>
  );
}
