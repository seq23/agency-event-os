export function DiagnosticHistoryPanel({
  resultCount,
  failureCount,
  incidentRequired,
}: {
  resultCount: number;
  failureCount: number;
  incidentRequired: boolean;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Diagnostics</p>
      <h2 className="mt-2 text-2xl font-semibold text-slate-950">Saved diagnostic state</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-4"><p className="text-2xl font-semibold">{resultCount}</p><p className="text-sm text-slate-600">Results</p></div>
        <div className="rounded-2xl bg-slate-50 p-4"><p className="text-2xl font-semibold">{failureCount}</p><p className="text-sm text-slate-600">Failures</p></div>
        <div className="rounded-2xl bg-slate-50 p-4"><p className="text-2xl font-semibold">{incidentRequired ? "Yes" : "No"}</p><p className="text-sm text-slate-600">Incident required</p></div>
      </div>
    </section>
  );
}
