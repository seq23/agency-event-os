import { getApprovalSummary, getEventApprovalQueue } from "@/services/approval-ops";
import { SectionCard } from "@/components/shared/SectionCard";
import { MetricCard } from "@/components/shared/MetricCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { LastMinuteChangeQueue } from "./LastMinuteChangeQueue";

export function EventApprovalQueue({ eventId }: { eventId: string }) {
  const items = getEventApprovalQueue(eventId);
  const summary = getApprovalSummary(eventId);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
        <p className="text-sm text-slate-500">Event approval queue</p>
        <h1 className="mt-2 text-3xl font-semibold">Approvals, blockers, and final locks</h1>
        <p className="mt-2 text-slate-600">Unified review surface for speaker assets, sponsor deliverables, client review, and last-minute changes.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Total approvals" value={summary.total} />
        <MetricCard label="Agency review" value={summary.needsAgencyReview} />
        <MetricCard label="Client review" value={summary.needsClientReview} />
        <MetricCard label="Blocking items" value={summary.blocking} />
      </div>

      <SectionCard title="Approval items">
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{item.lastComment}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    Owner: {item.currentOwner} · Blocks: {item.blockingScope} · Client approval: {item.clientApprovalRequired ? "required" : "not required"}
                  </p>
                </div>
                <StatusBadge status={item.status} tone={["approved", "locked", "used_live"].includes(item.status) ? "good" : "warn"} />
              </div>
              <p className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">Next: {item.nextAction}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <LastMinuteChangeQueue eventId={eventId} />
    </div>
  );
}
