import { buildVirtualVenueModel } from "@/services/venue";
import { ExpoDirectory } from "@/components/venue/ExpoDirectory";
import { VenuePageShell } from "@/components/venue/VenuePageShell";

export default async function ExpoPage({ params }: { params: Promise<{ eventId: string }> }) {
  const resolvedParams = await params;
  const model = buildVirtualVenueModel(resolvedParams.eventId);
  return (
    <VenuePageShell model={model}>
      <ExpoDirectory booths={model.booths} />
    </VenuePageShell>
  );
}
