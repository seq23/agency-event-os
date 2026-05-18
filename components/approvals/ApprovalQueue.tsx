import { getApprovalsForEvent } from "@/lib/mock/getMockData";
import { SectionCard } from "@/components/shared/SectionCard";
import { StatusBadge } from "@/components/shared/StatusBadge";

export function ApprovalQueue({ eventId, clientFacing = false }: { eventId: string; clientFacing?: boolean }) {
  const approvals = getApprovalsForEvent(eventId).filter((approval) => !clientFacing || approval.clientVisible);

  return (
    <SectionCard title={clientFacing ? "Approvals awaiting your review" : "Approval queue"} eyebrow={clientFacing ? "Client portal" : "Agency review"}>
      <div className="space-y-3">
        {approvals.map((approval) => (
          <div key={approval.id} className="rounded-2xl border border-slate-200 p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold">{approval.title}</p>
                <p className="mt-1 text-sm text-slate-600">{approval.description}</p>
              </div>
              <StatusBadge status={approval.status} tone={approval.status === "approved" ? "good" : "warn"} />
            </div>
            <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
              Comment thread shell: versioned comments and decision history will persist here later.
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
