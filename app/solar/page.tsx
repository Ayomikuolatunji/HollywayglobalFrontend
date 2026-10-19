import type { Metadata } from "next";
import SolarPage from "../../features/solar/pages/SolarPage";

export const metadata: Metadata = {
  title: "Solar systems for homes and businesses in Nigeria",
  description: "Explore Hollyway Global Solar starting points from Pocket Power to commercial and industrial high-voltage systems, then request a load assessment.",
  keywords: ["solar panels Nigeria", "solar inverter Lagos", "solar battery Nigeria", "commercial solar systems Nigeria"],
  alternates: { canonical: "/solar" },
  openGraph: {
    title: "Hollyway Global Solar systems",
    description: "Choose a Solar starting point for your home, shop, office or larger property and request an assessment.",
    url: "https://hollywayglobal.com/solar",
    images: [{ url: "/site-logo.png", width: 1672, height: 941, alt: "Hollyway Global Solar" }],
  },
};

export default SolarPage;
