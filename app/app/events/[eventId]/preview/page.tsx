import { EventSetupShell } from "@/components/events/setup/EventSetupShell";
import { EventPreviewPanel } from "@/components/events/setup/SetupPanels";
import { getEventAccessConfig, getEventConfigPackage } from "@/services/events/eventConfigRepository";

export default function EventSetupSubroutePage({ params }: { params: { eventId: string } }) {
  const config = getEventConfigPackage(params.eventId);
  return (
    <EventSetupShell eventId={params.eventId} active="preview" eyebrow="Setup · Preview" title="Preview all journeys">
      <EventPreviewPanel paths={[`/events/${config.event.slug}`, `/events/${config.event.slug}/register`, `/venue/${config.event.id}/lobby`, `/speaker/events/${config.event.id}`, `/sponsor/events/${config.event.id}`, `/client/${config.event.clientSlug || "client"}/events/${config.event.id}`]} />
    </EventSetupShell>
  );
}
