import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://axtar.az";
  return [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/full-search`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${base}/ownerships`, changeFrequency: "daily", priority: 0.7 },
    { url: `${base}/posts`, changeFrequency: "weekly", priority: 0.6 },
  ];
}
