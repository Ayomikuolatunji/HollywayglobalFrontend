import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://hollywayglobal.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Sell Unwanted Items in Nigeria for Free | Hollyway Global Quick Sales",
    template: "%s | Hollyway Global Quick Sales",
  },
  description:
    "Sell unwanted items in Nigeria for free, clear a home or office, move relocation goods, liquidate excess stock, and connect with ready buyers through Hollyway Global Quick Sales.",
  keywords: [
    "sell items in Nigeria",
    "quick sales Nigeria",
    "decluttering marketplace Nigeria",
    "distress sale Nigeria",
    "relocation clearance Nigeria",
    "wanted item request Nigeria",
    "buy used items Nigeria",
    "sell furniture Nigeria",
    "sell electronics Nigeria",
    "distress sale Lagos",
    "relocation sale Nigeria",
    "importer clearance stock Nigeria",
    "WhatsApp marketplace Nigeria",
    "Hollyway Global",
  ],
  applicationName: "Hollyway Global Quick Sales",
  creator: "Hollyway Global",
  publisher: "Hollyway Global",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Hollyway Global Quick Sales",
    title: "Sell Unwanted Items in Nigeria | Hollyway Global Quick Sales",
    description:
      "Nigeria's quick-sales marketplace for decluttering, distress sales, relocation clearance, importer stock and wanted item requests.",
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
  "@graph": [
    {
      "@type": "Organization",
      name: "Hollyway Global",
      alternateName: "Hollyway Global Quick Sales",
      url: siteUrl,
      logo: `${siteUrl}/site-logo.png`,
      email: "contact@hollywayglobal.com",
      telephone: "+2347015585967",
      areaServed: { "@type": "Country", name: "Nigeria" },
      knowsAbout: ["Quick sales", "Decluttering", "Distress sales", "Relocation clearance", "Escrow and logistics"],
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
    },
    {
      "@type": "WebSite",
      name: "Hollyway Global Quick Sales",
      url: siteUrl,
      inLanguage: "en-NG",
      description: "Sell unwanted items and connect with buyers across Nigeria.",
    },
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
