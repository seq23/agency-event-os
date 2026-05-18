import { SponsorManager } from "@/components/sponsors/SponsorManager";
export default function SponsorsPage({ params }: { params: { eventId: string } }){ return <SponsorManager eventId={params.eventId} />; }
