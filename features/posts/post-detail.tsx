"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { ImageViewer } from "@/components/image-viewer";
import { ListingCard } from "@/features/listings/listing-card";
import type { Listing } from "@/features/listings/data";
import { getPostAuthor, getPostImage, type BlogPost } from "./api";
import { PostCard } from "./post-card";
import styles from "./post-detail.module.css";

function Icon({ code }: { code: string }) { return <i className={styles.icon} aria-hidden="true">{String.fromCodePoint(parseInt(code,16))}</i>; }

export function PostDetail({ post, related, similar }: { post: BlogPost; related: Listing[]; similar: BlogPost[] }) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);
  const [preview, setPreview] = useState<number | null>(null);
  const [notice, setNotice] = useState("");
  const galleryRef = useRef<HTMLDivElement>(null);
  const touchingGallery = useRef(false);
  const lastGalleryInteraction = useRef(0);
  useEffect(() => {
    const interval = window.setInterval(() => {
      const track = galleryRef.current;
      if (!track || preview !== null || touchingGallery.current || document.hidden || track.contains(document.activeElement) || Date.now() - lastGalleryInteraction.current < 4500 || !window.matchMedia("(max-width: 640px)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const bounds = track.getBoundingClientRect();
      if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) return;
      const slideWidth = track.firstElementChild?.getBoundingClientRect().width || track.clientWidth;
      const current = Math.round(track.scrollLeft / slideWidth);
      const next = (current + 1) % track.children.length;
      track.scrollTo({ left: next * slideWidth, behavior: "smooth" });
    }, 4000);
    return () => window.clearInterval(interval);
  }, [preview]);
  const cover = post.attachment_full || getPostImage(post);
  const author = getPostAuthor(post);
  const models = ["iPhone 15", "iPhone 15 Plus", "iPhone 15 Pro", "iPhone 15 Pro Max"];
  const gallery = cover ? models.map(() => cover) : [];
  async function share() {
    try {
      if (navigator.share) await navigator.share({ title: post.title, url: window.location.href });
      else { await navigator.clipboard.writeText(window.location.href); setNotice("Keçid kopyalandı."); }
    } catch { /* User can dismiss sharing. */ }
  }
  return <div className={`page-shell ${styles.page}`} data-post-detail>
    <div className={styles.backRow}><button type="button" aria-label="Geri qayıt" onClick={() => { if (window.history.length > 1) router.back(); else router.push("/posts"); }}><Icon code="f060"/></button></div>
    <nav className={styles.breadcrumb} aria-label="Səhifə yolu"><Link href="/">Ana səhifə</Link><span>›</span><Link href="/posts">Bloqlar</Link><span>›</span><Link href="/posts">Bloq kateqoriyası</Link><span>›</span><strong>{post.title}</strong></nav>
    <article>
      <div className={styles.hero}>{cover && <img src={cover} alt={post.title}/>}<Link href="/posts" className={styles.category}>Bloq kateqoriyası</Link><div className={styles.actions}><button aria-label="Seçilmişlərə əlavə et" aria-pressed={saved} onClick={()=>setSaved(value=>!value)}><Icon code="f004"/></button><button aria-label="Paylaş" onClick={share}><Icon code="f1e0"/></button></div></div>
      <header className={styles.title}><h1>{post.title}</h1><div className={styles.meta}><div className={styles.stats}><span><img src="https://axtar.az/img/clock.svg" alt=""/><time dateTime={post.created_at}>11 ay əvvəl</time></span><span><img src="https://axtar.az/img/eye.svg" alt=""/>{post.view_count ?? 0} baxış</span></div>{author && <div className={styles.author}><img src="https://axtar.az/img/sss.jpeg" alt=""/><strong>{author}</strong><Icon code="f013"/></div>}<Link className={styles.all} href="/full-search">Bütün elanlara bax<img src="https://axtar.az/img/arrow-right.svg" alt=""/></Link></div></header>
      <section className={styles.content} aria-label="Bloq mətni">{post.short_description && <p className={styles.summary}>{post.short_description}</p>}{post.description && <div className={styles.text}>{post.description}</div>}<h2>1. Dizayn və ekran</h2><p>Bütün iPhone 15 modelləri Ceramic Shield ön şüşə və alüminium və ya titan çərçivə ilə təqdim olunur.</p><ul><li><strong>iPhone 15 və 15 Plus:</strong> 6.1 və 6.7 düymlük Super Retina XDR ekran.</li><li><strong>iPhone 15 Pro və 15 Pro Max:</strong> Super Retina XDR ekran və ProMotion texnologiyası.</li></ul>{gallery.length > 0 && <div ref={galleryRef} className={styles.gallery} aria-label="Bloq şəkilləri" onTouchStart={() => { touchingGallery.current = true; lastGalleryInteraction.current = Date.now(); }} onTouchEnd={() => { touchingGallery.current = false; lastGalleryInteraction.current = Date.now(); }} onTouchCancel={() => { touchingGallery.current = false; lastGalleryInteraction.current = Date.now(); }}>{gallery.map((src,index)=><button key={index} onClick={()=>setPreview(index)} aria-label={`${index+1}-ci bloq şəklini böyüt`}><strong>{models[index]}</strong><img src={src} alt={models[index]}/><span><b>{index % 2 ? "6.7”" : "6.1”"}</b>Super Retina XDR{index > 1 && <><br/>ProMotion (120Hz)</>}</span></button>)}</div>}<h2>2. Performans</h2><p>A16 Bionic çip və A17 Pro çip cihazların sürətini, qrafik imkanlarını və enerji səmərəliliyini maksimum səviyyəyə çatdırır.</p></section>
      <div className={styles.feedback}><div><strong>Bu məqaləni faydalı hesab etdiniz?</strong><p>Rəyiniz bizim üçün önəmlidir.</p></div><button onClick={()=>setLiked(value=>!value)} aria-pressed={liked}><svg viewBox="0 0 24 24" width="22" height="22" fill="#22c978" aria-hidden="true"><path d="M7 10v11H3V10h4Zm3 11h7.2a2 2 0 0 0 1.9-1.4l2.5-8A2 2 0 0 0 19.7 9H15l.7-3.3A2.2 2.2 0 0 0 11.5 4L8 10v9a2 2 0 0 0 2 2Z"/></svg>{liked ? "Bəyənildi" : "Bəyənirəm"}</button></div>
    </article>
    {related.length>0 && <section className={styles.related}><div className={styles.heading}><h2>Əlaqəli elanlar</h2><Link href="/full-search">Hamısına bax<img src="https://axtar.az/img/arrow-right.svg" alt=""/></Link></div><div className={`listing-grid ${styles.listings}`}>{related.map(item=><ListingCard key={item.id} listing={item}/>)}</div></section>}
    {similar.length>0 && <section className={styles.related}><div className={styles.heading}><h2>Oxşar bloqlar</h2><Link href="/posts">Hamısına bax<img src="https://axtar.az/img/arrow-right.svg" alt=""/></Link></div><div className={styles.posts}>{similar.map(item=><PostCard key={item.id} post={item}/>)}</div></section>}
    {preview !== null && <ImageViewer title={post.title} images={gallery.map(src=>({src,alt:post.title}))} initialIndex={preview} onClose={()=>setPreview(null)}/>}
    {notice && <button className={styles.notice} onClick={()=>setNotice("")}>{notice}</button>}
  </div>;
}
