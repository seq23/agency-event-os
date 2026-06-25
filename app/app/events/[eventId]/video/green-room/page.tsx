import { LiveKitRoomShell } from "@/components/video/LiveKitRoomShell";

export default async function GreenRoomPage({ params }: { params: Promise<{ eventId: string }> }) {
  const resolvedParams = await params;
  return (
    <LiveKitRoomShell
      eventId={resolvedParams.eventId}
      roomId={`${resolvedParams.eventId}-green-room`}
      roomType="green_room"
      role="speaker"
      title="Speaker Green Room"
      description="Private speaker preparation room for call time, device checks, and producer handoff."
    />
  );
}
