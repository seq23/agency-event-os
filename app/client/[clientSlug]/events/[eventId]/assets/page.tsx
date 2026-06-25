import { ClientPortalDashboard } from "@/components/clients/ClientPortal";
export default async function ClientAssets({ params }: { params: Promise<{ clientSlug: string; eventId: string }> }) {
  const resolvedParams = await params; return <ClientPortalDashboard clientSlug={resolvedParams.clientSlug} eventId={resolvedParams.eventId} />; }
