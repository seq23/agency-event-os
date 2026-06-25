import { SponsorSetupWizard } from "@/components/sponsors/SponsorSetupWizard";
export default async function SponsorSetupPage({ params }: { params: Promise<{ eventId: string }> }) {
  const resolvedParams = await params; return <SponsorSetupWizard eventId={resolvedParams.eventId} />; }
