import { TalentReadinessDashboard } from "@/components/production/TalentReadinessDashboard";
export default async function TalentPage({ params }: { params: Promise<{ eventId: string }> }) {
  const resolvedParams = await params; return <TalentReadinessDashboard eventId={resolvedParams.eventId} />; }
