import { EventRegistrationShell } from "@/components/venue/PublicEventPage";

export default function RegisterRoute({ params }: { params: { slug: string } }) {
  return <EventRegistrationShell slug={params.slug} />;
}
