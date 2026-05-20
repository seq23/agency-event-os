import { WestPeekProductionsLogo } from "@/components/brand/WestPeekProductionsLogo";

export function GlobalWestPeekLogoLink() {
  return (
    <a
      href="https://westpeek.live"
      className="fixed left-4 top-4 z-[1000] inline-flex rounded-2xl border border-white/70 bg-white/90 p-2 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-brand print:hidden"
      aria-label="West Peek Productions home"
    >
      <WestPeekProductionsLogo size="sm" />
    </a>
  );
}
