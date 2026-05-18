import type { RunOfShowControlAction } from "@/types/runOfShowLive";

const actions: Array<{ action: RunOfShowControlAction; label: string; danger?: boolean }> = [
  { action: "mark_live", label: "Mark live" },
  { action: "mark_complete", label: "Mark complete" },
  { action: "delay_segment", label: "Delay" },
  { action: "skip_segment", label: "Skip" },
  { action: "extend_segment", label: "Extend" },
  { action: "shorten_segment", label: "Shorten" },
  { action: "move_next", label: "Move next" },
  { action: "add_emergency_note", label: "Emergency note", danger: true },
  { action: "trigger_incident", label: "Trigger incident", danger: true },
  { action: "notify_team", label: "Notify team" },
];

export function LiveRunOfShowControls() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">Live controls shell</p>
      <p className="mt-1 text-sm text-slate-600">
        Controls are intentionally non-persistent until Supabase/Audit integration is wired. These define the production control surface.
      </p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {actions.map((item) => (
          <button
            key={item.action}
            className={`rounded-xl px-3 py-2 text-sm font-semibold ${
              item.danger ? "bg-rose-50 text-rose-700" : "bg-slate-950 text-white"
            }`}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
