import type { VirtualVenueReplay } from "@/types/virtualVenue";
import { ReplayCard } from "./ReplayCard";

export function ReplayCenter({ replays }: { replays: VirtualVenueReplay[] }) {
  return (
    <section>
      <h2 className="mb-4 text-2xl font-semibold">Replay center</h2>
      <div className="grid gap-4 md:grid-cols-3">{replays.map((replay) => <ReplayCard key={replay.id} replay={replay} />)}</div>
    </section>
  );
}
