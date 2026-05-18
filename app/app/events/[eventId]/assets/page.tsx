import { AssetLibrary } from "@/components/assets/AssetLibrary";
export default function AssetsPage({ params }: { params: { eventId: string } }){ return <AssetLibrary eventId={params.eventId} />; }
