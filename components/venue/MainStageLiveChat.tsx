import type { VirtualVenueModel } from "@/types/virtualVenue";

const seededMessages = [
  { id: "chat-1", name: "Maya", company: "Northstar Labs", body: "Excited for the main stage — especially the operating cadence session.", time: "Just now" },
  { id: "chat-2", name: "Jordan", company: "Signal Ventures", body: "Drop your role and what you're hoping to learn. I’m here for better networking design.", time: "2 min ago" },
  { id: "chat-3", name: "Priya", company: "Clarity Health", body: "The agenda strip is helpful — I always lose track of what’s next.", time: "5 min ago" },
];

export function MainStageLiveChat({ model }: { model: VirtualVenueModel }) {
  return (
    <aside className="flex h-full min-h-[34rem] flex-col rounded-3xl border border-slate-200 bg-white shadow-sm" aria-label="Main stage live chat">
      <div className="border-b border-slate-100 p-5">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-brand-orange">Live chat</p>
        <h2 className="mt-2 text-xl font-black text-slate-950">Everyone can talk here</h2>
        <p className="mt-2 text-sm text-slate-600">Conference-wide main stage chat for attendees watching {model.eventName}.</p>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto p-5">
        {seededMessages.map((message) => (
          <article key={message.id} className="rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-black text-slate-950">{message.name}</p>
              <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{message.time}</span>
            </div>
            <p className="text-xs text-slate-500">{message.company}</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">{message.body}</p>
          </article>
        ))}
      </div>
      <form className="border-t border-slate-100 p-4">
        <label htmlFor="stage-chat-message" className="sr-only">Send a live chat message</label>
        <div className="flex gap-2">
          <input id="stage-chat-message" name="message" placeholder="Message everyone…" className="min-h-11 flex-1 rounded-full border border-slate-200 px-4 text-sm outline-none focus:border-brand-orange" />
          <button type="button" className="rounded-full bg-slate-950 px-4 text-sm font-black text-white">Send</button>
        </div>
        <p className="mt-2 text-xs text-slate-500">Runtime chat persistence degrades safely; this panel must never crash the stage.</p>
      </form>
    </aside>
  );
}
