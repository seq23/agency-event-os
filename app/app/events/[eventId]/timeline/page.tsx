import { TaskBoard } from "@/components/tasks/TaskBoard";

export default async function TimelineRoute({ params }: { params: Promise<{ eventId: string }> }) {
  const resolvedParams = await params;
  return <TaskBoard eventId={resolvedParams.eventId} />;
}
