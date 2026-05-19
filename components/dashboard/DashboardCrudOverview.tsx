import type { DashboardCrudCard } from "@/types/preVenueHardening";

export function DashboardCrudOverview({ cards }: { cards: DashboardCrudCard[] }) {
  return (
    <section className="rounded-3xl border border-brand-line bg-white p-4 shadow-sm sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Operations</p>
      <h2 className="mt-2 text-2xl font-semibold text-slate-950">Management surfaces</h2>
      <div className="mt-5 grid gap-3 md:grid-cols-5">
        {cards.map((card) => (
          <a key={card.surface} href={card.href} className="rounded-2xl bg-slate-50 p-4 transition hover:bg-slate-100">
            <p className="text-sm font-semibold text-slate-950">{card.label}</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">{card.status.replace(/_/g, " ")}</p>
            <p className="mt-2 text-sm text-slate-600">{card.summary}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
