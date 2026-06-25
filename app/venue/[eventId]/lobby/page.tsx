import { buildVirtualVenueModel } from "@/services/venue";
import { VenueLobbyDashboard } from "@/components/venue/VenueLobbyDashboard";
import { VenuePageShell } from "@/components/venue/VenuePageShell";

export default async function LobbyPage({ params }: { params: Promise<{ eventId: string }> }) {
  const resolvedParams = await params;
  const model = buildVirtualVenueModel(resolvedParams.eventId);
  return (
    <VenuePageShell model={model}>
      <VenueLobbyDashboard model={model} />
    </VenuePageShell>
  );
}
