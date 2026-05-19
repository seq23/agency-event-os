import { buildVirtualVenueModel } from "@/services/venue";
import { NetworkingLobby } from "@/components/venue/NetworkingLobby";
import { VenuePageShell } from "@/components/venue/VenuePageShell";

export default function NetworkingPage({ params }: { params: { eventId: string } }) {
  const model = buildVirtualVenueModel(params.eventId);
  return (
    <VenuePageShell model={model}>
      <NetworkingLobby model={model} />
    </VenuePageShell>
  );
}
