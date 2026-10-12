"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, MapPin } from "lucide-react";
import type { Listing } from "./data";

export function ListingCard({ listing }: { listing: Listing }) {
  const [saved, setSaved] = useState(false);
  const slug = listing.title.toLocaleLowerCase("az").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return (
    <article className="listing-card">
      <div className="listing-photo">
        <Link href={`/product/${slug}-${listing.id.split("-").pop()}`} aria-label={listing.title}>
          <img src={listing.image} alt={listing.title} loading="lazy" />
        </Link>
        <div className="listing-badges"><span>● Təklif edilir</span><span>⌕ {listing.category}</span></div>
        <button className={`favorite-button ${saved ? "is-saved" : ""}`} type="button" aria-label={saved ? "Seçilmişlərdən çıxar" : "Seçilmişlərə əlavə et"} onClick={() => setSaved(!saved)}>
          <Heart size={19} fill={saved ? "currentColor" : "none"} />
        </button>
        <span className="image-count">▧ 1/1</span>
      </div>
      <div className="listing-info">
        <p className="listing-price">{listing.price}</p>
        <Link className="listing-title" href={`/product/${slug}-${listing.id.split("-").pop()}`}>{listing.title}</Link>
        <div className="listing-meta"><span><MapPin size={14} />{listing.location}</span><span>{listing.age}</span></div>
        <div className="listing-actions"><span>♡ 0</span><span>▣</span><span>▤</span><span className="online-dot" aria-label="Satıcı aktivdir" /></div>
      </div>
    </article>
  );
}
