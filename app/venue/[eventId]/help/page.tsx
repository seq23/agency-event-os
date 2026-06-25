import { buildVirtualVenueModel } from "@/services/venue";
import { VenueHelpCenter } from "@/components/venue/VenueHelpCenter";
import { VenuePageShell } from "@/components/venue/VenuePageShell";

export default async function HelpPage({ params }: { params: Promise<{ eventId: string }> }) {
  const resolvedParams = await params;
  const model = buildVirtualVenueModel(resolvedParams.eventId);
  return (
    <VenuePageShell model={model}>
      <VenueHelpCenter model={model} />
    </VenuePageShell>
  );
}
