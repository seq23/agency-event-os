import type { VirtualVenuePerson } from "@/types/virtualVenue";

export function searchPeople(people: VirtualVenuePerson[], query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return people;

  return people.filter((person) =>
    [person.displayName, person.company, person.title]
      .filter(Boolean)
      .some((value) => value!.toLowerCase().includes(normalized)),
  );
}

export function filterNetworkingOptIn(people: VirtualVenuePerson[]) {
  return people.filter((person) => person.networkingOptIn);
}
