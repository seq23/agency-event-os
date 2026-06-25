import { LiveKitRoomShell } from "@/components/video/LiveKitRoomShell";

export default async function TestingLiveKitRoomPage({ params }: { params: Promise<{ eventId: string }> }) {
  const resolvedParams = await params;
  return (
    <LiveKitRoomShell
      eventId={resolvedParams.eventId}
      roomId={`${resolvedParams.eventId}-testing`}
      roomType="testing"
      role="producer"
      title="LiveKit Testing Room"
      description="Testing room for producer diagnostics, camera checks, microphone checks, and provider readiness."
    />
  );
}
