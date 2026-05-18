export function MetricCard({ label, value, note }: { label: string; value: string | number; note?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
      {note ? <p className="mt-1 text-xs text-slate-500">{note}</p> : null}
    </div>
  );
}
