import { ProductionInbox } from "@/components/production/ProductionInbox";
export default function ProductionInboxPage({ params }: { params: { eventId: string } }) { return <ProductionInbox eventId={params.eventId} />; }
