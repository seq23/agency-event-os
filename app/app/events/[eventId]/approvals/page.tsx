import { ApprovalQueue } from "@/components/approvals/ApprovalQueue";
export default function ApprovalsPage({ params }: { params: { eventId: string } }){ return <ApprovalQueue eventId={params.eventId} />; }
