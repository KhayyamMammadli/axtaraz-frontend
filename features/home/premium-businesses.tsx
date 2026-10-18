"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowRight, Check, CreditCard, Grid2X2, MapPin, Star, Truck, ChevronLeft, ChevronRight } from "lucide-react";

const ownershipImage = "https://storage.axtar.az/uploads/ownerships_main/min/2026/06/05/e7aac09e3bdeefa0c19f2791ddba60dd.png";

const premiumBusinesses = [
  { name: "template 2", listingCount: 0 },
  { name: "Test MMC", listingCount: 0 },
  { name: "TEst 2", listingCount: 0 },
  { name: "template 2", listingCount: 0 },
];

function BusinessCard({ name, listingCount }: (typeof premiumBusinesses)[number]) {
  return (
    <article className="business-card">
      <Link href="/ownerships" className="business-cover" aria-label={`${name} biznes profilinə bax`}>
        <img src={ownershipImage} alt={`${name} biznesinin banneri`} />
      </Link>
      <Link href="/ownerships" className="business-avatar" aria-label={`${name} profilinə bax`}>
        <img src={ownershipImage} alt="" />
      </Link>
      <div className="business-toolbar">
        <span className="business-star" role="img" aria-label="Premium biznes">
          <Star size={22} fill="currentColor" aria-hidden="true" />
        </span>
        <Link href="/ownerships" className="outline-button">İzlənir</Link>
      </div>
      <div className="business-body">
        <h3><Link href="/ownerships">{name}</Link></h3>
        <span className="business-count"><Grid2X2 size={17} aria-hidden="true" />{listingCount} elan</span>
      </div>
      <div className="business-features" aria-label="Biznes məlumatları">
        <span aria-label="Ünvan"><MapPin size={22} aria-hidden="true" /></span>
        <span aria-label="Çatdırılma"><Truck size={23} aria-hidden="true" /></span>
        <span aria-label="Ödəniş üsulları"><CreditCard size={23} aria-hidden="true" /></span>
        <span className="business-online" aria-label="Onlayn"><Check size={13} aria-hidden="true" /></span>
      </div>
    </article>
  );
}

export function PremiumBusinesses() {
  const trackRef = useRef<HTMLDivElement>(null);
  const scroll = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * Math.max(track.clientWidth * 0.85, 260), behavior: "smooth" });
  };

  return (
    <section className="business-section" aria-labelledby="premium-businesses-title">
      <div className="section-heading">
        <h2 id="premium-businesses-title"><span className="heading-emoji" aria-hidden="true">👑</span> Premium Bizneslər</h2>
        <Link href="/ownerships">Hamısına göstər <ArrowRight size={20} aria-hidden="true" /></Link>
      </div>
      <div className="business-carousel">
        <button type="button" aria-label="Əvvəlki premium bizneslər" onClick={() => scroll(-1)}>
          <ChevronLeft size={20} aria-hidden="true" />
        </button>
        <div
          className="business-grid"
          ref={trackRef}
          role="region"
          aria-label="Premium bizneslər"
          aria-roledescription="karusel"
        >
          {premiumBusinesses.map((business, index) => (
            <BusinessCard key={`${business.name}-${index}`} {...business} />
          ))}
        </div>
        <button type="button" aria-label="Növbəti premium bizneslər" onClick={() => scroll(1)}>
          <ChevronRight size={20} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
