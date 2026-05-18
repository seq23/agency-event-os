import { getCurrentUser } from "./getCurrentUser";
import { AuthRequiredError } from "./authTypes";

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    throw new AuthRequiredError();
  }

  return user;
}
