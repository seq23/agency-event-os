import { ProductionCommandCenter } from "@/components/production/ProductionCommandCenter";

export default async function ProducerPage({ params }: { params: Promise<{ eventId: string }> }) {
  const resolvedParams = await params;
  return <ProductionCommandCenter eventId={resolvedParams.eventId} />;
}
