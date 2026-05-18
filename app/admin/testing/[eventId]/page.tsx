import { TestingConsole } from "@/components/testing/TestingConsole";

export default function EventTestingConsolePage({ params }: { params: { eventId: string } }) {
  return <TestingConsole eventId={params.eventId} />;
}
