import { EventRegistration } from "@/components/venue/PublicEventPage";

export default function RegisterRoute({ params }: { params: { slug: string } }) {
  return <EventRegistration slug={params.slug} />;
}
