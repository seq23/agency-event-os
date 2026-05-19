import { buildVirtualVenueModel, findBooth } from "@/services/venue";
import { SponsorBoothExperience } from "@/components/venue/SponsorBoothExperience";
import { VenuePageShell } from "@/components/venue/VenuePageShell";

export default function BoothPage({ params }: { params: { eventId: string; boothId: string } }) {
  const model = buildVirtualVenueModel(params.eventId);
  const booth = findBooth(model.booths, params.boothId);
  return (
    <VenuePageShell model={model}>
      <SponsorBoothExperience booth={booth} />
    </VenuePageShell>
  );
}
