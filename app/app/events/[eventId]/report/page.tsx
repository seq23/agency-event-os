import { ClientReportBuilder } from "@/components/analytics/EventAnalyticsDashboard";

export default async function EventReportPage({ params }: { params: Promise<{ eventId: string }> }) {
  const resolvedParams = await params;
  return <ClientReportBuilder eventId={resolvedParams.eventId} />;
}
