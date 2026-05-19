import { LiveKitRoomShell } from "@/components/video/LiveKitRoomShell";

export default function BackstageRoomPage({ params }: { params: { eventId: string } }) {
  return (
    <LiveKitRoomShell
      eventId={params.eventId}
      roomId={`${params.eventId}-backstage`}
      roomType="backstage"
      role="producer"
      title="Backstage"
      description="Producer and crew backstage room for live coordination outside the attendee-facing room."
    />
  );
}
