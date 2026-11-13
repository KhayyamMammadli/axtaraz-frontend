"use client";

import { useState, type MouseEvent } from "react";
import Link from "next/link";
import { Heart, MapPin, Pencil, Trash2 } from "lucide-react";
import type { Listing } from "./data";
import { useProductFavorites, toggleProductFavorite } from "@/features/favorites/product-favorites";

type ListingCardProps = { listing: Listing; initiallySaved?: boolean; badges?: string[]; onRemoveFavorite?: () => void; onEdit?: () => void; onDelete?: () => void };

export function ListingCard({ listing, initiallySaved = false, badges = listing.adType === "lost" ? ["İTKİN"] : listing.adType === "wanted" ? ["AXTARILIR"] : ["İTKİN", "AXTARILIR"], onRemoveFavorite, onEdit, onDelete }: ListingCardProps) {
  const favorites = useProductFavorites();
  const saved = favorites.ids.includes(Number(listing.id));
  const busy = favorites.pending.includes(Number(listing.id));
  const [favoriteError, setFavoriteError] = useState("");
  const href = `/product/${listing.slug}`;
  function openListing(event: MouseEvent<HTMLAnchorElement>) {
    if (!window.matchMedia("(min-width: 768px)").matches && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) event.currentTarget.target = "_self";
    else event.currentTarget.target = "_blank";
  }
  async function toggleSaved() {
    setFavoriteError("");
    try { await toggleProductFavorite(Number(listing.id)); }
    catch (error) { setFavoriteError(error instanceof Error ? error.message : "Favorit yenilənmədi."); }
  }
  return <article className="listing-card">
    <div className="listing-photo">
      <Link href={href} target="_blank" rel="noopener noreferrer" onClick={openListing} aria-label={listing.title}><img src={listing.image} alt={listing.title} loading="lazy" /></Link>
      {badges.length > 0 && <div className="listing-badges">{badges.map((badge) => <span key={badge}>{(badge === "İTKİN" || badge === "AXTARILIR") && <i className="listing-badge-icon" aria-hidden="true">{badge === "İTKİN" ? "\uf06a" : "\uf002"}</i>}{badge}</span>)}</div>}
      {(onEdit || onDelete) && <div className="listing-owner-actions">
        {onEdit && <button type="button" onClick={onEdit} aria-label="Elanı redaktə et"><Pencil size={17}/></button>}
        {onDelete && <button type="button" onClick={onDelete} aria-label="Elanı sil"><Trash2 size={17}/></button>}
      </div>}
      <button className={`favorite-button ${saved ? "is-saved" : ""}`} type="button" aria-label={onRemoveFavorite ? "Favoritlərdən sil" : saved ? "Seçilmişlərdən çıxar" : "Seçilmişlərə əlavə et"} disabled={busy} aria-busy={busy} aria-pressed={saved} onClick={toggleSaved}><Heart size={19} fill="currentColor" /></button>
    </div>
    {favoriteError && <p className="favorite-action-error" role="alert">{favoriteError}</p>}
    <div className="listing-info">
      <p className="listing-price">{listing.price}</p><Link className="listing-title" href={href} target="_blank" rel="noopener noreferrer" onClick={openListing}>{listing.title}</Link>
      <div className="listing-meta">{listing.location && <><span><MapPin size={14} />{listing.location}</span><i /></>}<span>{listing.age}</span><span className="listing-markers" aria-label="Premium, VIP və təcili"><span className="listing-service-icon" role="img" aria-label="Premium">&#xf521;</span><span className="listing-service-icon" role="img" aria-label="VIP">&#xf3a5;</span><span className="listing-service-icon" role="img" aria-label="Təcili">&#xf0e7;</span></span></div>
    </div>
  </article>;
}
