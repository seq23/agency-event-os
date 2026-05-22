import { submitSpeakerMaterialAction } from "@/lib/actions/speakerMaterialActions";
import { getSpeakerGreenRoomSnapshot } from "@/services/speaker-ops";
import { listSpeakerMaterialSubmissions } from "@/services/speakers/speakerMaterialQueue";
import { TeleprompterVersionPanel } from "./TeleprompterVersionPanel";

export function SpeakerTeleprompterPanel({ eventId, speakerId = "speaker-drake" }: { eventId: string; speakerId?: string }) {
  const snapshot = getSpeakerGreenRoomSnapshot(eventId, speakerId);
  const script = snapshot.approvedScriptVersion;
  const submissions = listSpeakerMaterialSubmissions(eventId).filter((item) => item.speakerId === speakerId);

  return (
    <div className="space-y-6">
      <TeleprompterVersionPanel approved={snapshot.approvedScriptVersion} pending={snapshot.pendingScriptVersion} />
      <div className="rounded-3xl bg-slate-950 p-6 text-white">
        <p className="text-sm uppercase tracking-wide text-slate-400">Teleprompter</p>
        <h1 className="mt-2 text-3xl font-semibold">{script?.title ?? "No approved script"}</h1>
        <div className="mt-8 rounded-3xl bg-black p-8 text-3xl leading-relaxed">{script?.scriptText ?? "No approved script has been locked."}</div>
      </div>

      <section className="rounded-3xl bg-white p-6 shadow-sm" data-testid="speaker-material-submission-panel">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">Speaker materials</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950">Send notes, deck links, or support docs to the producer queue</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Use this for last-minute teleprompter notes, updated deck links, and supporting documents. Submissions do not go live automatically; producer review is required before anything changes on stage.
        </p>
        <form action={submitSpeakerMaterialAction} className="mt-5 grid gap-3" data-testid="speaker-material-submission-form">
          <input type="hidden" name="eventId" value={eventId} />
          <input type="hidden" name="speakerId" value={speakerId} />
          <input type="hidden" name="speakerName" value={snapshot.speakerName} />
          <label className="grid gap-1 text-sm font-semibold text-slate-700">
            Material type
            <select name="kind" className="rounded-xl border border-slate-300 px-3 py-2">
              <option value="teleprompter_note">Teleprompter note</option>
              <option value="deck">Deck link</option>
              <option value="supporting_document">Supporting document</option>
            </select>
          </label>
          <label className="grid gap-1 text-sm font-semibold text-slate-700">
            Title
            <input name="title" className="rounded-xl border border-slate-300 px-3 py-2" placeholder="Updated keynote opener" />
          </label>
          <label className="grid gap-1 text-sm font-semibold text-slate-700">
            Notes for producer
            <textarea name="notes" className="min-h-28 rounded-xl border border-slate-300 px-3 py-2" placeholder="Tell the producer what changed and whether it affects timing, slides, sponsor mentions, or legal/client approval." />
          </label>
          <label className="grid gap-1 text-sm font-semibold text-slate-700">
            Link to deck or document
            <input name="materialUrl" className="rounded-xl border border-slate-300 px-3 py-2" placeholder="https://drive.google.com/..." />
          </label>
          <button type="submit" className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white">Queue for producer review</button>
        </form>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm" data-testid="speaker-material-review-queue">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">Producer review queue</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950">Queued speaker materials</h2>
        {submissions.length ? (
          <div className="mt-4 space-y-3">
            {submissions.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-slate-950">{item.title}</p>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-800">Queued for producer review</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{item.notes}</p>
                {item.materialUrl ? <p className="mt-2 text-xs font-semibold text-slate-500">Material link recorded for producer review.</p> : null}
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 rounded-2xl bg-slate-100 p-4 text-sm text-slate-600">No speaker materials are queued yet.</p>
        )}
      </section>
    </div>
  );
}
