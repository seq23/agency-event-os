import { TestingConsole } from "@/components/testing/TestingConsole";

export default async function EventTestingConsolePage({ params }: { params: Promise<{ eventId: string }> }) {
  const resolvedParams = await params;
  return <TestingConsole eventId={resolvedParams.eventId} />;
}
