import { buildVirtualVenueModel } from "@/services/venue";
import { VenueLobbyDashboard } from "@/components/venue/VenueLobbyDashboard";
import { VenuePageShell } from "@/components/venue/VenuePageShell";

export default function LobbyPage({ params }: { params: { eventId: string } }) {
  const model = buildVirtualVenueModel(params.eventId);
  return (
    <VenuePageShell model={model}>
      <VenueLobbyDashboard model={model} />
    </VenuePageShell>
  );
}
