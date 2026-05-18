import { SectionCard } from "@/components/shared/SectionCard";

export function EventPersistencePanel({ agencyId, clientId }: { agencyId: string; clientId: string }) {
  return (
    <SectionCard title="Create event" eyebrow="Supabase persistence shell">
      <form className="grid gap-3 md:grid-cols-2" action="#">
        <input type="hidden" name="agencyId" value={agencyId} />
        <input type="hidden" name="clientId" value={clientId} />
        <label className="text-sm font-medium text-slate-700">Event name<input className="mt-1 w-full rounded-xl border border-slate-200 p-2" name="name" placeholder="Nova Founder Summit" /></label>
        <label className="text-sm font-medium text-slate-700">Slug<input className="mt-1 w-full rounded-xl border border-slate-200 p-2" name="slug" placeholder="nova-founder-summit" /></label>
        <label className="text-sm font-medium text-slate-700">Type<input className="mt-1 w-full rounded-xl border border-slate-200 p-2" name="eventType" placeholder="virtual_summit" /></label>
        <label className="text-sm font-medium text-slate-700">Start<input className="mt-1 w-full rounded-xl border border-slate-200 p-2" name="startAt" placeholder="2026-06-12T15:00:00.000Z" /></label>
        <p className="md:col-span-2 rounded-2xl bg-slate-50 p-3 text-sm text-slate-600">Batch 3B defines persistence-safe create/update payloads before replacing all mock UI state.</p>
      </form>
    </SectionCard>
  );
}
