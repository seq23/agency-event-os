import { getClient, getMockData } from "@/lib/mock/getMockData";
import { SectionCard } from "@/components/shared/SectionCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatEventDate } from "@/lib/utils/format";

export function ClientDetail({ clientId }: { clientId: string }) {
  const data = getMockData();
  const client = getClient(clientId);
  const events = data.events.filter((event) => event.clientId === client.id);
  const approvals = data.approvals.filter((approval) => approval.clientId === client.id);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Client workspace</p>
            <h1 className="mt-2 text-3xl font-semibold">{client.name}</h1>
            <p className="mt-1 text-slate-500">{client.industry} · {client.primaryContactName}</p>
          </div>
          <StatusBadge status={client.status} tone="good" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Client events">
          <div className="space-y-3">
            {events.map((event) => (
              <a key={event.id} href={`/app/events/${event.id}/overview`} className="block rounded-2xl border border-slate-200 p-4 hover:bg-slate-50">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{event.name}</p>
                    <p className="text-sm text-slate-500">{formatEventDate(event.startAt)}</p>
                  </div>
                  <StatusBadge status={event.status} />
                </div>
              </a>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Approvals">
          <div className="space-y-3">
            {approvals.map((approval) => (
              <div key={approval.id} className="rounded-2xl bg-slate-50 p-4">
                <p className="font-medium">{approval.title}</p>
                <p className="mt-1 text-sm text-slate-500">{approval.description}</p>
                <div className="mt-3"><StatusBadge status={approval.status} /></div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
