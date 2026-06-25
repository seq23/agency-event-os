import { buildVirtualVenueModel, findSession } from "@/services/venue";
import { SessionRoomExperience } from "@/components/venue/SessionRoomExperience";
import { VenuePageShell } from "@/components/venue/VenuePageShell";

export default async function SessionRoomPage({ params }: { params: Promise<{ eventId: string; sessionId: string }> }) {
  const resolvedParams = await params;
  const model = buildVirtualVenueModel(resolvedParams.eventId);
  const session = findSession(model.sessions, resolvedParams.sessionId);
  return (
    <VenuePageShell model={model}>
      <SessionRoomExperience model={model} session={session} />
    </VenuePageShell>
  );
}
