import { getCurrentUser as getMockCurrentUser } from "@/lib/mock/getMockData";
import type { PermissionUser } from "@/types/permissions";

/**
 * Current implementation intentionally returns the mock agency owner.
 *
 * Future Supabase implementation should:
 * 1. Read the current Supabase auth session.
 * 2. Resolve role assignments.
 * 3. Return the normalized PermissionUser shape.
 */
export async function getCurrentUser(): Promise<PermissionUser | null> {
  return getMockCurrentUser();
}
