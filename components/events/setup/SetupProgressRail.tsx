import type { SetupSectionStatus } from "@/services/events/eventSetupCompletionService";

export function SetupProgressRail({ sections }: { sections: SetupSectionStatus[] }) {
  return (
    <aside className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.25em] text-brand-orange">Setup path</p>
      <div className="mt-4 space-y-2">
        {sections.map((section, index) => (
          <a key={section.key} href={section.href} className="block rounded-2xl border border-slate-200 p-3 hover:border-brand-orange">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-bold text-slate-950">{index + 1}. {section.label}</span>
              <span className={section.complete ? "rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700" : "rounded-full bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700"}>
                {section.complete ? "Complete" : "Needs work"}
              </span>
            </div>
            <p className="mt-1 text-xs leading-5 text-slate-500">{section.description}</p>
          </a>
        ))}
      </div>
    </aside>
  );
}
