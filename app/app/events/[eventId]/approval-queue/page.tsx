import { OperationalPersistencePanel } from "@/components/persistence/OperationalPersistencePanel";
import { EventApprovalQueue } from "@/components/approvals/EventApprovalQueue";
export default function EventApprovalQueuePage({ params }: { params: { eventId: string } }) { return <main className="space-y-6"><OperationalPersistencePanel /><EventApprovalQueue eventId={params.eventId} /></main>; }
