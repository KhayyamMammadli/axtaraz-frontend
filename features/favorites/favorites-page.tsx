"use client";

import { useEffect, useState } from "react";
import styles from "./favorites.module.css";
import { ListingCard } from "@/features/listings/listing-card";
import { useProductFavorites } from "./product-favorites";
import type { Listing } from "@/features/listings/data";
import { OwnershipCard, type OwnershipCardData } from "@/features/ownerships/ownership-card";
import { PostCard } from "@/features/posts/post-card";
import type { BlogPost } from "@/features/posts/api";

type Tab = "listings" | "businesses" | "blogs";
export function FavoritesPage({ businesses, posts }: { businesses: OwnershipCardData[]; posts: BlogPost[] }) {
  const [tab, setTab] = useState<Tab>("listings");
  const favorites = useProductFavorites();
  const idsKey = favorites.ids.join(",");
  const [result, setResult] = useState<{key:string; products:Listing[]; error:string; loading:boolean}>({key:"",products:[],error:"",loading:false});
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    if (!favorites.ready) return;
    if (!idsKey) { setResult({key:"",products:[],error:"",loading:false}); return; }
    const controller = new AbortController();
    setResult(current=>({...current,key:idsKey,loading:true,error:""}));
    fetch(`/api/product-favorites?${new URLSearchParams({ids:idsKey})}`,{cache:"no-store",signal:controller.signal}).then(async response=>{ const payload=await response.json(); if (!response.ok || !Array.isArray(payload.products)) throw new Error(payload.message || "Favoritlər yüklənmədi."); return payload.products as Listing[]; }).then(products=>{if(!controller.signal.aborted)setResult({key:idsKey,products,error:"",loading:false});},error=>{if(!controller.signal.aborted)setResult({key:idsKey,products:[],error:error.message,loading:false});});
    return ()=>controller.abort();
  },[idsKey,favorites.ready,retry]);
  const savedListings = result.products.filter(item=>favorites.ids.includes(Number(item.id)));
  const loading = !favorites.ready || (!!idsKey && (result.loading || result.key !== idsKey));
  const [savedBusinesses, setSavedBusinesses] = useState(businesses);
  const [savedPosts, setSavedPosts] = useState(posts);
  const tabs: { id: Tab; title: string; count: number }[] = [
    { id: "listings", title: "Elanlar", count: favorites.ids.length },
    { id: "businesses", title: "Bizneslər", count: savedBusinesses.length },
    { id: "blogs", title: "Bloqlar", count: savedPosts.length },
  ];
  return <div className={`page-shell-wide ${styles.page}`}>
    <h1 className={styles.title}>Favoritlər</h1>
    <div className={styles.tabs} role="tablist" aria-label="Favorit kateqoriyaları">{tabs.map((item) =>
      <button key={item.id} role="tab" aria-selected={tab === item.id} className={tab === item.id ? styles.activeTab : ""} onClick={() => setTab(item.id)}>{item.title}<span>{item.count}</span></button>
    )}</div>
    {tab === "listings" && loading && <p role="status">Favoritlər yüklənir...</p>}
    {tab === "listings" && result.error && <div role="alert"><p>{result.error}</p><button type="button" onClick={()=>setRetry(value=>value+1)}>Yenidən cəhd et</button></div>}
    {tab === "listings" && !loading && !result.error && <div className={`${styles.grid} listing-grid `}>{savedListings.map((listing, i) => <ListingCard key={listing.id} listing={listing} initiallySaved badges={i === 0 ? ["İTKİN", "AXTARILIR"] : []} />)}</div>}
    {tab === "businesses" && <div className={`${styles.grid} business-grid`}>{savedBusinesses.map((business) => <OwnershipCard key={business.id} ownership={business} onRemoveFavorite={() => setSavedBusinesses((items) => items.filter((item) => item.id !== business.id))} />)}</div>}
    {tab === "blogs" && <div className={`${styles.grid} ${styles.blogGrid}`}>{savedPosts.map((post) => <PostCard key={post.id} post={post} onRemoveFavorite={() => setSavedPosts((items) => items.filter((item) => item.id !== post.id))} />)}</div>}
    {((tab === "listings" && !loading && !result.error && !savedListings.length) || (tab === "businesses" && !savedBusinesses.length) || (tab === "blogs" && !savedPosts.length)) && <p className={styles.empty}>Bu bölmədə favorit yoxdur.</p>}
  </div>;
}
