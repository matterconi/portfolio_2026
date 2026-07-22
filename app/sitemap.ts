import type { MetadataRoute } from "next";

const siteUrl = "https://matteomarconi.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date("2026-07-22"),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/projects`,
      lastModified: new Date("2026-07-22"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
