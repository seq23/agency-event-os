import { ClientDetail } from "@/components/clients/ClientDetail";

export default function ClientDetailPage({ params }: { params: { clientId: string } }) {
  return <ClientDetail clientId={params.clientId} />;
}
