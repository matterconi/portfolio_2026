import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/github-activity",
    },
    sitemap: "https://matteomarconi.com/sitemap.xml",
    host: "https://matteomarconi.com",
  };
}
