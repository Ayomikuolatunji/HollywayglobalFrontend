import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/dashboard", "/login", "/signup", "/forgot-password", "/reset-password", "/verify-email", "/escrow"] }],
    sitemap: "https://hollywayglobal.com/sitemap.xml",
    host: "https://hollywayglobal.com",
  };
}
