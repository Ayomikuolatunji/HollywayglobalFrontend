import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hollyway Global — Quick Cash. Sell Fast.",
  description:
    "Nigeria's marketplace for decluttering, distress sales, relocation clearance and quick liquidation.",
  icons: {
    icon: "/site-logo.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
