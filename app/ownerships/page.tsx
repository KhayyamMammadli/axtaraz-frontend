import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, Star } from "lucide-react";

export const metadata: Metadata = { title: "Bizneslər", description: "Axtar.az-da fəaliyyət göstərən biznes və mağazaları kəşf edin.", alternates: { canonical: "/ownerships" } };

const image = "https://storage.axtar.az/uploads/ownerships_main/min/2026/06/05/e7aac09e3bdeefa0c19f2791ddba60dd.png";
const items = ["Design Council Scotland", "Test MMC", "DCS Studio", "Alpha Təhlükəsizlik", "Yeni Biznes", "Baku Market"];
export default function OwnershipsPage() {
  return <div className="page-shell directory-page"><nav className="breadcrumbs"><Link href="/">Ana səhifə</Link><span>›</span><span>Bizneslər</span></nav><div className="section-heading"><div><span className="eyebrow">Seçilmiş mağazalar</span><h1>Bizneslər</h1><p>Axtar.az-da rəsmi biznes profillərini izləyin.</p></div><Link href="/full-search">Elanlara keç <ArrowRight size={15} /></Link></div><div className="business-grid directory-business-grid">{items.map((name, i) => <article className="business-card" key={name}><Link className="business-cover" href="/full-search"><img src={image} alt={`${name} cover`} /></Link><div className="business-avatar"><img src={image} alt="" /></div><div className="business-toolbar"><span className="business-star"><Star size={17} fill="currentColor" /></span><Link className="outline-button" href="/login">İzlə</Link></div><div className="business-body"><h2>{name}</h2><span className="business-count">▦ {i * 4} elan</span></div><div className="business-features"><span><MapPin size={16} /></span><span>♧</span><span>▤</span><span className="status-dot" /></div></article>)}</div></div>;
}
