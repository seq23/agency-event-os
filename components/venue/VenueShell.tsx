import type { ReactNode } from "react";
import { getEvent } from "@/lib/mock/getMockData";

const venueNav = [
  ["Lobby", "lobby"],
  ["Stage", "stage"],
  ["Sessions", "sessions"],
  ["Networking", "networking"],
  ["Expo", "expo"],
  ["People", "people"],
  ["Replay", "replay"],
  ["Help", "help"],
];

export function VenueShell({ eventId, children }: { eventId: string; children: ReactNode }) {
  const event = getEvent(eventId);

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Attendee venue</p>
            <h1 className="text-2xl font-semibold text-slate-950">{event.name}</h1>
          </div>
          <nav className="flex flex-wrap gap-2">
            {venueNav.map(([label, key]) => (
              <a key={key} href={`/venue/${event.id}/${key}`} className="rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50">
                {label}
              </a>
            ))}
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-7xl p-6">{children}</div>
    </main>
  );
}
