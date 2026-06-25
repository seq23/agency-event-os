import { IncidentPanel } from "@/components/production/IncidentPanel";

export default async function EventIncidentsPage({ params }: { params: Promise<{ eventId: string }> }) {
  const resolvedParams = await params;
  return <IncidentPanel eventId={resolvedParams.eventId} />;
}
