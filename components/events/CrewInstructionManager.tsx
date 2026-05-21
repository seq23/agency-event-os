import { CrewBriefingPanel } from "@/components/crew/CrewInstructionShell";
import { crewBriefing, crewTasks } from "@/lib/crew/crewBriefing";

export function CrewInstructionManager({ eventId }: { eventId: string }) {
  return (
    <main className="min-h-screen bg-brand-ash px-5 py-8 text-brand-black sm:px-8">
      <section className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-[2rem] border border-brand-line bg-white p-6 shadow-brand sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-brand-orange">Operator · Crew Briefing & Instructions</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight">Publish crew instructions for show day.</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-brand-muted">
            This is the operator-owned instruction manager. Crew gets the briefing, call sheet, run of show, task list,
            fallback rules, and escalation path through crew-scoped routes. Crew does not need the Operator Launchpad.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a className="rounded-full bg-brand-black px-5 py-3 text-sm font-bold text-white" href={`/crew/events/${eventId}`}>Preview Crew Home</a>
            <a className="rounded-full border border-brand-black px-5 py-3 text-sm font-bold" href={`/crew/events/${eventId}/call-sheet`}>Preview Call Sheet</a>
            <a className="rounded-full border border-brand-black px-5 py-3 text-sm font-bold" href={`/crew/events/${eventId}/run-of-show`}>Preview Run of Show</a>
            <a className="rounded-full border border-brand-black px-5 py-3 text-sm font-bold" href={`/crew/events/${eventId}/tasks`}>Preview Tasks</a>
          </div>
        </div>

        <CrewBriefingPanel />

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black tracking-tight">Crew task package</h2>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-brand-muted">
            {crewTasks.map((task) => <li key={task}>• {task}</li>)}
          </ul>
          <p className="mt-5 text-sm text-brand-muted">Escalation contact published to crew: {crewBriefing.escalationEmail}</p>
        </section>
      </section>
    </main>
  );
}
