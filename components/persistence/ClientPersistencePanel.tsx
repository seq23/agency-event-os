import { SectionCard } from "@/components/shared/SectionCard";

export function ClientPersistencePanel({ agencyId }: { agencyId: string }) {
  return (
    <SectionCard title="Create client" eyebrow="Supabase persistence shell">
      <form className="grid gap-3 md:grid-cols-2" action="#">
        <input type="hidden" name="agencyId" value={agencyId} />
        <label className="text-sm font-medium text-slate-700">Client name<input className="mt-1 w-full rounded-xl border border-slate-200 p-2" name="name" placeholder="Nova Capital Partners" /></label>
        <label className="text-sm font-medium text-slate-700">Slug<input className="mt-1 w-full rounded-xl border border-slate-200 p-2" name="slug" placeholder="nova-capital" /></label>
        <label className="text-sm font-medium text-slate-700">Industry<input className="mt-1 w-full rounded-xl border border-slate-200 p-2" name="industry" placeholder="Venture Capital" /></label>
        <label className="text-sm font-medium text-slate-700">Primary contact email<input className="mt-1 w-full rounded-xl border border-slate-200 p-2" name="primaryContactEmail" placeholder="client@example.com" /></label>
        <p className="md:col-span-2 rounded-2xl bg-slate-50 p-3 text-sm text-slate-600">Batch 3B wires validation and server actions. Form submission is kept as a shell until route-level create/edit UX is approved.</p>
      </form>
    </SectionCard>
  );
}
