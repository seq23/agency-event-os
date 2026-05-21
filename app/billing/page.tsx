import { redirect } from "next/navigation";

export default function BillingPage() {
  if (process.env.NEXT_PUBLIC_SELF_SERVE_ENABLED !== "true") redirect("/request-event?source=self-serve-disabled");
  redirect("/request-event?source=billing-not-enabled");
}
