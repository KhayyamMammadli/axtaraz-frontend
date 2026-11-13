import type { Metadata } from "next";
import { getPosts } from "@/features/posts/api";
import { favoriteBusinesses } from "@/features/ownerships/favorite-data";
import { FavoritesPage } from "@/features/favorites/favorites-page";

export const revalidate = 60;
export const metadata: Metadata = { title: "Favoritlər", description: "Seçilmiş elanlar, bizneslər və bloqlar", alternates: { canonical: "/favorites" } };

export default async function Page() {
  const posts = await getPosts();
  return <FavoritesPage businesses={favoriteBusinesses} posts={posts.slice(0, 1)} />;
}
