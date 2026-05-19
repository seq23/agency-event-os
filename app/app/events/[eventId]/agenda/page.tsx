import { EventSetupShell } from "@/components/events/setup/EventSetupShell";
import { AgendaSetupPanel } from "@/components/events/setup/SetupPanels";
import { getEventAccessConfig, getEventConfigPackage } from "@/services/events/eventConfigRepository";

export default function EventSetupSubroutePage({ params }: { params: { eventId: string } }) {
  const config = getEventConfigPackage(params.eventId);
  return (
    <EventSetupShell eventId={params.eventId} active="agenda" eyebrow="Setup · Agenda" title="Agenda setup">
      <AgendaSetupPanel sessions={config.agenda.sessions} />
    </EventSetupShell>
  );
}
