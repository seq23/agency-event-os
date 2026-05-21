import { redirect } from "next/navigation";

export default function StartCreateEventPage() {
  if (process.env.SELF_SERVE_EVENT_CREATION_ENABLED !== "true") redirect("/request-event?source=self-serve-disabled");
  redirect("/signup?intent=create-event&next=/app/events/new");
}
