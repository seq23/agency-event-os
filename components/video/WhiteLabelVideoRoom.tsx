import type { WhiteLabelVideoRoomConfig } from "@/types/whiteLabelVideo";
import { LiveKitRoomShell } from "@/components/video/LiveKitRoomShell";
import { ZoomEmbeddedRoom } from "@/components/video/ZoomEmbeddedRoom";

export function WhiteLabelVideoRoom({
  config,
  eventId,
}: {
  config: WhiteLabelVideoRoomConfig;
  eventId: string;
}) {
  if (config.providerMode === "zoom_embedded") {
    return <ZoomEmbeddedRoom config={config} userName="West Peek Guest" />;
  }

  if (config.providerMode === "external_backup_link") {
    return (
      <section className="rounded-[2rem] border border-brand-line bg-white p-4 shadow-brand sm:p-6">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-brand-orange">West Peek Live! room</p>
        <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-brand-black">{config.roomLabel}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-brand-muted">
          The production team has opened an alternate room for this session. Stay on this page until directed by the host.
        </p>
        {config.externalRoomUrl ? (
          <a
            href={config.externalRoomUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex rounded-full bg-brand-black px-5 py-3 text-sm font-bold text-white"
          >
            Open alternate room
          </a>
        ) : (
          <p className="mt-5 rounded-2xl bg-brand-orangeSoft px-4 py-3 text-sm text-brand-black">
            Alternate room details are not available yet. Please wait for the production team.
          </p>
        )}
      </section>
    );
  }

  return (
    <LiveKitRoomShell
      eventId={eventId}
      roomId={config.livekitRoomId ?? config.livekitRoomName ?? config.displayName}
      roomType={config.livekitRoomType ?? "main_stage"}
      role={config.livekitRole ?? "attendee"}
      title={config.roomLabel}
      description={`${config.roomLabel} opens inside West Peek Live!.`}
    />
  );
}
