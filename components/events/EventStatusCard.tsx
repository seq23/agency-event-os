import { ReadinessScore } from "@/components/shared/ReadinessScore";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { EventPortfolioCard } from "@/services/events/eventPortfolioService";

export function EventStatusCard({ card }: { card: EventPortfolioCard }) {
  return (
    <a href={`/app/events/${card.id}`} className="block rounded-3xl border border-slate-200 bg-white p-5 shadow-sm hover:border-brand-orange">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-black text-slate-950">{card.name}</h3>
          <p className="text-sm text-slate-500">{card.client} · {new Date(card.startAt).toLocaleString()} · {card.timezone}</p>
        </div>
        <StatusBadge status={card.status} tone={card.status === "live" ? "good" : card.incidentCount > 0 ? "bad" : "neutral"} />
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <ReadinessScore score={card.readinessScore} label="Event readiness" />
        <ReadinessScore score={card.setupCompletion} label="Setup completion" />
      </div>
      <dl className="mt-4 grid gap-2 text-xs md:grid-cols-2">
        {["accessReadiness", "speakerReadiness", "sponsorReadiness", "assetReadiness", "runOfShowStatus", "videoHealth", "publishStatus", "lastSmokeResult", "reportingStatus", "fallbackRecommendation"].map((key) => (
          <div key={key} className="rounded-2xl bg-slate-50 p-3">
            <dt className="font-bold uppercase tracking-wide text-slate-400">{key.replace(/([A-Z])/g, " $1")}</dt>
            <dd className="mt-1 font-semibold text-slate-800">{String(card[key as keyof EventPortfolioCard])}</dd>
          </div>
        ))}
      </dl>
      {card.status === "live" ? (
        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
          <strong>Live now:</strong> {card.currentSegment} · Next: {card.nextSegment} · Open command center
        </div>
      ) : null}
    </a>
  );
}
