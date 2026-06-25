import { ApprovalQueue } from "@/components/approvals/ApprovalQueue";
export default async function ApprovalsPage({ params }: { params: Promise<{ eventId: string }> }) {
  const resolvedParams = await params; return <ApprovalQueue eventId={resolvedParams.eventId} />; }
