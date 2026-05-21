import { CrewInstructionManager } from "@/components/events/CrewInstructionManager";

export default function EventCrewInstructionsPage({ params }: { params: { eventId: string } }) {
  return <CrewInstructionManager eventId={params.eventId} />;
}
