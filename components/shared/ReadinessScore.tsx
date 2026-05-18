export function ReadinessScore({ score, label = "Readiness" }: { score: number; label?: string }) {
  const status = score >= 85 ? "Ready" : score >= 65 ? "Needs Attention" : score >= 40 ? "At Risk" : "Blocked";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="text-2xl font-semibold text-slate-950">{score}%</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-slate-800">{status}</p>
          <div className="mt-2 h-2 w-28 rounded-full bg-slate-100">
            <div className="h-2 rounded-full bg-slate-900" style={{ width: `${Math.max(4, Math.min(score, 100))}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
