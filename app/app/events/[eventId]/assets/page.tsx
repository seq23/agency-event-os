import { AssetLibrary } from "@/components/assets/AssetLibrary";
export default async function AssetsPage({ params }: { params: Promise<{ eventId: string }> }) {
  const resolvedParams = await params; return <AssetLibrary eventId={resolvedParams.eventId} />; }
