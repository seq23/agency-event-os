import type { ReactNode } from "react";
import { ManageEventTabs } from "@/components/events/ManageEventTabs";
import { SetupProgressRail } from "@/components/events/setup/SetupProgressRail";
import { getSetupCompletion, type SetupSectionKey } from "@/services/events/eventSetupCompletionService";
import { getEventConfigPackage } from "@/services/events/eventConfigRepository";

export function EventSetupShell({ eventId, active, title, eyebrow, children }: { eventId: string; active: SetupSectionKey; title: string; eyebrow: string; children?: ReactNode }) {
  const completion = getSetupCompletion(eventId);
  const config = getEventConfigPackage(eventId);
  const activeSection = completion.sections.find((section) => section.key === active);
  return (
    <div className="space-y-6">
      <ManageEventTabs eventId={eventId} />
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-brand-orange">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">{title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          {config.event.name} · {completion.completeCount}/{completion.totalCount} setup sections complete · readiness {completion.score}%.
        </p>
        {activeSection && activeSection.blockers.length > 0 ? (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <strong>Blockers:</strong>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {activeSection.blockers.map((blocker) => <li key={blocker}>{blocker}</li>)}
            </ul>
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">This section satisfies the current v6 completion contract.</div>
        )}
      </section>
      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <SetupProgressRail sections={completion.sections} />
        <main>{children}</main>
      </div>
    </div>
  );
}
