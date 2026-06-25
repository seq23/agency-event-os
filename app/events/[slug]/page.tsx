import { PublicEventPage } from "@/components/venue/PublicEventPage";

export default async function PublicEventRoute({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  return <PublicEventPage slug={resolvedParams.slug} />;
}
