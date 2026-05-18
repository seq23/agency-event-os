import { logout } from "@/lib/auth/actions";

export function LogoutButton() {
  return (
    <form action={logout}>
      <button className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600" type="submit">
        Log out
      </button>
    </form>
  );
}
