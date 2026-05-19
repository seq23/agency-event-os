import { buildVirtualVenueModel } from "@/services/venue";
import { ExpoDirectory } from "@/components/venue/ExpoDirectory";
import { VenuePageShell } from "@/components/venue/VenuePageShell";

export default function ExpoPage({ params }: { params: { eventId: string } }) {
  const model = buildVirtualVenueModel(params.eventId);
  return (
    <VenuePageShell model={model}>
      <ExpoDirectory booths={model.booths} />
    </VenuePageShell>
  );
}
