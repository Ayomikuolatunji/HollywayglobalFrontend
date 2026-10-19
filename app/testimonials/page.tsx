import type { Metadata } from "next";
import TestimonialsPage from "../../features/testimonials/pages/TestimonialsPage";

export const metadata: Metadata = {
  title: "Customer stories",
  description: "Read approved customer stories from Hollyway Global marketplace and service experiences.",
  alternates: { canonical: "/testimonials" },
  openGraph: {
    title: "Hollyway Global customer stories",
    description: "Approved stories from Hollyway Global customers.",
    url: "https://hollywayglobal.com/testimonials",
    images: [{ url: "/site-logo.png", width: 1672, height: 941, alt: "Hollyway Global Quick Sales marketplace" }],
  },
};

export default TestimonialsPage;
