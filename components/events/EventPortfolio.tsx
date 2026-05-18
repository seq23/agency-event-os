import { getMockData } from "@/lib/mock/getMockData";
import { calculateEventReadiness } from "@/lib/readiness/calculateEventReadiness";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ReadinessScore } from "@/components/shared/ReadinessScore";
import { SectionCard } from "@/components/shared/SectionCard";
import { formatEventDate, titleize } from "@/lib/utils/format";

export function EventPortfolio() {
  const data = getMockData();

  return (
    <SectionCard title="Events" eyebrow="Production portfolio">
      <div className="grid gap-4 lg:grid-cols-2">
        {data.events.map((event) => {
          const client = data.clients.find((item) => item.id === event.clientId);
          const readiness = calculateEventReadiness(data, event.id);
          return (
            <a key={event.id} href={`/app/events/${event.id}/overview`} className="rounded-2xl border border-slate-200 p-4 hover:bg-slate-50">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-slate-950">{event.name}</h3>
                  <p className="text-sm text-slate-500">{client?.name} · {titleize(event.eventType)}</p>
                  <p className="mt-1 text-sm text-slate-500">{formatEventDate(event.startAt)}</p>
                </div>
                <StatusBadge status={event.status} />
              </div>
              <div className="mt-4">
                <ReadinessScore score={readiness.overallScore} label="Event readiness" />
              </div>
            </a>
          );
        })}
      </div>
    </SectionCard>
  );
}
