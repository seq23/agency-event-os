import { ClientPortalDashboard } from "@/components/clients/ClientPortal";
export default function ClientROS({ params }: { params: { clientSlug: string; eventId: string } }){ return <ClientPortalDashboard clientSlug={params.clientSlug} eventId={params.eventId} />; }
