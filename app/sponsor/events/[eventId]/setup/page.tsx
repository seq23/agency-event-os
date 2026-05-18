import { SponsorSetupWizard } from "@/components/sponsors/SponsorSetupWizard";

export default function SponsorSetupPage({ params }: { params: { eventId: string } }) {
  return <SponsorSetupWizard eventId={params.eventId} />;
}
