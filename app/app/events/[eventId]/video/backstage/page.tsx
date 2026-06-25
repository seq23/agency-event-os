import { LiveKitRoomShell } from "@/components/video/LiveKitRoomShell";

export default async function BackstageRoomPage({ params }: { params: Promise<{ eventId: string }> }) {
  const resolvedParams = await params;
  return (
    <LiveKitRoomShell
      eventId={resolvedParams.eventId}
      roomId={`${resolvedParams.eventId}-backstage`}
      roomType="backstage"
      role="producer"
      title="Backstage"
      description="Producer and crew backstage room for live coordination outside the attendee-facing room."
    />
  );
}
