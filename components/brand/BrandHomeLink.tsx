import Link from "next/link";
import { WestPeekLiveWordmark } from "@/components/brand/WestPeekLiveWordmark";

type BrandHomeLinkProps = {
  size?: "sm" | "md" | "lg";
  inverse?: boolean;
  className?: string;
};

export function BrandHomeLink({ size = "md", inverse = false, className = "" }: BrandHomeLinkProps) {
  return (
    <Link
      href="https://westpeek.live"
      className={`inline-flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2 ${className}`}
      aria-label="Open West Peek Live home page"
    >
      <WestPeekLiveWordmark size={size} inverse={inverse} />
    </Link>
  );
}
