import { buildVirtualVenueModel } from "@/services/venue";
import { SessionDirectory } from "@/components/venue/SessionDirectory";
import { VenuePageShell } from "@/components/venue/VenuePageShell";

export default async function SessionsPage({ params }: { params: Promise<{ eventId: string }> }) {
  const resolvedParams = await params;
  const model = buildVirtualVenueModel(resolvedParams.eventId);
  return (
    <VenuePageShell model={model}>
      <SessionDirectory sessions={model.sessions} />
    </VenuePageShell>
  );
}
