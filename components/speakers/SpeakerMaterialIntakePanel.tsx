import { intakeSpeakerMaterialAction } from "@/lib/actions/speakerMaterialActions";
import { listSpeakerMaterialSubmissions } from "@/services/speakers/speakerMaterialQueue";

export function SpeakerMaterialIntakePanel({ eventId }: { eventId: string }) {
  const submissions = listSpeakerMaterialSubmissions(eventId);
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm" data-testid="operator-speaker-material-intake">
      <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">Speaker material intake</p>
      <h2 className="mt-2 text-2xl font-semibold text-slate-950">Email, crew upload, and self-serve materials land here</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Speakers should use the teleprompter self-serve form when possible. If materials arrive by hello@ email, text, or crew handoff, operator/crew records them here so producer review has one queue.
      </p>
      <form action={intakeSpeakerMaterialAction} className="mt-5 grid gap-3" data-testid="operator-speaker-material-intake-form">
        <input type="hidden" name="eventId" value={eventId} />
        <label className="grid gap-1 text-sm font-semibold text-slate-700">
          Source
          <select name="source" className="rounded-xl border border-slate-300 px-3 py-2">
            <option value="crew_operator">Crew/operator upload or handoff</option>
            <option value="email_manual_intake">hello@ email/manual intake</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm font-semibold text-slate-700">
          Speaker name
          <input name="speakerName" className="rounded-xl border border-slate-300 px-3 py-2" defaultValue="Speaker" />
        </label>
        <label className="grid gap-1 text-sm font-semibold text-slate-700">
          Material type
          <select name="kind" className="rounded-xl border border-slate-300 px-3 py-2">
            <option value="teleprompter_note">Teleprompter note</option>
            <option value="deck">Deck link</option>
            <option value="supporting_document">Supporting document</option>
            <option value="speaker_email_intake">Email intake</option>
            <option value="crew_upload">Crew upload</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm font-semibold text-slate-700">
          Title
          <input name="title" className="rounded-xl border border-slate-300 px-3 py-2" placeholder="Speaker deck from hello@" />
        </label>
        <label className="grid gap-1 text-sm font-semibold text-slate-700">
          Notes
          <textarea name="notes" className="min-h-24 rounded-xl border border-slate-300 px-3 py-2" placeholder="Paste the email summary, crew handoff notes, or required producer action." />
        </label>
        <label className="grid gap-1 text-sm font-semibold text-slate-700">
          Link to file or email thread
          <input name="materialUrl" className="rounded-xl border border-slate-300 px-3 py-2" placeholder="Drive link, upload URL, or email thread reference" />
        </label>
        <button type="submit" className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white">Add to producer review queue</button>
      </form>
      <div className="mt-6 space-y-3" data-testid="operator-speaker-material-queue">
        {submissions.length ? submissions.map((item) => (
          <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold text-slate-950">{item.title}</p>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-800">Queued for producer review</span>
            </div>
            <p className="mt-2 text-sm text-slate-600">{item.notes}</p>
            <p className="mt-2 text-xs font-semibold text-slate-500">Source: {item.submittedBy.replaceAll("_", " ")}</p>
          </div>
        )) : <p className="rounded-2xl bg-slate-100 p-4 text-sm text-slate-600">No speaker materials are queued yet.</p>}
      </div>
    </section>
  );
}
