import type { VenueNavItem } from "@/types/virtualVenue";

export function VenueNav({ items }: { items: VenueNavItem[] }) {
  return (
    <nav className="flex gap-2 overflow-x-auto rounded-2xl bg-white/10 p-2">
      {items.map((item) => (
        <a key={item.surface} href={item.href} className="whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium text-white hover:bg-white/15">
          {item.label}
        </a>
      ))}
    </nav>
  );
}
