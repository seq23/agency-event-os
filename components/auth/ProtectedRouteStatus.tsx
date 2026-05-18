import { can } from "@/lib/permissions";
import { getRouteRequirement } from "@/lib/auth/routeAccess";
import type { PermissionUser } from "@/types/permissions";

export function ProtectedRouteStatus({ pathname, user }: { pathname: string; user: PermissionUser }) {
  const requirement = getRouteRequirement(pathname);
  if (!requirement) return null;
  const allowed = can(user, requirement.capability);

  return (
    <div className={`rounded-2xl border p-3 text-sm ${allowed ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-amber-200 bg-amber-50 text-amber-900"}`}>
      {allowed ? `Access confirmed for ${requirement.label}.` : `Signed in, but this account is missing ${requirement.capability}.`}
    </div>
  );
}
