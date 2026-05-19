import { buildVirtualVenueModel } from "@/services/venue";
import { VenueHelpCenter } from "@/components/venue/VenueHelpCenter";
import { VenuePageShell } from "@/components/venue/VenuePageShell";

export default function HelpPage({ params }: { params: { eventId: string } }) {
  const model = buildVirtualVenueModel(params.eventId);
  return (
    <VenuePageShell model={model}>
      <VenueHelpCenter model={model} />
    </VenuePageShell>
  );
}
