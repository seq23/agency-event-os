import { getSponsorReadyRoomSnapshot } from "@/services/sponsor-ops";
import { SponsorPackageOverview } from "./SponsorPackageOverview";

export function SponsorReadyRoom({ eventId, sponsorId = "sponsor-clarity" }: { eventId: string; sponsorId?: string }) {
  const snapshot = getSponsorReadyRoomSnapshot(eventId, sponsorId);

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl bg-slate-950 p-6 text-white">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Sponsor ready room</p>
          <h1 className="mt-2 text-3xl font-semibold">{snapshot.sponsorName}</h1>
          <p className="mt-2 text-slate-300">Prepare booth reps, CTA, lead routing, and sponsor session timing.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl bg-white p-4 shadow-sm"><p className="text-sm text-slate-500">Booth</p><p className="font-semibold">{snapshot.boothStatus}</p></div>
          <div className="rounded-2xl bg-white p-4 shadow-sm"><p className="text-sm text-slate-500">Reps</p><p className="font-semibold">{snapshot.representativeStatus}</p></div>
          <div className="rounded-2xl bg-white p-4 shadow-sm"><p className="text-sm text-slate-500">CTA test</p><p className="font-semibold">{snapshot.ctaTestStatus}</p></div>
          <div className="rounded-2xl bg-white p-4 shadow-sm"><p className="text-sm text-slate-500">Lead routing</p><p className="font-semibold">{snapshot.leadRoutingTestStatus}</p></div>
        </div>

        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-amber-950">
          <p className="font-semibold">Producer message</p>
          <p className="mt-1 text-sm">{snapshot.producerMessage}</p>
        </div>

        <SponsorPackageOverview eventId={eventId} sponsorId={sponsorId} />
      </div>
    </main>
  );
}
