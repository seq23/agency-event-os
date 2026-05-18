import type { DiagnosticStatus } from "@/types/testing";

export function DiagnosticStatusBadge({ status }: { status: DiagnosticStatus }) {
  const classes: Record<DiagnosticStatus, string> = {
    pass: "border-emerald-200 bg-emerald-50 text-emerald-700",
    warn: "border-amber-200 bg-amber-50 text-amber-800",
    fail: "border-rose-200 bg-rose-50 text-rose-700",
    pending: "border-slate-200 bg-slate-50 text-slate-700",
    skipped: "border-slate-200 bg-white text-slate-500",
  };

  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${classes[status]}`}>{status.toUpperCase()}</span>;
}
