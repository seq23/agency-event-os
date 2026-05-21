import { redirect } from "next/navigation";

export default function OnboardingPage() {
  if (process.env.NEXT_PUBLIC_SELF_SERVE_ENABLED !== "true") redirect("/request-event?source=self-serve-disabled");
  redirect("/signup?intent=onboarding");
}
