import { LiveKitRoomShell } from "@/components/video/LiveKitRoomShell";

export default function GreenRoomPage({ params }: { params: { eventId: string } }) {
  return (
    <LiveKitRoomShell
      eventId={params.eventId}
      roomId={`${params.eventId}-green-room`}
      roomType="green_room"
      role="speaker"
      title="Speaker Green Room"
      description="Private speaker preparation room for call time, device checks, and producer handoff."
    />
  );
}
