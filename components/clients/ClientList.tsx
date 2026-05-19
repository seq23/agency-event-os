import { getRuntimeData } from "@/lib/runtime/getRuntimeData";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { SectionCard } from "@/components/shared/SectionCard";
import { ClientPersistencePanel } from "@/components/persistence/ClientPersistencePanel";

export function ClientList() {
  const data = getRuntimeData();

  return (
    <div className="space-y-6">
    <ClientPersistencePanel agencyId={data.agencies[0]?.id ?? "00000000-0000-0000-0000-000000000001"} />
    <SectionCard title="Clients" eyebrow="Agency portfolio">
      <div className="grid gap-4 md:grid-cols-3">
        {data.clients.map((client) => {
          const events = data.events.filter((event) => event.clientId === client.id);
          const approvals = data.approvals.filter((approval) => approval.clientId === client.id && !["approved", "locked"].includes(approval.status));
          return (
            <a key={client.id} href={`/app/clients/${client.id}`} className="rounded-2xl border border-slate-200 p-4 hover:bg-slate-50">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold text-slate-950">{client.name}</h3>
                <StatusBadge status={client.status} />
              </div>
              <p className="mt-1 text-sm text-slate-500">{client.industry}</p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-xl bg-slate-50 p-3"><strong>{events.length}</strong><br />events</div>
                <div className="rounded-xl bg-slate-50 p-3"><strong>{approvals.length}</strong><br />approvals</div>
              </div>
              <p className="mt-3 text-xs text-slate-500">{client.primaryContactName} · {client.primaryContactEmail}</p>
            </a>
          );
        })}
      </div>
    </SectionCard>
    </div>
  );
}
