import type { LiveRunOfShowSegment, RunOfShowVisibilityProfile } from "@/types/runOfShowLive";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatEventDate } from "@/lib/utils/format";

export function CurrentSegmentCard({
  segment,
  visibility,
}: {
  segment?: LiveRunOfShowSegment;
  visibility: RunOfShowVisibilityProfile;
}) {
  if (!segment) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="font-semibold">No active segment</p>
        <p className="mt-1 text-sm text-slate-500">The run of show has not started.</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">Current live segment</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-950">{segment.publicTitle}</h2>
          <p className="mt-2 text-sm text-slate-500">
            {formatEventDate(segment.startAt)} · {segment.durationMinutes} min · {segment.room}
          </p>
        </div>
        <StatusBadge status={segment.liveStatus} tone={segment.liveStatus === "current" ? "good" : "neutral"} />
      </div>

      <p className="mt-4 text-slate-600">{segment.clientFacingDescription}</p>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {visibility.canSeeInternalNotes ? (
          <div className="rounded-2xl bg-slate-50 p-3 text-sm">
            <p className="font-semibold text-slate-950">Producer notes</p>
            <p className="mt-1 text-slate-600">{segment.producerNotes}</p>
          </div>
        ) : null}

        {visibility.canSeeTechnicalCues ? (
          <div className="rounded-2xl bg-slate-50 p-3 text-sm">
            <p className="font-semibold text-slate-950">Technical cues</p>
            <p className="mt-1 text-slate-600">{segment.technicalCues}</p>
          </div>
        ) : null}

        {visibility.canSeeBackupPlan ? (
          <div className="rounded-2xl bg-slate-50 p-3 text-sm">
            <p className="font-semibold text-slate-950">Backup plan</p>
            <p className="mt-1 text-slate-600">{segment.backupPlan}</p>
          </div>
        ) : null}

        {visibility.canSeeEmergencyNotes && segment.emergencyNotes ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            <p className="font-semibold">Emergency note</p>
            <p className="mt-1">{segment.emergencyNotes}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
