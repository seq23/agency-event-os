import { getEmailSendingMode } from "@/services/email";
import { isResendConfigured, getEnv } from "@/lib/env";

export function EmailStatusPanel() {
  const env = getEnv();
  const mode = getEmailSendingMode();

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Email</p>
      <h2 className="mt-2 text-2xl font-semibold text-slate-950">Production sending status</h2>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Mode</p>
          <p className="font-semibold">{mode.replace(/_/g, " ")}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Resend</p>
          <p className="font-semibold">{isResendConfigured(env) ? "Configured" : "Not configured"}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Reply-to</p>
          <p className="font-semibold">{env.EMAIL_REPLY_TO || "Not set"}</p>
        </div>
      </div>
    </section>
  );
}
