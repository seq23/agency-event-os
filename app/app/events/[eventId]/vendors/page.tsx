import { EventVendorBoard } from "@/components/vendors/VendorBoard";
export default function EventVendorsPage({ params }: { params: { eventId: string } }){ return <EventVendorBoard eventId={params.eventId} />; }
