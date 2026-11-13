"use client";

import Link from "next/link";
import { useRef, type MouseEvent } from "react";
import {
  Pencil,
  Trash2,
  ArrowRight,
  Check,
  CreditCard,
  Grid2X2,
  MapPin,
  Star,
  Truck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { Ownership } from "@/features/ownerships/api";

export function BusinessCard({ business, onEdit, onDelete }: { business: Ownership; onEdit?: () => void; onDelete?: () => void }) {
  const coverImage =
    business.main_image_full ||
    business.main_image ||
    business.images_full?.[0] ||
    business.images?.[0];
  const avatarImage =
    business.images?.[0] ||
    business.images_full?.[0] ||
    business.main_image ||
    business.main_image_full;
  const href = `/ownerships/${business.id}`;
  const external = true;
  function openBusiness(event: MouseEvent<HTMLAnchorElement>) {
    if (!event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
      event.currentTarget.target = window.matchMedia("(max-width: 640px)").matches ? "_self" : "_blank";
    }
  }

  return (
    <article className="business-card">
      {(onEdit || onDelete) && <div className="business-owner-actions">
        {onEdit && <button type="button" onClick={onEdit} aria-label={`${business.title} — redaktə et`}><Pencil size={17}/></button>}
        {onDelete && <button type="button" onClick={onDelete} aria-label={`${business.title} — sil`}><Trash2 size={17}/></button>}
      </div>}
      <Link
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="business-cover"
        onClick={openBusiness}
        aria-label={`${business.title} biznes profilinə bax`}
      >
        {coverImage ? (
          <img src={coverImage} alt={`${business.title} biznesinin banneri`} />
        ) : (
          <span className="business-cover-placeholder">{business.title}</span>
        )}
      </Link>
      <Link
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="business-avatar"
        onClick={openBusiness}
        aria-label={`${business.title} profilinə bax`}
      >
        {avatarImage ? <img src={avatarImage} alt="" /> : <span>{business.title.slice(0, 1)}</span>}
      </Link>
      <div className="business-toolbar">
        <span className="business-star" role="img" aria-label="Premium biznes">
          <Star size={22} fill="currentColor" aria-hidden="true" />
        </span>
        <Link
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className="outline-button"
          onClick={openBusiness}
        >
          İzlə
        </Link>
      </div>
      <div className="business-body">
        <h3>
          <Link
            href={href}
            onClick={openBusiness}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
          >
            {business.title}
          </Link>
        </h3>
        <span className="business-count">
          <Grid2X2 size={17} aria-hidden="true" />
          {business.products_count ?? 0} elan
        </span>
      </div>
      <div className="business-features" aria-label="Biznes məlumatları">
        <span aria-label={business.category?.title || "Kateqoriya"}>
          <MapPin size={22} aria-hidden="true" />
        </span>
        <span aria-label="Çatdırılma">
          <Truck size={23} aria-hidden="true" />
        </span>
        <span aria-label="Ödəniş üsulları">
          <CreditCard size={23} aria-hidden="true" />
        </span>
        <span className="business-online" aria-label="Onlayn">
          <Check size={13} aria-hidden="true" />
        </span>
      </div>
    </article>
  );
}

export function PremiumBusinessesCarousel({
  businesses,
}: {
  businesses: Ownership[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({
      left: direction * Math.max(track.clientWidth * 0.85, 260),
      behavior: "smooth",
    });
  };

  return (
    <section className="business-section" aria-labelledby="premium-businesses-title">
      <div className="section-heading">
        <h2 id="premium-businesses-title">
          <span className="heading-emoji" aria-hidden="true">👑</span>
          Premium Bizneslər
        </h2>
        <Link href="/ownerships">
          Hamısına göstər <ArrowRight size={20} aria-hidden="true" />
        </Link>
      </div>
      <div className="business-carousel">
        <button
          type="button"
          aria-label="Əvvəlki premium bizneslər"
          onClick={() => scroll(-1)}
        >
          <ChevronLeft size={20} aria-hidden="true" />
        </button>
        <div
          className="business-grid"
          ref={trackRef}
          role="region"
          aria-label="Premium bizneslər"
          aria-roledescription="karusel"
        >
          {businesses.map((business) => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>
        <button
          type="button"
          aria-label="Növbəti premium bizneslər"
          onClick={() => scroll(1)}
        >
          <ChevronRight size={20} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
