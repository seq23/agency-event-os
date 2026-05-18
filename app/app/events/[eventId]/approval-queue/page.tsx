import { EventApprovalQueue } from "@/components/approvals/EventApprovalQueue";

export default function EventApprovalQueuePage({ params }: { params: { eventId: string } }) {
  return <EventApprovalQueue eventId={params.eventId} />;
}
