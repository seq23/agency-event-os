import { TaskBoard } from "@/components/tasks/TaskBoard";

export default async function TasksRoute({ params }: { params: Promise<{ eventId: string }> }) {
  const resolvedParams = await params;
  return <TaskBoard eventId={resolvedParams.eventId} />;
}
