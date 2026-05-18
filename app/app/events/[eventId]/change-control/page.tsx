import { LastMinuteChangeQueue } from "@/components/approvals/LastMinuteChangeQueue";

export default function ChangeControlPage({ params }: { params: { eventId: string } }) {
  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">
        <LastMinuteChangeQueue eventId={params.eventId} />
      </div>
    </main>
  );
}
