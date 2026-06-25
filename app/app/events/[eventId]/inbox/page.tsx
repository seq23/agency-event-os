import { OperationalPersistencePanel } from "@/components/persistence/OperationalPersistencePanel";
import { ProductionInbox } from "@/components/production/ProductionInbox";
export default async function ProductionInboxPage({ params }: { params: Promise<{ eventId: string }> }) {
  const resolvedParams = await params; return <main className="space-y-6"><OperationalPersistencePanel /><ProductionInbox eventId={resolvedParams.eventId} /></main>; }
