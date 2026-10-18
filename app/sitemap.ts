import type { MetadataRoute } from "next";
import { listings } from "@/features/listings/data";
import { getPosts } from "@/features/posts/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://axtar.az";
  const [posts] = await Promise.all([getPosts()]);
  const productRoutes = listings.map((listing) => ({
    url: `${base}/product/${listing.slug}`,
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));
  const postRoutes = posts.map((post) => ({
    url: `${base}/post/${post.slug}`,
    lastModified: post.created_at ? new Date(post.created_at) : undefined,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));
  return [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/full-search`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${base}/ownerships`, changeFrequency: "daily", priority: 0.7 },
    { url: `${base}/posts`, changeFrequency: "weekly", priority: 0.6 },
    ...productRoutes,
    ...postRoutes,
  ];
}
