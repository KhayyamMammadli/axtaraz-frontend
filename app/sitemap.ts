import type { MetadataRoute } from "next";
import { listings } from "@/features/listings/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://axtar.az";
  const productRoutes = listings.map((listing) => {
    const slug = listing.title.toLocaleLowerCase("az").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const id = listing.id.split("-").at(-1);
    return { url: `${base}/product/${slug}-${id}`, changeFrequency: "daily" as const, priority: 0.7 };
  });
  return [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/full-search`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${base}/ownerships`, changeFrequency: "daily", priority: 0.7 },
    { url: `${base}/posts`, changeFrequency: "weekly", priority: 0.6 },
    ...productRoutes,
  ];
}
