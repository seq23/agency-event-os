import { buildVirtualVenueModel } from "@/services/venue";
import { NetworkingLobby } from "@/components/venue/NetworkingLobby";
import { VenuePageShell } from "@/components/venue/VenuePageShell";

export default async function NetworkingPage({ params }: { params: Promise<{ eventId: string }> }) {
  const resolvedParams = await params;
  const model = buildVirtualVenueModel(resolvedParams.eventId);
  return (
    <VenuePageShell model={model}>
      <NetworkingLobby model={model} />
    </VenuePageShell>
  );
}
