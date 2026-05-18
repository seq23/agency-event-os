import { EventAnalyticsDashboard } from "@/components/analytics/EventAnalyticsDashboard";

export default function EventAnalyticsPage({ params }: { params: { eventId: string } }) {
  return <EventAnalyticsDashboard eventId={params.eventId} />;
}
