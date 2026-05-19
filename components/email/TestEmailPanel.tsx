import { sendTestEmailAction } from "@/lib/actions/emailActions";
import { requiredEmailWorkflows } from "@/services/email";

export function TestEmailPanel() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Safe test send</p>
      <h2 className="mt-2 text-2xl font-semibold text-slate-950">Send a Resend test email</h2>
      <form className="mt-5 grid gap-3 md:grid-cols-2" action={async (formData: FormData) => { await sendTestEmailAction(formData); }}>
        <label className="text-sm font-medium text-slate-700">
          Recipient
          <input className="mt-1 w-full rounded-xl border border-slate-200 p-3" name="to" type="email" required aria-label="Recipient email" />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Workflow
          <select className="mt-1 w-full rounded-xl border border-slate-200 p-3" name="workflowType" defaultValue="client_invite">
            {requiredEmailWorkflows.map((workflow) => (
              <option key={workflow} value={workflow}>{workflow.replace(/_/g, " ")}</option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium text-slate-700 md:col-span-2">
          Event name
          <input className="mt-1 w-full rounded-xl border border-slate-200 p-3" name="eventName" defaultValue="Agency Event OS" aria-label="Event name" />
        </label>
        <button className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white md:col-span-2" type="submit">
          Send test email
        </button>
      </form>
    </section>
  );
}
