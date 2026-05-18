import Link from "next/link";
import { LoginForm } from "@/components/auth/AuthForms";
import { AuthStatusBanner } from "@/components/auth/AuthStatusBanner";

export default function LoginPage({ searchParams }: { searchParams: { next?: string; error?: string; notice?: string } }) {
  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-slate-500">Agency Event OS</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">Log in</h1>
        <p className="mt-2 text-slate-600">Use your Supabase Auth account to access the correct agency, client, speaker, sponsor, or crew surface.</p>
        <AuthStatusBanner error={searchParams.error} notice={searchParams.notice} />
        <LoginForm next={searchParams.next ?? "/app"} />
        <div className="mt-4 flex justify-between text-sm text-slate-500">
          <Link href="/forgot-password">Forgot password?</Link>
          <Link href="/signup">Create account</Link>
        </div>
      </div>
    </main>
  );
}
