import { EventAnalyticsDashboard } from "@/components/analytics/EventAnalyticsDashboard";

export default async function EventAnalyticsPage({ params }: { params: Promise<{ eventId: string }> }) {
  const resolvedParams = await params;
  return <EventAnalyticsDashboard eventId={resolvedParams.eventId} />;
}
