import { getEventPortfolioCards } from "@/services/events/eventPortfolioService";

export async function EventReadinessSummary() {
  const cards = await getEventPortfolioCards();
  const live = cards.filter((card) => card.status === "live").length;
  const needsReview = cards.filter((card) => card.setupCompletion >= 90 && card.status === "draft").length;
  const avg = cards.length ? Math.round(cards.reduce((sum, card) => sum + card.readinessScore, 0) / cards.length) : 0;
  return (
    <section className="grid gap-4 md:grid-cols-3">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs font-bold uppercase text-slate-400">Live now</p><p className="mt-2 text-3xl font-black text-slate-950">{live}</p></div>
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs font-bold uppercase text-slate-400">Needs review</p><p className="mt-2 text-3xl font-black text-slate-950">{needsReview}</p></div>
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs font-bold uppercase text-slate-400">Average readiness</p><p className="mt-2 text-3xl font-black text-slate-950">{avg}%</p></div>
    </section>
  );
}
