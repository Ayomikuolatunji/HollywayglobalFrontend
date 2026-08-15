import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://hollywayglobal.com/sitemap.xml",
    host: "https://hollywayglobal.com",
  };
}
