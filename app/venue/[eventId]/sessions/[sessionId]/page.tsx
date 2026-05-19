import { buildVirtualVenueModel, findSession } from "@/services/venue";
import { SessionRoomExperience } from "@/components/venue/SessionRoomExperience";
import { VenuePageShell } from "@/components/venue/VenuePageShell";

export default function SessionRoomPage({ params }: { params: { eventId: string; sessionId: string } }) {
  const model = buildVirtualVenueModel(params.eventId);
  const session = findSession(model.sessions, params.sessionId);
  return (
    <VenuePageShell model={model}>
      <SessionRoomExperience model={model} session={session} />
    </VenuePageShell>
  );
}
