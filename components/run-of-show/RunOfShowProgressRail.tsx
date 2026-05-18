import type { RunOfShowProgressSnapshot } from "@/types/runOfShowLive";

const statusClass = {
  completed: "bg-emerald-500",
  current: "bg-slate-950",
  delayed: "bg-amber-500",
  scheduled: "bg-slate-300",
  skipped: "bg-slate-400",
  extended: "bg-blue-500",
  shortened: "bg-blue-400",
  moved: "bg-purple-500",
  blocked: "bg-rose-500",
  cancelled: "bg-slate-500",
};

export function RunOfShowProgressRail({ snapshot }: { snapshot: RunOfShowProgressSnapshot }) {
  const segments = [
    ...(snapshot.previousSegment ? [snapshot.previousSegment] : []),
    ...(snapshot.currentSegment ? [snapshot.currentSegment] : []),
    ...snapshot.upcomingSegments,
  ];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">Run of Show progress</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-950">
            {snapshot.completedCount}/{snapshot.totalCount} segments complete · {snapshot.progressPercent}%
          </h2>
        </div>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-700">
          {snapshot.onTimeStatus.replace(/_/g, " ")}
        </span>
      </div>

      <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-slate-950" style={{ width: `${snapshot.progressPercent}%` }} />
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {segments.map((segment) => (
          <div key={segment.id} className="rounded-2xl border border-slate-200 p-3">
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${statusClass[segment.liveStatus]}`} />
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{segment.liveStatus}</span>
            </div>
            <p className="mt-2 line-clamp-2 font-semibold text-slate-950">{segment.publicTitle}</p>
            <p className="mt-1 text-xs text-slate-500">{segment.room} · {segment.durationMinutes} min</p>
          </div>
        ))}
      </div>

      {snapshot.producerWarning ? (
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          {snapshot.producerWarning}
        </div>
      ) : null}
    </div>
  );
}
