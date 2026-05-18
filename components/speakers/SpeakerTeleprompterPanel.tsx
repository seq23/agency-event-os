import { getSpeakerGreenRoomSnapshot } from "@/services/speaker-ops";
import { TeleprompterVersionPanel } from "./TeleprompterVersionPanel";

export function SpeakerTeleprompterPanel({ eventId, speakerId = "speaker-drake" }: { eventId: string; speakerId?: string }) {
  const snapshot = getSpeakerGreenRoomSnapshot(eventId, speakerId);
  const script = snapshot.approvedScriptVersion;

  return (
    <div className="space-y-6">
      <TeleprompterVersionPanel approved={snapshot.approvedScriptVersion} pending={snapshot.pendingScriptVersion} />

      <div className="rounded-3xl bg-slate-950 p-6 text-white shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Teleprompter</p>
            <h1 className="mt-2 text-3xl font-semibold">{script?.title ?? "No approved script"}</h1>
            <p className="mt-2 text-slate-300">Read from the approved live version. Pending drafts do not appear here until producer-approved.</p>
          </div>
          <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm">
            Font: Large · Speed: Medium · Mode: Dark
          </div>
        </div>
        <div className="mt-8 rounded-3xl bg-black p-8 text-3xl leading-relaxed text-white">
          {script?.scriptText ?? "No approved script has been locked for this segment."}
        </div>
      </div>
    </div>
  );
}
