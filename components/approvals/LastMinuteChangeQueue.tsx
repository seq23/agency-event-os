import { getLastMinuteChanges } from "@/services/change-control";
import { SectionCard } from "@/components/shared/SectionCard";
import { StatusBadge } from "@/components/shared/StatusBadge";

export function LastMinuteChangeQueue({ eventId }: { eventId: string }) {
  const changes = getLastMinuteChanges(eventId);

  return (
    <SectionCard title="Last-minute changes" eyebrow="Producer-controlled live safety">
      <div className="space-y-3">
        {changes.map((change) => (
          <div key={change.id} className="rounded-2xl border border-slate-200 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{change.title}</p>
                <p className="mt-1 text-sm text-slate-600">{change.diffSummary}</p>
                <p className="mt-2 text-xs text-slate-500">
                  {change.minutesUntilSegment} min until segment · Risk: {change.risk} · Urgency: {change.urgency.replace(/_/g, " ")}
                </p>
              </div>
              <StatusBadge status={change.status} tone={["high", "showstopper"].includes(change.risk) ? "bad" : "warn"} />
            </div>
            <div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">{change.recommendedAction}</div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
