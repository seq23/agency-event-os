import { TalentReadinessDashboard } from "@/components/production/TalentReadinessDashboard";
export default function TalentPage({ params }: { params: { eventId: string } }) { return <TalentReadinessDashboard eventId={params.eventId} />; }
