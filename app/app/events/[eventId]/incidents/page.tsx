import { IncidentPanel } from "@/components/production/IncidentPanel";

export default function EventIncidentsPage({ params }: { params: { eventId: string } }) {
  return <IncidentPanel eventId={params.eventId} />;
}
