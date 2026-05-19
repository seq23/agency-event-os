import type { VirtualVenueSession } from "@/types/virtualVenue";

export function SessionCard({ session }: { session: VirtualVenueSession }) {
  return (
    <a href={session.roomHref} className="block rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{session.status}</p>
      <h3 className="mt-2 text-xl font-semibold text-slate-950">{session.title}</h3>
      {session.description ? <p className="mt-2 text-sm text-slate-600">{session.description}</p> : null}
      <p className="mt-3 text-sm text-slate-500">{session.speakerNames.join(", ") || "Speaker details pending"}</p>
    </a>
  );
}
