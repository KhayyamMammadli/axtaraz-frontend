"use client";

import { useState } from "react";
import styles from "./favorites.module.css";
import { ListingCard } from "@/features/listings/listing-card";
import type { Listing } from "@/features/listings/data";
import { OwnershipCard, type OwnershipCardData } from "@/features/ownerships/ownership-card";
import { PostCard } from "@/features/posts/post-card";
import type { BlogPost } from "@/features/posts/api";

type Tab = "listings" | "businesses" | "blogs";
export function FavoritesPage({ listings, businesses, posts }: { listings: Listing[]; businesses: OwnershipCardData[]; posts: BlogPost[] }) {
  const [tab, setTab] = useState<Tab>("listings");
  const [savedListings, setSavedListings] = useState(listings);
  const [savedBusinesses, setSavedBusinesses] = useState(businesses);
  const [savedPosts, setSavedPosts] = useState(posts);
  const tabs: { id: Tab; title: string; count: number }[] = [
    { id: "listings", title: "Elanlar", count: savedListings.length },
    { id: "businesses", title: "Bizneslər", count: savedBusinesses.length },
    { id: "blogs", title: "Bloqlar", count: savedPosts.length },
  ];
  return <div className={`page-shell-wide ${styles.page}`}>
    <h1 className={styles.title}>Favoritlər</h1>
    <div className={styles.tabs} role="tablist" aria-label="Favorit kateqoriyaları">{tabs.map((item) =>
      <button key={item.id} role="tab" aria-selected={tab === item.id} className={tab === item.id ? styles.activeTab : ""} onClick={() => setTab(item.id)}>{item.title}<span>{item.count}</span></button>
    )}</div>
    {tab === "listings" && <div className={`${styles.grid} listing-grid `}>{savedListings.map((listing, i) => <ListingCard key={listing.id} listing={listing} initiallySaved badges={i === 0 ? ["İTKİN", "AXTARILIR"] : []} onRemoveFavorite={() => setSavedListings((items) => items.filter((item) => item.id !== listing.id))} />)}</div>}
    {tab === "businesses" && <div className={`${styles.grid} business-grid`}>{savedBusinesses.map((business) => <OwnershipCard key={business.id} ownership={business} onRemoveFavorite={() => setSavedBusinesses((items) => items.filter((item) => item.id !== business.id))} />)}</div>}
    {tab === "blogs" && <div className={`${styles.grid} ${styles.blogGrid}`}>{savedPosts.map((post) => <PostCard key={post.id} post={post} onRemoveFavorite={() => setSavedPosts((items) => items.filter((item) => item.id !== post.id))} />)}</div>}
    {((tab === "listings" && !savedListings.length) || (tab === "businesses" && !savedBusinesses.length) || (tab === "blogs" && !savedPosts.length)) && <p className={styles.empty}>Bu bölmədə favorit yoxdur.</p>}
  </div>;
}
