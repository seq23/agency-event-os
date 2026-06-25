import { ClientPortalDashboard } from "@/components/clients/ClientPortal";
export default async function ClientROS({ params }: { params: Promise<{ clientSlug: string; eventId: string }> }) {
  const resolvedParams = await params; return <ClientPortalDashboard clientSlug={resolvedParams.clientSlug} eventId={resolvedParams.eventId} />; }
