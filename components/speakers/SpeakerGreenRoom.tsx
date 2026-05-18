import { getSpeakerGreenRoomSnapshot } from "@/services/speaker-ops";
import { getRunOfShowProgressSnapshot } from "@/services/run-of-show";
import { SectionCard } from "@/components/shared/SectionCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { SpeakerLastMinuteChangeRequest } from "./SpeakerLastMinuteChangeRequest";
import { TeleprompterVersionPanel } from "./TeleprompterVersionPanel";

export function SpeakerGreenRoom({ eventId, speakerId = "speaker-drake" }: { eventId: string; speakerId?: string }) {
  const snapshot = getSpeakerGreenRoomSnapshot(eventId, speakerId);
  const ros = getRunOfShowProgressSnapshot(eventId);

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl bg-slate-950 p-6 text-white shadow-sm">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Speaker green room</p>
          <h1 className="mt-2 text-3xl font-semibold">{snapshot.speakerName}</h1>
          <p className="mt-2 text-slate-300">Your private prep room for call time, backstage, script, assets, and producer messages.</p>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Minutes until live</p>
              <p className="text-2xl font-semibold">{snapshot.minutesUntilLive}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Status</p>
              <p className="text-2xl font-semibold">{snapshot.status.replace(/_/g, " ")}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Current show segment</p>
              <p className="text-lg font-semibold">{ros.currentSegment?.publicTitle ?? "Not started"}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <SectionCard title="Your readiness checklist">
            <div className="space-y-3">
              {snapshot.readiness.checklist.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
                  <div>
                    <p className="font-semibold">{item.label}</p>
                    <p className="text-sm text-slate-500">{item.blocking ? "Blocks live readiness" : "Recommended"}</p>
                  </div>
                  <StatusBadge status={item.status} tone={["approved", "complete"].includes(item.status) ? "good" : "warn"} />
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Join links">
            <div className="space-y-3">
              <a className="block rounded-2xl bg-slate-950 p-4 font-semibold text-white" href={snapshot.readiness.backstageJoinUrl}>Join backstage</a>
              <a className="block rounded-2xl bg-slate-100 p-4 font-semibold text-slate-950" href={snapshot.readiness.rehearsalJoinUrl}>Join rehearsal</a>
              <p className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-600">{snapshot.readiness.producerMessage}</p>
            </div>
          </SectionCard>
        </div>

        <TeleprompterVersionPanel approved={snapshot.approvedScriptVersion} pending={snapshot.pendingScriptVersion} />
        <SpeakerLastMinuteChangeRequest />
      </div>
    </main>
  );
}
