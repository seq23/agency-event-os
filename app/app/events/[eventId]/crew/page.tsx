import { CrewInstructionManager } from "@/components/events/CrewInstructionManager";

export default async function EventCrewInstructionsPage({ params }: { params: Promise<{ eventId: string }> }) {
  const resolvedParams = await params;
  return <CrewInstructionManager eventId={resolvedParams.eventId} />;
}
