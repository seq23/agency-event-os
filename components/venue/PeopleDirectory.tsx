import type { VirtualVenuePerson } from "@/types/virtualVenue";
import { PeopleDirectoryCard } from "./PeopleDirectoryCard";

export function PeopleDirectory({ people }: { people: VirtualVenuePerson[] }) {
  return (
    <section>
      <h2 className="mb-4 text-2xl font-semibold">People</h2>
      <div className="grid gap-4 md:grid-cols-3">{people.map((person) => <PeopleDirectoryCard key={person.id} person={person} />)}</div>
    </section>
  );
}
