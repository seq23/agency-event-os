import type { VirtualVenuePerson } from "@/types/virtualVenue";

export function PeopleDirectoryCard({ person }: { person: VirtualVenuePerson }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold">{person.displayName}</h3>
      <p className="mt-1 text-sm text-slate-600">{person.title ?? "Attendee"}{person.company ? ` · ${person.company}` : ""}</p>
      <p className="mt-3 text-xs uppercase tracking-wide text-slate-500">{person.networkingOptIn ? "Networking enabled" : "Private"}</p>
    </article>
  );
}
