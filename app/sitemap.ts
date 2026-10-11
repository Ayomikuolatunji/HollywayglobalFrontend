import type { MetadataRoute } from "next";

const siteUrl = "https://hollywayglobal.com";
const lastModified = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteUrl}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
      images: [`${siteUrl}/site-logo.png`],
    },
    {
      url: `${siteUrl}/about`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
      images: [`${siteUrl}/admin.jpeg`],
    },
    {
      url: `${siteUrl}/testimonials`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
      images: [`${siteUrl}/site-logo.png`],
    },
  ];
}
