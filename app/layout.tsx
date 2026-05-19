import "./globals.css";
import type { ReactNode } from "react";
import { PRODUCT_NAME, BRAND_TAGLINE } from "@/lib/brand";

export const metadata = {
  title: PRODUCT_NAME,
  description: BRAND_TAGLINE,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
