import { TaskBoard } from "@/components/tasks/TaskBoard";

export default function TimelineRoute({ params }: { params: { eventId: string } }) {
  return <TaskBoard eventId={params.eventId} />;
}
