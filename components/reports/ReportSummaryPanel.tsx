import type { EventReport } from "@/types/reports";

export function ReportSummaryPanel({ report }: { report: EventReport }) {
  return (
    <section className="rounded-3xl border border-brand-line bg-white p-4 shadow-sm sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Report</p>
      <h2 className="mt-2 text-2xl font-semibold text-slate-950">{report.title}</h2>
      <div className="mt-5 space-y-3">
        {report.sections.map((section) => (
          <div key={section.sectionKey} className="rounded-2xl bg-slate-50 p-4">
            <p className="font-semibold text-slate-950">{section.title}</p>
            <p className="mt-1 text-sm text-slate-600">{section.summary}</p>
            <div className="mt-3 grid gap-2 md:grid-cols-3">
              {section.metrics.map((metric) => (
                <div key={metric.label} className="rounded-xl bg-white p-3">
                  <p className="text-lg font-semibold">{metric.value}</p>
                  <p className="text-xs text-slate-500">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
