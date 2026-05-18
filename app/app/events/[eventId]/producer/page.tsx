import { ProductionCommandCenter } from "@/components/production/ProductionCommandCenter";

export default function ProducerPage({ params }: { params: { eventId: string } }) {
  return <ProductionCommandCenter eventId={params.eventId} />;
}
