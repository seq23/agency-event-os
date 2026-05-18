import { getInboxSummary, getMagicLinksForEvent, getProductionInboxItems } from "@/services/event-intake";
import { SectionCard } from "@/components/shared/SectionCard";
import { MetricCard } from "@/components/shared/MetricCard";
import { StatusBadge } from "@/components/shared/StatusBadge";

export function ProductionInbox({ eventId }: { eventId: string }) {
  const items = getProductionInboxItems(eventId);
  const links = getMagicLinksForEvent(eventId);
  const summary = getInboxSummary(eventId);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
        <p className="text-sm text-slate-500">Production inbox</p>
        <h1 className="mt-2 text-3xl font-semibold">Turn messy inbound assets into structured work</h1>
        <p className="mt-2 text-slate-600">Portal uploads, emailed attachments, cloud links, late submissions, and comments land here before becoming clean assets or approvals.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Inbox items" value={summary.total} />
        <MetricCard label="Needs matching" value={summary.needsMatching} />
        <MetricCard label="Needs review" value={summary.needsReview} />
      </div>

      <SectionCard title="Magic links and Event ID">
        <div className="grid gap-3 md:grid-cols-2">
          {links.map((link) => (
            <div key={link.id} className="rounded-2xl border border-slate-200 p-4">
              <p className="font-semibold">{link.label}</p>
              <p className="mt-1 text-sm text-slate-500">Event ID: {link.eventCode}</p>
              <p className="mt-2 rounded-xl bg-slate-50 p-2 text-sm">{link.url}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Inbound queue">
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{item.subject}</p>
                  <p className="mt-1 text-sm text-slate-600">{item.summary}</p>
                  <p className="mt-2 text-xs text-slate-500">{item.senderName} · {item.sourceChannel.replace(/_/g, " ")} · {item.eventCode}</p>
                </div>
                <StatusBadge status={item.status} tone={["needs_matching", "needs_review"].includes(item.status) ? "warn" : "neutral"} />
              </div>
              <p className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">Next: {item.nextAction}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
