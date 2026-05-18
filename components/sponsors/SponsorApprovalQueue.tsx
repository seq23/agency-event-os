import { getEventApprovalQueue } from "@/services/approval-ops";
import { SectionCard } from "@/components/shared/SectionCard";
import { StatusBadge } from "@/components/shared/StatusBadge";

export function SponsorApprovalQueue({ eventId }: { eventId: string }) {
  const items = getEventApprovalQueue(eventId).filter((item) => item.itemType.startsWith("sponsor_"));

  return (
    <SectionCard title="Sponsor approval queue" eyebrow="Booth, CTA, offer, mentions">
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="mt-1 text-sm text-slate-600">{item.lastComment}</p>
              </div>
              <StatusBadge status={item.status} tone="warn" />
            </div>
            <p className="mt-3 text-sm text-slate-500">Next: {item.nextAction}</p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
