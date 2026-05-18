import { can } from "@/lib/permissions";
import { requireUser } from "./requireUser";
import { PermissionDeniedError } from "./authTypes";
import type { PermissionResource } from "@/types/permissions";

export async function requirePermission(action: string, resource?: PermissionResource) {
  const user = await requireUser();

  if (!can(user, action, resource)) {
    throw new PermissionDeniedError(action);
  }

  return user;
}
