import type { Metadata } from "next";
import { getProducts } from "@/features/listings/api";
import { getPosts } from "@/features/posts/api";
import { favoriteBusinesses } from "@/features/ownerships/favorite-data";
import { FavoritesPage } from "@/features/favorites/favorites-page";

export const revalidate = 60;
export const metadata: Metadata = { title: "Favoritlər", description: "Seçilmiş elanlar, bizneslər və bloqlar", alternates: { canonical: "/favorites" } };

export default async function Page() {
  const [products, posts] = await Promise.all([getProducts(), getPosts()]);
  const favorites = ["100", "101"].map((id) => products.find((item) => item.id === id)).filter((item) => item !== undefined);
  return <FavoritesPage listings={favorites} businesses={favoriteBusinesses} posts={posts.slice(0, 1)} />;
}
