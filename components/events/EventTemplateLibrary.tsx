import { getRuntimeData } from "@/lib/runtime/getRuntimeData";
import { SectionCard } from "@/components/shared/SectionCard";
import { titleize } from "@/lib/utils/format";

export function EventTemplateLibrary() {
  const data = getRuntimeData();

  return (
    <SectionCard title="Event templates" eyebrow="Reusable systems">
      <div className="grid gap-4 md:grid-cols-3">
        {data.eventTemplates.map((template) => (
          <div key={template.id} className="rounded-2xl border border-slate-200 p-4">
            <p className="font-semibold text-slate-950">{template.name}</p>
            <p className="mt-1 text-sm text-slate-500">{titleize(template.eventType)} · {template.defaultDurationMinutes} min</p>
            <p className="mt-3 text-sm text-slate-600">{template.description}</p>
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Default rooms</p>
              <p className="mt-1 text-sm text-slate-600">{template.defaultRooms.join(", ")}</p>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
