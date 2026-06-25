import { buildVirtualVenueModel } from "@/services/venue";
import { MainStageExperience } from "@/components/venue/MainStageExperience";
import { VenuePageShell } from "@/components/venue/VenuePageShell";

export default async function StagePage({ params }: { params: Promise<{ eventId: string }> }) {
  const resolvedParams = await params;
  const model = buildVirtualVenueModel(resolvedParams.eventId);
  return (
    <VenuePageShell model={model} showLegalFooter={false}>
      <MainStageExperience model={model} />
    </VenuePageShell>
  );
}
