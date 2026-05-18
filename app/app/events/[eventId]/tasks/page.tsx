import { TaskBoard } from "@/components/tasks/TaskBoard";

export default function TasksRoute({ params }: { params: { eventId: string } }) {
  return <TaskBoard eventId={params.eventId} />;
}
