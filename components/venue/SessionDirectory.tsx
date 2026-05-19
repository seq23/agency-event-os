import type { VirtualVenueSession } from "@/types/virtualVenue";
import { groupSessionsByStatus } from "@/services/venue";
import { SessionCard } from "./SessionCard";

export function SessionDirectory({ sessions }: { sessions: VirtualVenueSession[] }) {
  const grouped = groupSessionsByStatus(sessions);

  return (
    <div className="space-y-6">
      {([
        ["Live", grouped.live],
        ["Upcoming", grouped.upcoming],
        ["Completed", grouped.completed],
      ] as const).map(([label, rows]) => (
        <section key={label}>
          <h2 className="mb-3 text-xl font-semibold">{label}</h2>
          <div className="grid gap-3 md:grid-cols-2">{rows.map((session) => <SessionCard key={session.id} session={session} />)}</div>
        </section>
      ))}
    </div>
  );
}
