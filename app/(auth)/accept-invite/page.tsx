import Link from "next/link";

export default function AcceptInvitePage() {
  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-slate-500">Invite acceptance</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">Invite flow shell</h1>
        <p className="mt-2 text-slate-600">Batch 3A keeps invite acceptance documented but not wired to Resend or token persistence yet.</p>
        <Link className="mt-6 block rounded-xl bg-slate-950 px-4 py-3 text-center text-sm font-semibold text-white" href="/login">Continue to login</Link>
      </div>
    </main>
  );
}
