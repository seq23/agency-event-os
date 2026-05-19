export function HelpRequestForm({ eventId, topics }: { eventId: string; topics: string[] }) {
  return (
    <form className="rounded-3xl bg-white p-6 shadow-sm">
      <input type="hidden" name="eventId" value={eventId} />
      <h3 className="text-xl font-semibold">Ask for help</h3>
      <div className="mt-4 grid gap-3">
        <select className="rounded-xl border border-slate-200 p-3" name="topic" defaultValue={topics[0]}>
          {topics.map((topic) => <option key={topic} value={topic}>{topic}</option>)}
        </select>
        <input className="rounded-xl border border-slate-200 p-3" name="subject" aria-label="Subject" />
        <textarea className="rounded-xl border border-slate-200 p-3" name="message" aria-label="Message" />
        <button className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white" type="submit">Send help request</button>
      </div>
    </form>
  );
}
