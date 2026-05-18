import { OperationalPersistencePanel } from "@/components/persistence/OperationalPersistencePanel";
import { ProductionInbox } from "@/components/production/ProductionInbox";
export default function ProductionInboxPage({ params }: { params: { eventId: string } }) { return <main className="space-y-6"><OperationalPersistencePanel /><ProductionInbox eventId={params.eventId} /></main>; }
