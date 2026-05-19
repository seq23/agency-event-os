import type { ReactNode } from "react";
export function LaunchpadSection({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.3em] text-brand-orange">{eyebrow}</p>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-brand-black">{title}</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{children}</div>
    </section>
  );
}
