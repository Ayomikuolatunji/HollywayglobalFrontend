import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://hollywayglobal.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Hollyway Global Quick Sales Landing Page | Sell Fast Across Nigeria",
    template: "%s | Hollyway Global Quick Sales",
  },
  description:
    "Sell unwanted items for free, post wanted requests for ₦200, and connect with buyers and sellers across Nigeria through Hollyway Global Quick Sales.",
  keywords: [
    "sell items in Nigeria",
    "quick sales Nigeria",
    "decluttering marketplace Nigeria",
    "distress sale Nigeria",
    "relocation clearance Nigeria",
    "wanted item request Nigeria",
    "buy used items Nigeria",
    "Hollyway Global",
  ],
  applicationName: "Hollyway Global Quick Sales",
  creator: "Hollyway Global Investment Int'l Ltd.",
  publisher: "Hollyway Global Investment Int'l Ltd.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Hollyway Global Quick Sales",
    title: "Hollyway Global Quick Sales | Declutter. Sell Fast.",
    description:
      "Nigeria's marketplace for decluttering, distress sales, relocation clearance, wanted requests and quick liquidation.",
    locale: "en_NG",
    images: [{ url: "/site-logo.png", width: 1672, height: 941, alt: "Hollyway Global Quick Sales" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hollyway Global Quick Sales | Sell Fast Across Nigeria",
    description: "Turn unwanted items into quick cash and find what you need across Nigeria.",
    images: ["/site-logo.png"],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/site-logo.png",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Hollyway Global Investment Int'l Ltd.",
  alternateName: "Hollyway Global Quick Sales",
  url: siteUrl,
  logo: `${siteUrl}/site-logo.png`,
  email: "contact@hollywayglobal.com",
  telephone: "+2347015585967",
  sameAs: [
    "https://chat.whatsapp.com/Ij8dR9bkwppHQq77srTSqx",
    "https://whatsapp.com/channel/0029VbDn9GO30LKWJNk81P2M",
    "https://www.facebook.com/Hollywayglobal/",
    "https://www.facebook.com/groups/hollywayglobal",
    "https://www.instagram.com/hollywayglobal/",
    "https://www.tiktok.com/@hollywayglobal",
    "https://x.com/hollywayglobal",
    "https://www.linkedin.com/in/hollyway-global/",
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </body>
    </html>
  );
}
