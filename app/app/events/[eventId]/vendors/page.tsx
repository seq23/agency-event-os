import { EventVendorBoard } from "@/components/vendors/VendorBoard";
export default async function EventVendorsPage({ params }: { params: Promise<{ eventId: string }> }) {
  const resolvedParams = await params; return <EventVendorBoard eventId={resolvedParams.eventId} />; }
