"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import { CircleCheck, CreditCard, MapPin, Star, Trash2, Truck } from "lucide-react";

export type OwnershipCardData = { id: string; name: string; count: string; image: string };

export function OwnershipCard({ ownership, onRemoveFavorite }: { ownership: OwnershipCardData; onRemoveFavorite?: () => void }) {
  function openBusiness(event: MouseEvent<HTMLElement>) {
    const link = (event.target as Element).closest<HTMLAnchorElement>("a");
    if (link && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
      link.target = window.matchMedia("(max-width: 640px)").matches ? "_self" : "_blank";
    }
  }
  return <article className="business-card" onClickCapture={openBusiness}>
    <Link className="business-cover" href={`/ownerships/${ownership.id}`} target="_blank" rel="noopener noreferrer"><img src={ownership.image} alt={ownership.name} /></Link>
    <div className="business-avatar"><img src={ownership.image} alt="" /></div>
    <div className="business-toolbar">
      {onRemoveFavorite
        ? <button className="favorite-remove-button" type="button" aria-label={`${ownership.name} favoritlərdən sil`} onClick={onRemoveFavorite}><Trash2 size={17} /></button>
        : <span className="business-star"><Star size={17} fill="currentColor" /></span>}
      <Link className="outline-button" href={`/ownerships/${ownership.id}`} target="_blank" rel="noopener noreferrer">İzlə</Link>
    </div>
    <div className="business-body"><h2><Link href={`/ownerships/${ownership.id}`} target="_blank" rel="noopener noreferrer">{ownership.name}</Link></h2><span className="business-count">{ownership.count} elan</span></div>
    <div className="business-features"><span><MapPin size={18}/></span><span><Truck size={18}/></span><span><CreditCard size={18}/></span><span className="status-dot"><CircleCheck size={16} fill="currentColor"/></span></div>
  </article>;
}
