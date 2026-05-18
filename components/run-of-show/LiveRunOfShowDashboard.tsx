import { getRunOfShowProgressSnapshot } from "@/services/run-of-show";
import { RUN_OF_SHOW_VISIBILITY } from "@/types/runOfShowLive";
import { RunOfShowProgressRail } from "./RunOfShowProgressRail";
import { CurrentSegmentCard } from "./CurrentSegmentCard";
import { NextCueStack } from "./NextCueStack";
import { LiveRunOfShowControls } from "./LiveRunOfShowControls";

export function LiveRunOfShowDashboard({
  eventId,
  viewer = "agency",
  showControls = false,
}: {
  eventId: string;
  viewer?: keyof typeof RUN_OF_SHOW_VISIBILITY;
  showControls?: boolean;
}) {
  const snapshot = getRunOfShowProgressSnapshot(eventId);
  const visibility = RUN_OF_SHOW_VISIBILITY[viewer];

  return (
    <div className="space-y-6">
      <RunOfShowProgressRail snapshot={snapshot} />
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <CurrentSegmentCard segment={snapshot.currentSegment} visibility={visibility} />
        <NextCueStack segments={snapshot.upcomingSegments} visibility={visibility} />
      </div>
      {showControls && visibility.canControlLiveStatus ? <LiveRunOfShowControls /> : null}
    </div>
  );
}
