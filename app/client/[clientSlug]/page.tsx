import { ClientPortalDashboard } from "@/components/clients/ClientPortal";
export default function ClientPortal({ params }: { params: { clientSlug: string } }){ return <ClientPortalDashboard clientSlug={params.clientSlug} />; }
