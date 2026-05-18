import type { ReactNode } from "react";

export function SectionCard({ title, eyebrow, children }: { title: string; eyebrow?: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      {eyebrow ? <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{eyebrow}</p> : null}
      <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
