import Link from "next/link";

type LegalFooterProps = {
  variant?: "standard" | "compact" | "venue";
  className?: string;
};

const WEST_PEEK_LIVE_URL = "https://westpeek.live";
const WEST_PEEK_PRODUCTIONS_URL = "https://productions.joinwestpeek.com/";
const SUPPORT_EMAIL = "mailto:info@westpeek.ventures";

function LegalLinks({ compact = false }: { compact?: boolean }) {
  const base = compact
    ? "flex flex-wrap gap-3 text-xs"
    : "flex flex-wrap gap-4 text-xs font-bold uppercase tracking-[0.18em]";

  return (
    <nav className={base} aria-label="Legal and support links">
      <Link prefetch={false} className="underline-offset-4 hover:underline" href="/privacy">Privacy</Link>
      <Link prefetch={false} className="underline-offset-4 hover:underline" href="/terms">Terms</Link>
      <a className="underline-offset-4 hover:underline" href={SUPPORT_EMAIL}>Support</a>
    </nav>
  );
}

export function LegalFooter({ variant = "standard", className = "" }: LegalFooterProps) {
  const year = 2026;

  if (variant === "compact") {
    return (
      <footer className={`border-t border-brand-line bg-white/80 px-5 py-5 text-xs text-brand-muted ${className}`}>
        <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Powered by{" "}
            <a className="font-bold text-brand-black underline-offset-4 hover:underline" href={WEST_PEEK_LIVE_URL}>
              West Peek Live
            </a>{" "}
            · Produced by{" "}
            <a className="font-bold text-brand-black underline-offset-4 hover:underline" href={WEST_PEEK_PRODUCTIONS_URL}>
              West Peek Productions
            </a>
          </p>
          <LegalLinks compact />
        </div>
      </footer>
    );
  }

  if (variant === "venue") {
    return (
      <footer className={`px-5 py-8 text-xs text-brand-muted ${className}`}>
        <div className="mx-auto max-w-7xl rounded-3xl border border-brand-line bg-white p-5">
          <p>
            This virtual venue is powered by{" "}
            <a className="font-bold text-brand-black underline-offset-4 hover:underline" href={WEST_PEEK_LIVE_URL}>
              West Peek Live
            </a>{" "}
            and produced by{" "}
            <a className="font-bold text-brand-black underline-offset-4 hover:underline" href={WEST_PEEK_PRODUCTIONS_URL}>
              West Peek Productions
            </a>
            .
          </p>
          <div className="mt-3"><LegalLinks compact /></div>
        </div>
      </footer>
    );
  }

  return (
    <footer className={`border-t border-brand-line bg-brand-ash px-5 py-8 text-sm text-brand-muted ${className}`}>
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="font-bold text-brand-black">
            Powered by{" "}
            <a className="underline-offset-4 hover:underline" href={WEST_PEEK_LIVE_URL}>
              West Peek Live
            </a>{" "}
            · Produced by{" "}
            <a className="underline-offset-4 hover:underline" href={WEST_PEEK_PRODUCTIONS_URL}>
              West Peek Productions
            </a>
          </p>
          <p className="mt-2 text-xs">© {year} West Peek Productions LLC. All rights reserved.</p>
        </div>
        <LegalLinks />
      </div>
    </footer>
  );
}
