import { LiveKitRoomShell } from "@/components/video/LiveKitRoomShell";

export default async function MainStageRoomPage({ params }: { params: Promise<{ eventId: string }> }) {
  const resolvedParams = await params;
  return (
    <LiveKitRoomShell
      eventId={resolvedParams.eventId}
      roomId={`${resolvedParams.eventId}-main-stage`}
      roomType="main_stage"
      role="host"
      title="Main Stage"
      description="Producer-controlled LiveKit room shell for the primary event broadcast surface."
    />
  );
}
