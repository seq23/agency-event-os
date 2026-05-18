import { SpeakerTeleprompterPanel } from "@/components/speakers/SpeakerTeleprompterPanel";

export default function SpeakerTeleprompterPage({ params }: { params: { eventId: string } }) {
  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">
        <SpeakerTeleprompterPanel eventId={params.eventId} />
      </div>
    </main>
  );
}
