import { buildVirtualVenueModel } from "@/services/venue";
import { PeopleDirectory } from "@/components/venue/PeopleDirectory";
import { VenuePageShell } from "@/components/venue/VenuePageShell";

export default function PeoplePage({ params }: { params: { eventId: string } }) {
  const model = buildVirtualVenueModel(params.eventId);
  return (
    <VenuePageShell model={model}>
      <PeopleDirectory people={model.people} />
    </VenuePageShell>
  );
}
