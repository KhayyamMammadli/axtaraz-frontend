"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, MapPin, Crown, Gem, Zap } from "lucide-react";
import type { Listing } from "./data";

export function ListingCard({ listing }: { listing: Listing }) {
  const [saved, setSaved] = useState(false);
  const href = `/product/${listing.slug}`;
  const level = listing.level?.toLowerCase() ?? "";

  return (
    <article className="listing-card">
      <div className="listing-photo">
        <Link href={href} aria-label={listing.title}>
          <img src={listing.image} alt={listing.title} loading="lazy" />
        </Link>
        <button
          className={`favorite-button ${saved ? "is-saved" : ""}`}
          type="button"
          aria-label={saved ? "Seçilmişlərdən çıxar" : "Seçilmişlərə əlavə et"}
          onClick={() => setSaved(!saved)}
        >
          <Heart size={19} fill="currentColor" />
        </button>
      </div>
      <div className="listing-info">
        <p className="listing-price">{listing.price}</p>
        <Link className="listing-title" href={href}>{listing.title}</Link>
        <div className="listing-meta">
          {listing.location && (
            <>
              <span><MapPin size={14} />{listing.location}</span>
              <i />
            </>
          )}
          <span>{listing.age}</span>
          <span className="listing-markers" aria-label="Elan səviyyəsi">
            {level === "premium" && <Crown size={17} fill="currentColor" aria-label="Premium" />}
            {level === "vip" && <Gem size={16} fill="currentColor" aria-label="VIP" />}
            {level === "urgent" && <Zap size={17} fill="currentColor" aria-label="Təcili" />}
          </span>
        </div>
      </div>
    </article>
  );
}
