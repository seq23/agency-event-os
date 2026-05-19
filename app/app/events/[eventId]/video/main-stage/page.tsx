import { LiveKitRoomShell } from "@/components/video/LiveKitRoomShell";

export default function MainStageRoomPage({ params }: { params: { eventId: string } }) {
  return (
    <LiveKitRoomShell
      eventId={params.eventId}
      roomId={`${params.eventId}-main-stage`}
      roomType="main_stage"
      role="host"
      title="Main Stage"
      description="Producer-controlled LiveKit room shell for the primary event broadcast surface."
    />
  );
}
