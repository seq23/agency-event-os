export function FloatingHelpButton({ eventId }: { eventId: string }) {
  return (
    <a
      id="stage-help"
      href={`/venue/${eventId}/help`}
      className="fixed bottom-5 right-5 z-[1001] rounded-full bg-brand-orange px-5 py-3 text-sm font-black text-white shadow-brand transition hover:-translate-y-0.5 print:hidden"
      aria-label="Open help center"
    >
      Need help?
    </a>
  );
}
