import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { OperatorLaunchpad } from "@/components/production/OperatorLaunchpad";
import { BrandedSetupError } from "@/components/system/BrandedSetupError";
import { readV5AccessCookie } from "@/lib/auth/productionAccess";
import { getEnv, getV5AccessCookieSecret } from "@/lib/env";
import { accessDefaultLines, missingAccessEnv, safeAccessCookieNames } from "@/lib/env/safeEnv";

export const dynamic = "force-dynamic";

async function hasCrewLaunchpadAccess() {
  const missing = missingAccessEnv();
  if (missing.length) return { ok: false as const, missing };
  const env = getEnv();
  const { crewCookieName } = safeAccessCookieNames();
  const payload = await readV5AccessCookie(cookies().get(crewCookieName)?.value, getV5AccessCookieSecret(env));
  return { ok: Boolean(payload && payload.kind === "crew"), missing: [] as string[] };
}

export default async function ProductionLaunchpadPage() {
  const access = await hasCrewLaunchpadAccess();
  if (access.missing.length) {
    return <BrandedSetupError title="Operator Launchpad is not configured yet." message="The internal launchpad requires crew access configuration. Set the missing variables so the launchpad stays behind the production gate and never falls through to a generic server error." missingVariables={access.missing} defaultValues={accessDefaultLines()} />;
  }
  if (!access.ok) redirect("/production-access/crew?error=launchpad_required");
  return <OperatorLaunchpad />;
}
