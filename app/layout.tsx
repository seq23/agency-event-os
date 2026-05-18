import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Agency Event OS",
  description: "A multi-client virtual event production platform for agencies.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
