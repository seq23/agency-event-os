import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { getCurrentUser } from "@/lib/auth";
import { getEnv, getV5AccessCookieNames, getV5AccessCookieSecret } from "@/lib/env";
import { readV5AccessCookie } from "@/lib/auth/productionAccess";
import { canOperatorAccessPath } from "@/lib/auth/v5RouteAuthorization";

export default async function AgencyAppLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    const env = getEnv();
    const { operatorCookieName } = getV5AccessCookieNames(env);
    const operatorCookie = cookies().get(operatorCookieName)?.value;
    const operatorPayload = operatorCookie ? await readV5AccessCookie(operatorCookie, getV5AccessCookieSecret(env)) : null;
    const operatorCanEnterDay1App = canOperatorAccessPath("/app/events/new", operatorPayload || undefined);

    if (!operatorCanEnterDay1App) redirect("/login?next=/app");
  }

  return <AppShell>{children}</AppShell>;
}
