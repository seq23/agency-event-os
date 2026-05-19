import { createClientFromFormSubmitAction } from "@/lib/actions/clientEventActions";
import { SectionCard } from "@/components/shared/SectionCard";

export function ClientPersistencePanel({ agencyId }: { agencyId: string }) {
  return (
    <SectionCard title="Create client" eyebrow="Supabase persistence">
      <form className="grid gap-3 md:grid-cols-2" action={createClientFromFormSubmitAction}>
        <input type="hidden" name="agencyId" value={agencyId} />
        <input type="hidden" name="status" value="active" />
        <label className="text-sm font-medium text-slate-700">
          Client name
          <input className="mt-1 w-full rounded-xl border border-slate-200 p-2" name="name" required aria-label="Client name" />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Slug
          <input className="mt-1 w-full rounded-xl border border-slate-200 p-2" name="slug" required aria-label="Client slug" />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Industry
          <input className="mt-1 w-full rounded-xl border border-slate-200 p-2" name="industry" aria-label="Industry" />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Primary contact email
          <input className="mt-1 w-full rounded-xl border border-slate-200 p-2" name="primaryContactEmail" type="email" aria-label="Primary contact email" />
        </label>
        <button className="md:col-span-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white" type="submit">
          Create client
        </button>
      </form>
    </SectionCard>
  );
}
