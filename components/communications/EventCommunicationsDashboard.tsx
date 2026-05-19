import { sendEventCommunicationAction } from "@/lib/actions/communicationActions";
import { getRuntimeStore } from "@/services/runtime/runtimeStoreFactory";
import { getEventCommunicationReadiness } from "@/services/communications/eventCommunicationService";

export async function EventCommunicationsDashboard({ eventId }: { eventId: string }) {
  const readiness = getEventCommunicationReadiness(eventId);
  const runtime = await getRuntimeStore().readSnapshot();
  const logs = runtime.emailEvents.filter((event) => event.eventId === eventId).slice(-10).reverse();
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-brand-orange">Communications</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">{readiness.eventName}</h1>
        <p className="mt-3 text-sm text-slate-600">Resend status: {readiness.resendConfigured ? "configured" : "unavailable — sends are blocked and logged honestly"}</p>
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        {readiness.templates.map((template) => (
          <form key={template.templateKey} action={sendEventCommunicationAction} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <input type="hidden" name="eventId" value={eventId} />
            <input type="hidden" name="templateKey" value={template.templateKey} />
            <h2 className="font-black text-slate-950">{template.templateKey.replaceAll("_", " ")}</h2>
            <p className="mt-1 text-sm text-slate-500">Segment: {template.recipientSegment} · {template.ready ? "ready" : "blocked"}</p>
            <div className="mt-4 grid gap-2">
              <input name="to" type="email" required className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
              <input name="recipientName" className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
              <button type="submit" className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white">Send / log status</button>
            </div>
          </form>
        ))}
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-black text-slate-950">Send log</h2>
        <div className="mt-3 space-y-2">
          {logs.length ? logs.map((log) => <div key={log.id} className="rounded-2xl bg-slate-50 p-3 text-sm"><strong>{log.templateKey}</strong> · {log.status} · {log.reason || log.providerMessageId || "recorded"}</div>) : <p className="text-sm text-slate-500">No sends logged yet.</p>}
        </div>
      </section>
    </div>
  );
}
