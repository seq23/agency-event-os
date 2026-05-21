import { sendLiveRoomChatMessage } from "@/lib/actions/liveChatActions";
import { getCurrentAttendeeIdentity } from "@/services/attendees/attendeeSessionService";
import { listLiveRoomChatMessages } from "@/services/venue/liveChatService";
import type { LiveChatRoomKind } from "@/types/liveChat";

export async function LiveRoomChat({ eventId, roomKind, roomId, title, description }: { eventId: string; roomKind: LiveChatRoomKind; roomId: string; title: string; description: string }) {
  const [messages, identity] = await Promise.all([
    listLiveRoomChatMessages(eventId, roomKind, roomId).catch(() => []),
    getCurrentAttendeeIdentity(eventId).catch(() => undefined),
  ]);
  const visible = messages;
  return (
    <aside className="flex h-full min-h-[34rem] flex-col rounded-3xl border border-slate-200 bg-white shadow-sm" aria-label={`${title} live chat`} data-testid={`${roomKind}-live-chat`}>
      <div className="border-b border-slate-100 p-5"><p className="text-xs font-black uppercase tracking-[0.25em] text-brand-orange">Live chat</p><h2 className="mt-2 text-xl font-black text-slate-950">{title}</h2><p className="mt-2 text-sm text-slate-600">{description}</p></div>
      <div className="flex-1 space-y-3 overflow-y-auto p-5">
        {visible.length ? visible.map((message) => <article key={message.id} className="rounded-2xl bg-slate-50 p-4"><div className="flex items-center justify-between gap-3"><p className="text-sm font-black text-slate-950">{message.displayName}</p><span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{message.createdAt.includes("T") ? new Date(message.createdAt).toLocaleTimeString() : message.createdAt}</span></div><p className="text-xs text-slate-500">{message.company || "Registered attendee"}</p><p className="mt-2 text-sm leading-6 text-slate-700">{message.message}</p></article>) : <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">No messages yet. Start the room conversation.</div>}
      </div>
      {identity ? (
        <form action={sendLiveRoomChatMessage} className="border-t border-slate-100 p-4" data-testid="attendee-identity-chat-form">
          <input type="hidden" name="eventId" value={eventId} /><input type="hidden" name="roomKind" value={roomKind} /><input type="hidden" name="roomId" value={roomId} />
          <p className="mb-2 text-xs text-slate-500">Posting as {identity.displayName} · {identity.company}</p>
          <label htmlFor={`${roomKind}-${roomId}-chat-message`} className="sr-only">Send a live chat message</label>
          <div className="flex gap-2"><input id={`${roomKind}-${roomId}-chat-message`} name="message" placeholder="Message this room…" className="min-h-11 flex-1 rounded-full border border-slate-200 px-4 text-sm outline-none focus:border-brand-orange" /><button className="rounded-full bg-slate-950 px-4 text-sm font-black text-white">Send</button></div>
          <p className="mt-2 text-xs text-slate-500">Room-scoped chat: {roomKind}/{roomId}. Crew can moderate or lock this room.</p>
        </form>
      ) : (
        <div className="border-t border-slate-100 p-4 text-sm text-slate-600" data-testid="chat-registration-required">Register for this event to chat with your real attendee identity.</div>
      )}
    </aside>
  );
}
