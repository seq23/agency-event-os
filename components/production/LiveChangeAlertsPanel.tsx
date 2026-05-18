import { getLastMinuteChanges } from "@/services/change-control";
import { SectionCard } from "@/components/shared/SectionCard";

export function LiveChangeAlertsPanel({ eventId }: { eventId: string }) {
  const changes = getLastMinuteChanges(eventId).filter((change) => !["approved", "rejected", "archived"].includes(change.status));

  return (
    <SectionCard title="Live change alerts" eyebrow="Next segments at risk">
      <div className="space-y-3">
        {changes.map((change) => (
          <div key={change.id} className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-950">
            <p className="font-semibold">{change.title}</p>
            <p className="mt-1 text-sm">{change.minutesUntilSegment} minutes until affected segment.</p>
            <p className="mt-2 text-sm">{change.recommendedAction}</p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
