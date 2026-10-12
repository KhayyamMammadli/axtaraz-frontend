import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, Heart, MapPin, MessageCircle, ShieldCheck } from "lucide-react";
import { listings } from "@/features/listings/data";

type Props = { params: Promise<{ slug: string }> };

function findListing(slug: string) {
  const id = slug.split("-").at(-1);
  return listings.find((item) => item.id.split("-").at(-1) === id);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const listing = findListing(slug);
  return listing ? { title: listing.title, description: listing.detail, openGraph: { type: "website", images: [listing.image] } } : { title: "Elan tapılmadı" };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const listing = findListing(slug);
  if (!listing) notFound();
  const schema = { "@context": "https://schema.org", "@type": "Product", name: listing.title, description: listing.detail, image: listing.image, offers: { "@type": "Offer", priceCurrency: "AZN", price: listing.price.replace(/[^0-9]/g, ""), availability: "https://schema.org/InStock", url: `https://axtar.az/product/${slug}` } };
  return <div className="page-shell detail-page"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /><nav className="breadcrumbs"><Link href="/">Ana səhifə</Link><span>›</span><Link href="/full-search">{listing.category}</Link><span>›</span><span>{listing.title}</span></nav><div className="detail-layout"><section className="detail-main"><div className="detail-title-row"><div><span className="eyebrow">{listing.category}</span><h1>{listing.title}</h1></div><button className="favorite-detail" aria-label="Seçilmişlərə əlavə et"><Heart size={20} /></button></div><div className="detail-photo"><img src={listing.image} alt={listing.title} /></div><div className="detail-stats"><span><MapPin size={16} />{listing.location}</span><span>№ {listing.id.split("-").at(-1)}</span><span>{listing.age}</span></div><section className="description-card"><h2>Elanın təsviri</h2><p>{listing.detail}</p></section><section className="safety-card"><ShieldCheck size={22} /><div><h2>Təhlükəsiz alış-veriş üçün məsləhətlər</h2><p>Məhsulu almadan əvvəl yerində yoxlayın. Ödənişi yalnız satıcı ilə razılaşdıqdan sonra edin.</p></div></section></section><aside className="seller-card"><strong className="detail-price">{listing.price}</strong><div className="seller-identity"><span className="seller-avatar">A</span><span><b>Rəsmi satıcı</b><small><BadgeCheck size={13} /> Təsdiqlənmiş profil</small></span></div><div className="seller-location"><MapPin size={16} />{listing.location}, Azərbaycan</div><Link className="button-primary seller-message" href="/login"><MessageCircle size={17} /> Mesaj yaz</Link><a className="seller-phone" href="tel:+994555444444">☎ &nbsp; (055) 544-44-44</a></aside></div></div>;
}
