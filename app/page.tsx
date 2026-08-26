import type { Metadata } from "next";
import HomePage from "../features/home/components/HomePage";

export const metadata: Metadata = {
  title: "Sell Unwanted Items in Nigeria for Free | Hollyway Global",
  description:
    "List unwanted household items, furniture, electronics, vehicles, imported stock, agro products and handmade crafts for free. Hollyway Global connects sellers with buyers across Nigeria.",
  keywords: [
    "sell unwanted items Nigeria",
    "free listing Nigeria",
    "decluttering marketplace",
    "distress sale Nigeria",
    "relocation clearance",
    "imported stock clearance",
    "sell furniture electronics cars Nigeria",
    "agro products and handmade crafts",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    title: "Sell Unwanted Items in Nigeria for Free | Hollyway Global",
    description:
      "Turn unwanted items, relocation goods, distress-sale assets and excess stock into new opportunities with Hollyway Global Quick Sales.",
    images: [{ url: "/site-logo.png", width: 1672, height: 941, alt: "Hollyway Global Quick Sales marketplace" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sell Unwanted Items in Nigeria | Hollyway Global",
    description: "Free listings for decluttering, distress sales, imported stock, agro products and crafts across Nigeria.",
    images: ["/site-logo.png"],
  },
};

export default function Home() {
  return <HomePage />;
}
