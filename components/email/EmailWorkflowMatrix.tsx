import { requiredEmailWorkflows } from "@/services/email";

export function EmailWorkflowMatrix() {
  return (
    <section className="rounded-3xl border border-brand-line bg-white p-4 shadow-sm sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Workflows</p>
      <h2 className="mt-2 text-2xl font-semibold text-slate-950">Production email workflows</h2>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {requiredEmailWorkflows.map((workflow) => (
          <div key={workflow} className="rounded-2xl bg-slate-50 p-4">
            <p className="font-semibold capitalize">{workflow.replace(/_/g, " ")}</p>
            <p className="mt-1 text-sm text-slate-600">Live-send capable through Resend.</p>
          </div>
        ))}
      </div>
    </section>
  );
}
