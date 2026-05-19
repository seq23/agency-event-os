import type { ReactNode } from "react";
export function LaunchpadCard({ title, href, children, badge }: { title: string; href: string; children: ReactNode; badge?: string }) {
  return (
    <a href={href} className="group block rounded-3xl border border-brand-line bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-orange hover:shadow-brand">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-black tracking-tight text-brand-black group-hover:text-brand-orange">{title}</h3>
        {badge ? <span className="rounded-full bg-brand-ash px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-brand-muted">{badge}</span> : null}
      </div>
      <p className="mt-2 text-sm leading-6 text-brand-muted">{children}</p>
    </a>
  );
}
