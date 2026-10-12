import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";

export const metadata: Metadata = { title: "Bloqlar", description: "Alış-veriş, satış və təhlükəsizlik haqqında Axtar.az bloqları.", alternates: { canonical: "/posts" } };

const posts = [
  ["Ağıllı alış-veriş üçün 7 məsləhət", "Alış-veriş", "Axtarış zamanı düzgün seçim etmək və büdcənizə uyğun təklif tapmaq üçün sadə tövsiyələr.", "Alıcılar üçün"],
  ["Elanınızı daha çox insana necə çatdırmalı?", "Satış", "Elan başlığı, şəkillər və təsvir vasitəsilə təklifinizi daha aydın təqdim edin.", "Satıcılar üçün"],
  ["Təhlükəsiz onlayn alış-veriş qaydaları", "Təhlükəsizlik", "Görüş və ödəniş zamanı diqqət etməli olduğunuz əsas təhlükəsizlik məqamları.", "Güvənli alış"],
];
export default function PostsPage() {
  return <div className="page-shell directory-page"><nav className="breadcrumbs"><Link href="/">Ana səhifə</Link><span>›</span><span>Bloqlar</span></nav><div className="section-heading"><div><span className="eyebrow">Bilik və ilham</span><h1>Axtar.az bloqları</h1><p>Daha düzgün qərar verməyiniz üçün faydalı bloqlar</p></div></div><div className="blog-grid blog-directory">{posts.map(([title, tag, description, art], index) => <article className="blog-card" key={title}><Link className={`blog-art art-${index + 1}`} href="/posts"><span>{art}</span></Link><div className="blog-card-content"><span className="blog-tag">{tag}</span><h2><Link href="/posts">{title}</Link></h2><p>{description}</p><div className="blog-meta"><Clock3 size={14} /> 5 dəq. <span>·</span> 10 iyun 2026 <ArrowRight size={15} /></div></div></article>)}</div></div>;
}
