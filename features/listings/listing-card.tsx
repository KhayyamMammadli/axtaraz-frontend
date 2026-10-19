"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, MapPin, Crown, Gem, Zap } from "lucide-react";
import type { Listing } from "./data";

type ListingCardProps = { listing: Listing; initiallySaved?: boolean; badges?: string[]; onRemoveFavorite?: () => void };

export function ListingCard({ listing, initiallySaved = false, badges = [], onRemoveFavorite }: ListingCardProps) {
  const [saved, setSaved] = useState(initiallySaved);
  const href = `/product/${listing.slug}`;
  const level = listing.level?.toLowerCase() ?? "";
  function toggleSaved() {
    if (onRemoveFavorite && saved) onRemoveFavorite();
    else setSaved(!saved);
  }
  return <article className="listing-card">
    <div className="listing-photo">
      <Link href={href} aria-label={listing.title}><img src={listing.image} alt={listing.title} loading="lazy" /></Link>
      {badges.length > 0 && <div className="listing-badges">{badges.map((badge) => <span key={badge}>{badge}</span>)}</div>}
      <button className={`favorite-button ${saved ? "is-saved" : ""}`} type="button" aria-label={onRemoveFavorite ? "Favoritlərdən sil" : saved ? "Seçilmişlərdən çıxar" : "Seçilmişlərə əlavə et"} onClick={toggleSaved}><Heart size={19} fill="currentColor" /></button>
    </div>
    <div className="listing-info">
      <p className="listing-price">{listing.price}</p><Link className="listing-title" href={href}>{listing.title}</Link>
      <div className="listing-meta">{listing.location && <><span><MapPin size={14} />{listing.location}</span><i /></>}<span>{listing.age}</span><span className="listing-markers" aria-label="Elan səviyyəsi">{level === "premium" && <Crown size={17} fill="currentColor" aria-label="Premium" />}{level === "vip" && <Gem size={16} fill="currentColor" aria-label="VIP" />}{level === "urgent" && <Zap size={17} fill="currentColor" aria-label="Təcili" />}</span></div>
    </div>
  </article>;
}
