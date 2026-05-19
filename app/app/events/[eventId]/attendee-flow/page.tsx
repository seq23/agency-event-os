import { EventSetupShell } from "@/components/events/setup/EventSetupShell";
import { AttendeeFlowSetupPanel } from "@/components/events/setup/SetupPanels";
import { getEventAccessConfig, getEventConfigPackage } from "@/services/events/eventConfigRepository";

export default function EventSetupSubroutePage({ params }: { params: { eventId: string } }) {
  const config = getEventConfigPackage(params.eventId);
  return (
    <EventSetupShell eventId={params.eventId} active="attendee-flow" eyebrow="Setup · Attendee flow" title="Attendee flow setup">
      <AttendeeFlowSetupPanel attendee={config.attendee} />
    </EventSetupShell>
  );
}
