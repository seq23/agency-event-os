import type { ActivityFeedItem } from "@/types/preVenueHardening";

export function ActivityFeed({ items }: { items: ActivityFeedItem[] }) {
  return (
    <section className="rounded-3xl border border-brand-line bg-white p-4 shadow-sm sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Activity</p>
      <h2 className="mt-2 text-2xl font-semibold text-slate-950">Audit feed</h2>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-2xl bg-slate-50 p-4">
            <p className="font-semibold">{item.title}</p>
            {item.body ? <p className="mt-1 text-sm text-slate-600">{item.body}</p> : null}
            <p className="mt-2 text-xs uppercase tracking-wide text-slate-400">{item.visibility.replace(/_/g, " ")}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
