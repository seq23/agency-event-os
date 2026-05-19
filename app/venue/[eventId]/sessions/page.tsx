import { buildVirtualVenueModel } from "@/services/venue";
import { SessionDirectory } from "@/components/venue/SessionDirectory";
import { VenuePageShell } from "@/components/venue/VenuePageShell";

export default function SessionsPage({ params }: { params: { eventId: string } }) {
  const model = buildVirtualVenueModel(params.eventId);
  return (
    <VenuePageShell model={model}>
      <SessionDirectory sessions={model.sessions} />
    </VenuePageShell>
  );
}
