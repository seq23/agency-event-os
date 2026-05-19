import { ClientReportBuilder } from "@/components/analytics/EventAnalyticsDashboard";

export default function EventReportPage({ params }: { params: { eventId: string } }) {
  return <ClientReportBuilder eventId={params.eventId} />;
}
