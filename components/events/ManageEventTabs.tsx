const links = [
  ["Command", ""],
  ["Overview", "overview"],
  ["Setup", "setup"],
  ["Branding", "branding"],
  ["Attendee Flow", "attendee-flow"],
  ["Venue", "venue"],
  ["Agenda", "agenda"],
  ["Speakers", "speakers"],
  ["Sponsors", "sponsors"],
  ["Access", "access"],
  ["Run of Show", "run-of-show"],
  ["Communications", "communications"],
  ["Video Health", "video-health"],
  ["Preview", "preview"],
  ["Publish", "publish"],
  ["Incidents", "incidents"],
  ["Analytics", "analytics"],
  ["Reports", "report"],
];

export function ManageEventTabs({ eventId }: { eventId: string }) {
  return (
    <nav className="flex flex-wrap gap-2 rounded-3xl border border-slate-200 bg-white p-3 shadow-sm" aria-label="Event command navigation">
      {links.map(([label, path]) => {
        const href = path ? `/app/events/${eventId}/${path}` : `/app/events/${eventId}`;
        return (
          <a key={label} href={href} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:border-brand-orange hover:text-brand-orange">
            {label}
          </a>
        );
      })}
    </nav>
  );
}
