import type { Metadata } from "next";
import "./globals.css";
import ToastProvider from "../components/ui/ToastProvider";
import { PublicContactProvider } from "../components/config/PublicContactProvider";

const siteUrl = "https://hollywayglobal.com";
const siteName = "Hollyway Global Quick Sales";
const socialImage = {
  url: `${siteUrl}/site-logo.png`,
  width: 1672,
  height: 941,
  alt: "Hollyway Global Quick Sales marketplace logo",
};

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
    "sell car in Nigeria",
    "sell furniture in Lagos",
    "sell electronics in Nigeria",
    "buy used items in Nigeria",
    "imported goods clearance Nigeria",
    "estate clearance Nigeria",
    "agro products marketplace Nigeria",
    "handmade crafts marketplace Nigeria",
    "quick liquidation Nigeria",
    "sell items in Lagos",
    "sell items in Abuja",
    "Hollyway Global",
  ],
  applicationName: siteName,
  creator: "Hollyway Global",
  publisher: "Hollyway Global",
  openGraph: {
    type: "website",
    siteName,
    title: "Sell Unwanted Items in Nigeria | Hollyway Global Quick Sales",
    description:
      "Nigeria's quick-sales marketplace for decluttering, distress sales, relocation clearance, importer stock and wanted item requests.",
    locale: "en_NG",
    images: [socialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hollyway Global Quick Sales | Sell Fast Across Nigeria",
    description: "Turn unwanted items into quick cash and find what you need across Nigeria.",
    images: [socialImage.url],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/brand-logo.png",
    apple: "/brand-logo.png",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Hollyway Global",
      alternateName: "Hollyway Global Quick Sales",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/brand-logo.png`,
        width: 1254,
        height: 1254,
      },
      image: socialImage.url,
      areaServed: { "@type": "Country", name: "Nigeria" },
      knowsAbout: ["Quick sales", "Decluttering", "Distress sales", "Relocation clearance", "Escrow and logistics"],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: "Hollyway Global Quick Sales",
      url: siteUrl,
      inLanguage: "en-NG",
      description: "Sell unwanted items and connect with buyers across Nigeria.",
      publisher: { "@id": `${siteUrl}/#organization` },
      image: socialImage.url,
    },
    {
      "@type": "WebPage",
      "@id": `${siteUrl}/#webpage`,
      name: "Sell Unwanted Items in Nigeria | Hollyway Global Quick Sales",
      url: siteUrl,
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: { "@id": `${siteUrl}/#organization` },
      primaryImageOfPage: { "@type": "ImageObject", url: socialImage.url, width: socialImage.width, height: socialImage.height },
      inLanguage: "en-NG",
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen overflow-x-hidden bg-[#eef1f5] font-[DM_Sans] text-[#0b1830]">
        <PublicContactProvider>
          <ToastProvider>{children}</ToastProvider>
        </PublicContactProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </body>
    </html>
  );
}
