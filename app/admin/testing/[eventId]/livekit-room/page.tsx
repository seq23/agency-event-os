import { LiveKitRoomShell } from "@/components/video/LiveKitRoomShell";

export default function TestingLiveKitRoomPage({ params }: { params: { eventId: string } }) {
  return (
    <LiveKitRoomShell
      eventId={params.eventId}
      roomId={`${params.eventId}-testing`}
      roomType="testing"
      role="producer"
      title="LiveKit Testing Room"
      description="Testing room for producer diagnostics, camera checks, microphone checks, and provider readiness."
    />
  );
}
