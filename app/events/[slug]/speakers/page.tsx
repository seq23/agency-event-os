import { PublicEventPage } from "@/components/venue/PublicEventPage";
export default function SpeakersRoute({ params }: { params: { slug: string } }) { return <PublicEventPage slug={params.slug} />; }
