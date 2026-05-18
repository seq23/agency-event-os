import { PublicEventPage } from "@/components/venue/PublicEventPage";
export default function SponsorsRoute({ params }: { params: { slug: string } }) { return <PublicEventPage slug={params.slug} />; }
