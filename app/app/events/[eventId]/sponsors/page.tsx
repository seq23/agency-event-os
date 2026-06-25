import { SponsorManager } from "@/components/sponsors/SponsorManager";
export default async function SponsorsPage({ params }: { params: Promise<{ eventId: string }> }) {
  const resolvedParams = await params; return <SponsorManager eventId={resolvedParams.eventId} />; }
