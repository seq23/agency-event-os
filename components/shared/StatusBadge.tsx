import { titleize } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

export function StatusBadge({ status, tone = "neutral" }: { status: string; tone?: "neutral" | "good" | "warn" | "bad" }) {
  const tones = {
    neutral: "border-slate-200 bg-slate-50 text-slate-700",
    good: "border-emerald-200 bg-emerald-50 text-emerald-700",
    warn: "border-amber-200 bg-amber-50 text-amber-700",
    bad: "border-rose-200 bg-rose-50 text-rose-700",
  };

  return (
    <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-xs font-medium", tones[tone])}>
      {titleize(status)}
    </span>
  );
}
