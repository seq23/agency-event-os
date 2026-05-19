import type { VenueNavItem } from "@/types/virtualVenue";

export function VenueNav({ items }: { items: VenueNavItem[] }) {
  return (
    <nav className="mobile-scrollbar flex gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.06] p-2">
      {items.map((item) => (
        <a key={item.surface} href={item.href} className="whitespace-nowrap rounded-xl px-3 py-2 text-sm font-bold text-white/85 hover:bg-brand-orange hover:text-white">
          {item.label}
        </a>
      ))}
    </nav>
  );
}
