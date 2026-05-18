import { ClientReportBuilderShell } from "@/components/analytics/EventAnalyticsDashboard";

export default function EventReportPage({ params }: { params: { eventId: string } }) {
  return <ClientReportBuilderShell eventId={params.eventId} />;
}
