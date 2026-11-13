import type { Metadata } from "next";
import Link from "next/link";
import { Eye, Phone, Search, UserRound } from "lucide-react";
import { getProducts } from "@/features/listings/api";
import { ListingCard } from "@/features/listings/listing-card";
import styles from "./seller.module.css";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Aida N Aida N — elanlar" };
}

export default async function SellerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const products = await getProducts();
  const sellerName = slug === "aida-n-aida-n" ? "Aida N Aida N" : "Satıcı";

  return <main className={styles.page}>
    <aside className={styles.profile}>
      <header className={styles.profileHead}><span className={styles.avatar}><UserRound size={38}/></span><div><small>Fərdi satıcı</small><h1>{sellerName}</h1></div></header>
      <div className={styles.stat}><span><Phone size={22}/></span><div><small>Əlaqə nömrəsi</small><strong>(055) 272-55-70</strong></div></div>
      <div className={styles.stat}><span><Eye size={22}/></span><div><small>Elanlara ümumi baxış</small><strong>15599</strong></div></div>
    </aside>
    <section className={styles.content}>
      <div className={styles.toolbar}><strong>İstifadəçiyə aid olan elanlar <b>{products.length}</b></strong><form action="/full-search"><label><Search size={20}/><input name="title" placeholder="Elan adı qeyd edin ..."/></label><button type="submit"><Search size={20}/> Elanlarda axtar</button></form></div>
      <div className={`listing-grid ${styles.grid}`}>{products.map((item, index) => <ListingCard key={item.id} listing={item} badges={index % 3 === 0 ? ["İTKİN", "AXTARILIR"] : []}/>)}</div>
      {!products.length && <p className={styles.empty}>Elan tapılmadı.</p>}
      <Link className={styles.back} href="/full-search">Bütün elanlara bax</Link>
    </section>
  </main>;
}
