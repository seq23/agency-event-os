import { ClientPortalDashboard } from "@/components/clients/ClientPortal";
export default async function ClientPortal({ params }: { params: Promise<{ clientSlug: string }> }) {
  const resolvedParams = await params; return <ClientPortalDashboard clientSlug={resolvedParams.clientSlug} />; }
