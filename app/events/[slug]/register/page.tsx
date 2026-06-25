import { LegalFooter } from "@/components/legal/LegalFooter";
import { EventRegistration } from "@/components/venue/PublicEventPage";

export default async function RegisterRoute({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  return (
    <>
      <EventRegistration slug={resolvedParams.slug} />
      <LegalFooter variant="standard" />
    </>
  );
}
