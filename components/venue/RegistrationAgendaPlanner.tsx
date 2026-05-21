import type { VirtualVenueBreakout, VirtualVenueBooth, VirtualVenueSession } from "@/types/virtualVenue";

export function RegistrationAgendaPlanner({ sessions, breakouts, booths }: { sessions: VirtualVenueSession[]; breakouts: VirtualVenueBreakout[]; booths: VirtualVenueBooth[] }) {
  const visibleSessions = sessions.slice(0, 8);
  const visibleBreakouts = breakouts.slice(0, 6);
  const visibleBooths = booths.slice(0, 6);
  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4" data-testid="registration-agenda-planner">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-black text-slate-950">Optional agenda planner</h2>
          <p className="mt-1 text-sm text-slate-600">Pick sessions, breakouts, or sponsor booths you may attend. This is skippable and editable later. Planning something here never grants VIP or restricted access.</p>
        </div>
        <label className="flex items-center gap-2 text-xs font-bold text-slate-600"><input type="checkbox" name="wantsSessionReminders" /> Reminders</label>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">Sessions</p>
          <div className="mt-2 space-y-2">
            {visibleSessions.map((session) => <label key={session.id} className="flex gap-2 rounded-xl bg-white p-3 text-sm"><input type="checkbox" name="plannedSessionIds" value={session.id} /><span>{session.title}</span></label>)}
          </div>
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">Breakouts</p>
          <div className="mt-2 space-y-2">
            {visibleBreakouts.map((breakout) => <label key={breakout.id} className="flex gap-2 rounded-xl bg-white p-3 text-sm"><input type="checkbox" name="plannedBreakoutIds" value={breakout.id} /><span>{breakout.title}</span></label>)}
          </div>
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">Sponsor booths</p>
          <div className="mt-2 space-y-2">
            {visibleBooths.map((booth) => <label key={booth.id} className="flex gap-2 rounded-xl bg-white p-3 text-sm"><input type="checkbox" name="plannedSponsorBoothIds" value={booth.id} /><span>{booth.name}</span></label>)}
          </div>
        </div>
      </div>
    </section>
  );
}
