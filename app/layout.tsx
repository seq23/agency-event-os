import "./globals.css";
import type { ReactNode } from "react";
import { PRODUCT_NAME, BRAND_TAGLINE } from "@/lib/brand";
import { GlobalWestPeekLogoLink } from "@/components/brand/GlobalWestPeekLogoLink";

export const dynamic = "force-dynamic";

export const metadata = {
  title: PRODUCT_NAME,
  description: BRAND_TAGLINE,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body><GlobalWestPeekLogoLink />{children}</body>
    </html>
  );
}
