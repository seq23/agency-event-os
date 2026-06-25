import { EventSetupShell } from "@/components/events/setup/EventSetupShell";
import { AttendeeFlowSetupPanel } from "@/components/events/setup/SetupPanels";
import { getEventConfigPackage } from "@/services/events/eventConfigRepository";

export default async function EventSetupSubroutePage({ params }: { params: Promise<{ eventId: string }> }) {
  const resolvedParams = await params;
  const config = getEventConfigPackage(resolvedParams.eventId);
  return (
    <EventSetupShell eventId={resolvedParams.eventId} active="attendee-flow" eyebrow="Setup · Attendee flow" title="Attendee flow setup">
      <AttendeeFlowSetupPanel attendee={config.attendee} />
    </EventSetupShell>
  );
}
