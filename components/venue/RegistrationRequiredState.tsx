export function RegistrationRequiredState({ registerHref }: { registerHref: string }) {
  return (
    <section className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-amber-900">
      <h2 className="font-black">Registration required</h2>
      <p className="mt-2 text-sm">Register before joining the venue so attendance and post-event reporting are real.</p>
      <a href={registerHref} className="mt-4 inline-flex rounded-xl bg-amber-900 px-4 py-2 text-sm font-bold text-white">Register now</a>
    </section>
  );
}
