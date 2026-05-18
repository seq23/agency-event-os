import type { PermissionUser } from "@/types/permissions";

export interface AuthSession {
  user: PermissionUser;
  source: "mock" | "supabase";
}

export class AuthRequiredError extends Error {
  constructor() {
    super("Authentication required.");
    this.name = "AuthRequiredError";
  }
}

export class PermissionDeniedError extends Error {
  constructor(action: string) {
    super(`Permission denied for action: ${action}`);
    this.name = "PermissionDeniedError";
  }
}
