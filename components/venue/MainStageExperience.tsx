import type { VirtualVenueModel } from "@/types/virtualVenue";
import { LiveKitVideoSurface } from "./LiveKitVideoSurface";
import { SessionCard } from "./SessionCard";

export function MainStageExperience({ model }: { model: VirtualVenueModel }) {
  const current = model.liveNow[0] ?? model.sessions[0];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
      <section className="rounded-3xl bg-white p-5 shadow-sm">
        <LiveKitVideoSurface label="Main Stage" />
        <div className="mt-5">
          <h2 className="text-2xl font-semibold">{current?.title ?? "Main stage"}</h2>
          <p className="mt-2 text-slate-600">{current?.description ?? "The primary broadcast room is ready."}</p>
        </div>
      </section>
      <aside className="space-y-3">
        <h3 className="text-lg font-semibold">Schedule context</h3>
        {model.upNext.slice(0, 3).map((session) => <SessionCard key={session.id} session={session} />)}
      </aside>
    </div>
  );
}
