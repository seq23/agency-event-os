import { OperationalPersistencePanel } from "@/components/persistence/OperationalPersistencePanel";
import { LastMinuteChangeQueue } from "@/components/approvals/LastMinuteChangeQueue";
export default async function ChangeControlPage({ params }: { params: Promise<{ eventId: string }> }) {
  const resolvedParams = await params; return <main className="min-h-screen bg-slate-50 p-6"><div className="mx-auto max-w-6xl"><OperationalPersistencePanel />
                <LastMinuteChangeQueue eventId={resolvedParams.eventId} /></div></main>; }
