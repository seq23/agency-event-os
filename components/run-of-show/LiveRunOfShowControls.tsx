import { recordRunOfShowControlAction } from "@/lib/actions/runOfShowActions";

const actions = ["Mark ready", "Mark live", "Mark complete", "Delay", "Skip", "Extend", "Emergency note", "Trigger incident", "Notify team"];

export function LiveRunOfShowControls({ eventId, segmentId = "current-segment" }: { eventId: string; segmentId?: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">Live controls shell</p>
      <p className="mt-2 text-xs text-slate-500">These controls write real local/runtime run-of-show events so producers can verify show-control state before deploy.</p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {actions.map((action) => (
          <form action={recordRunOfShowControlAction} key={action}>
            <input type="hidden" name="eventId" value={eventId} />
            <input type="hidden" name="segmentId" value={segmentId} />
            <input type="hidden" name="actorRole" value="producer" />
            <input type="hidden" name="label" value={action} />
            <button className="w-full rounded-xl bg-slate-950 px-3 py-2 text-sm font-semibold text-white" type="submit">{action}</button>
          </form>
        ))}
      </div>
    </div>
  );
}
