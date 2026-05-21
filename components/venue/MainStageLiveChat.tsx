import type { VirtualVenueModel } from "@/types/virtualVenue";
import { LiveRoomChat } from "@/components/venue/LiveRoomChat";

export function MainStageLiveChat({ model }: { model: VirtualVenueModel }) {
  return <LiveRoomChat eventId={model.eventId} roomKind="main_stage" roomId="main-stage" title="Everyone can talk here" description={`Conference-wide main stage chat for attendees watching ${model.eventName}.`} />;
}
