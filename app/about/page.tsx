import type { Metadata } from "next";
import AboutPage from "../../features/about/pages/AboutPage";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Hollyway Global, a Nigerian quick-sales marketplace for decluttering, distress sales, relocation clearance, importer stock and safer buyer-seller transactions in Nigeria.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Hollyway Global Quick Sales",
    description:
      "The story, leadership and marketplace mission behind Hollyway Global Quick Sales.",
    url: "https://hollywayglobal.com/about",
    images: [
      {
        url: "/admin.jpeg",
        width: 712,
        height: 1072,
        alt: "Hollyway Global CEO in an aviation maintenance setting",
      },
    ],
  },
};

export default AboutPage;
