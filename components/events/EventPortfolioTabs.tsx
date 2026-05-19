import { EventStatusCard } from "@/components/events/EventStatusCard";
import { groupEventPortfolioCards } from "@/services/events/eventPortfolioService";

export async function EventPortfolioTabs() {
  const groups = await groupEventPortfolioCards();
  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <section key={group.tab} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-black text-slate-950">{group.tab}</h2>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{group.cards.length}</span>
          </div>
          {group.cards.length === 0 ? (
            <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">No events in this lane. Create your first event or duplicate the demo event.</p>
          ) : (
            <div className="mt-4 grid gap-4 xl:grid-cols-2">
              {group.cards.map((card) => <EventStatusCard key={`${group.tab}-${card.id}`} card={card} />)}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
