export function EventConfigPanel() {
  const items = ['data/events/events.json', 'data/events/demo/*', 'data/access/event-access-config.json'];
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="font-black text-slate-950">Event Config</h2>
      <ul className="mt-3 space-y-2 text-sm text-slate-600">
        {items.map((item) => <li key={item} className="rounded-2xl bg-slate-50 p-3">{item}</li>)}
      </ul>
    </section>
  );
}
