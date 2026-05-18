import type { LiveRunOfShowSegment, RunOfShowVisibilityProfile } from "@/types/runOfShowLive";
import { formatEventDate } from "@/lib/utils/format";

export function NextCueStack({
  segments,
  visibility,
}: {
  segments: LiveRunOfShowSegment[];
  visibility: RunOfShowVisibilityProfile;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">Next cues</p>
      <div className="mt-4 space-y-3">
        {segments.map((segment, index) => (
          <div key={segment.id} className="rounded-2xl border border-slate-200 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Next {index + 1}</p>
            <p className="mt-1 font-semibold text-slate-950">{segment.publicTitle}</p>
            <p className="mt-1 text-sm text-slate-500">{formatEventDate(segment.startAt)} · {segment.room}</p>
            {visibility.canSeeTechnicalCues ? <p className="mt-2 text-sm text-slate-600">{segment.technicalCues}</p> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
