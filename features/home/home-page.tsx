import Link from "next/link";
import { ArrowRight, BadgeCheck, BriefcaseBusiness, MapPin, Star } from "lucide-react";
import { categories } from "@/features/listings/data";
import { FeedTabs } from "./feed-tabs";

const businessImage = "https://storage.axtar.az/uploads/ownerships_main/min/2026/06/05/e7aac09e3bdeefa0c19f2791ddba60dd.png";
const businesses = [
  { name: "Design Council Scotland", count: 12, town: "Bakı" },
  { name: "Test MMC", count: 0, town: "Bakı" },
  { name: "DCS Studio", count: 8, town: "Bakı" },
];

const blogs = [
  { title: "Ağıllı alış-veriş üçün 7 məsləhət", tag: "Alış-veriş", date: "10 iyun 2026", read: "5 dəq." },
  { title: "Elanınızı daha çox insana necə çatdırmalı?", tag: "Satış", date: "8 iyun 2026", read: "4 dəq." },
  { title: "Təhlükəsiz onlayn alış-veriş qaydaları", tag: "Təhlükəsizlik", date: "3 iyun 2026", read: "6 dəq." },
];

export function HomePage() {
  return (
    <div className="page-shell">
      <section className="business-section" aria-labelledby="premium-title">
        <div className="section-heading">
          <h1 id="premium-title"><span className="heading-emoji">👑</span> Premium Bizneslər</h1>
          <Link href="/ownerships">Hamısına göstər <ArrowRight size={15} /></Link>
        </div>
        <div className="business-grid">
          {businesses.map((business, index) => (
            <article className="business-card" key={business.name}>
              <Link href="/ownerships" className="business-cover">
                <img src={businessImage} alt={`${business.name} cover`} />
              </Link>
              <div className="business-avatar"><img src={businessImage} alt="" /></div>
              <div className="business-toolbar">
                <span className="business-star"><Star size={17} fill="currentColor" /></span>
                <Link href="/ownerships" className="outline-button">İzlə</Link>
              </div>
              <div className="business-body">
                <h2>{business.name}</h2>
                <span className="business-count">▦ {business.count} elan</span>
              </div>
              <div className="business-features"><span><MapPin size={16} /></span><span>♧</span><span>▤</span><span className={index === 1 ? "status-dot muted" : "status-dot"} /></div>
            </article>
          ))}
        </div>
      </section>

      <FeedTabs />

      <section className="sell-banner">
        <div className="sell-icon"><BriefcaseBusiness size={22} /></div>
        <div><span className="eyebrow">Axtar.az-da satışa başla</span><h2>Elan yerləşdir, satışların artsın.</h2><p>Məhsulunu minlərlə alıcıya göstər.</p></div>
        <Link href="/full-search?intent=create" className="button-primary">Yeni elan <ArrowRight size={17} /></Link>
      </section>

      <section className="category-section" aria-labelledby="category-title">
        <div className="section-heading"><div><span className="eyebrow">Kəşf et</span><h2 id="category-title">Kateqoriyalar</h2></div><Link href="/full-search">Bütün kateqoriyalar <ArrowRight size={15} /></Link></div>
        <div className="category-grid">
          {categories.map((category, index) => <Link className="category-tile" key={category} href={`/full-search?title=${encodeURIComponent(category)}`}><span className={`category-icon tone-${index % 6}`}>{["⌂", "◇", "◉", "✦", "▣", "✳"][index % 6]}</span><span>{category}</span><ArrowRight size={15} /></Link>)}
        </div>
      </section>

      <section className="blog-section" aria-labelledby="blog-title">
        <div className="section-heading"><div><span className="eyebrow">Bilik və ilham</span><h2 id="blog-title">Bloqlar</h2><p>Daha düzgün qərar verməyiniz üçün faydalı bloqlar</p></div><Link href="/posts">Hamısına bax <ArrowRight size={15} /></Link></div>
        <div className="blog-grid">
          {blogs.map((blog, index) => <article className="blog-card" key={blog.title}><Link className={`blog-art art-${index + 1}`} href="/posts"><span>{["Alıcılar üçün", "Satıcılar üçün", "Güvənli alış"][index]}</span><BadgeCheck size={26} /></Link><div className="blog-card-content"><span className="blog-tag">{blog.tag}</span><h3><Link href="/posts">{blog.title}</Link></h3><div className="blog-meta">{blog.date}<span>·</span>{blog.read}</div></div></article>)}
        </div>
      </section>
    </div>
  );
}
