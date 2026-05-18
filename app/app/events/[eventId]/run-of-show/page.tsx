import { RunOfShowPage } from "@/components/run-of-show/RunOfShowPage";

export default function RunOfShowRoute({ params }: { params: { eventId: string } }) {
  return <RunOfShowPage eventId={params.eventId} />;
}
