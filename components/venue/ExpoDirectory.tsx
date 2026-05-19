import type { VirtualVenueBooth } from "@/types/virtualVenue";
import { SponsorBoothCard } from "./SponsorBoothCard";

export function ExpoDirectory({ booths }: { booths: VirtualVenueBooth[] }) {
  return (
    <section>
      <h2 className="mb-4 text-2xl font-semibold">Expo hall</h2>
      <div className="grid gap-4 md:grid-cols-3">{booths.map((booth) => <SponsorBoothCard key={booth.id} booth={booth} />)}</div>
    </section>
  );
}
