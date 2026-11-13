"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, BadgeCheck, ChevronDown, ChevronRight, Clock, Eye, Heart, Maximize2, MessageCircle, MoreHorizontal, Phone, ShieldCheck, UserRound, X } from "lucide-react";
import { ImageViewer } from "@/components/image-viewer";
import { LocationDialog } from "@/features/ownerships/business-location";
import { ProductContact } from "./product-contact";
import { ListingCard } from "./listing-card";
import type { Listing } from "./data";
import styles from "./product-detail.module.css";
import { useProductFavorites, toggleProductFavorite } from "@/features/favorites/product-favorites";

function SiteIcon({ code }: { code: string }) { return <span className={styles.siteIcon} aria-hidden="true">{String.fromCodePoint(parseInt(code, 16))}</span>; }
export function ProductDetail({ listing, related }: { listing: Listing; related: Listing[] }) {
  const router = useRouter();
  const favorites = useProductFavorites();
  const saved = favorites.ids.includes(Number(listing.id));
  const favoriteBusy = favorites.pending.includes(Number(listing.id));
  async function toggleSaved() { try { await toggleProductFavorite(Number(listing.id)); } catch (error) { setNotice(error instanceof Error ? error.message : "Favorit yenilənmədi."); } }
  const [menu, setMenu] = useState(false), [promote, setPromote] = useState(false), [viewer, setViewer] = useState(false), [map, setMap] = useState(false), [expanded, setExpanded] = useState(false);
  const [modal, setModal] = useState<string | null>(null), [notice, setNotice] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const images = listing.images?.length ? listing.images : listing.image ? [listing.image] : [];
  const phone = listing.phone || "";
  const digits = phone.replace(/\D/g, "");
  const phoneHref = digits ? `tel:+${digits.startsWith("994") ? digits : digits.startsWith("0") ? `994${digits.slice(1)}` : digits}` : "";
  const sellerHref = listing.seller?.href || "/full-search";
  const menuRoot = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { if (modal) dialog.current?.showModal(); }, [modal]);
  useEffect(() => {
    if (!menu) return;
    const outside = (event: PointerEvent) => { if (!menuRoot.current?.contains(event.target as Node)) { setMenu(false); setPromote(false); } };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") { setMenu(false); setPromote(false); } };
    document.addEventListener("pointerdown", outside); document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
  }, [menu]);
  async function share() { setMenu(false); try { if (navigator.share) await navigator.share({ title: listing.title, url: window.location.href }); else { await navigator.clipboard.writeText(window.location.href); setNotice("Keçid kopyalandı."); } } catch { /* Cancelled by user. */ } }
  const location = { id: Number(listing.id), title: listing.title, status: "active", level: listing.level || "simple", recommended: false, latitude: listing.latitude, longitude: listing.longitude };
  const hasCoordinates = listing.latitude !== undefined && listing.longitude !== undefined;
  const address = listing.address || [listing.location, listing.subway].filter(Boolean).join(" · ") || "Ünvan qeyd edilməyib";
  return <div className={styles.screen} data-product-detail><div className={`page-shell-wide ${styles.page}`}>
    <div className={styles.mobileBackRow}><button type="button" className={styles.mobileBack} aria-label="Geri qayıt" onClick={() => { if (window.history.length > 1) router.back(); else router.push("/full-search"); }}><ArrowLeft size={25}/></button></div>
    <nav className={styles.breadcrumb} aria-label="Səhifə yolu"><Link href="/">Ana səhifə</Link><ChevronRight size={14}/>{listing.breadcrumb?.length ? listing.breadcrumb.map((item,index)=><span key={item.id}><Link href={`/full-search?title=${encodeURIComponent(item.title)}`}>{item.title}</Link>{index < listing.breadcrumb!.length - 1 && " › "}</span>) : <Link href="/full-search">{listing.category || "Elanlar"}</Link>}</nav>
    <div className={styles.titleRow}><div className={styles.titleCopy}><p className={styles.mobilePrice}>{listing.price}</p><h1>{listing.title}</h1></div><div className={styles.topActions}><button onClick={toggleSaved} disabled={favoriteBusy} aria-busy={favoriteBusy} aria-label={saved ? "Seçilmişlərdən çıxar" : "Seçilmişlərə əlavə et"} aria-pressed={saved}><Heart size={21} fill={saved ? "#ff3655" : "currentColor"}/></button><div ref={menuRoot} className={styles.moreWrap}><button onClick={() => setMenu(value => !value)} aria-label="Elan əməliyyatları" aria-expanded={menu}><MoreHorizontal size={23}/></button>{menu && <div className={styles.menu}><button onClick={share}><SiteIcon code="f14d"/>Paylaş</button><button onClick={() => { setMenu(false); setModal("Şikayət et"); }}><SiteIcon code="f071"/>Şikayət et</button><div className={styles.promotion} onMouseEnter={() => setPromote(true)} onMouseLeave={() => setPromote(false)}><button onClick={() => setPromote(value => !value)} aria-expanded={promote}><SiteIcon code="f1d8"/>Reklam alətləri<ChevronRight size={16}/></button>{promote && <div className={styles.submenu}>{[{ text: "Premium et", code: "f521" }, { text: "VIP et", code: "f3a5" }, { text: "Təcili et", code: "f0e7" }, { text: "İrəli çək", code: "f08d" }].map(item => <button key={item.text} onClick={() => { setModal(item.text); setMenu(false); }}><SiteIcon code={item.code}/>{item.text}</button>)}</div>}</div></div>}</div></div></div>
    <div className={styles.layout}><div className={styles.main}>
      <button className={styles.hero} onClick={() => setViewer(true)} aria-label="Şəkli tam ekranda aç"><img src={images[activeImage] || listing.image} alt={listing.title}/><span className={styles.counter}><SiteIcon code="f03e"/> {activeImage + 1} / {images.length}</span><span className={styles.maximize}><Maximize2 size={18}/></span><span className={styles.watermark}>axtar.az</span></button>
      <div className={styles.thumbnails}>{images.map((src,index)=><button key={src} onClick={() => setActiveImage(index)} aria-label={`${index+1}-ci şəkli göstər`} aria-pressed={activeImage===index}><img src={src} alt=""/></button>)}</div>
      <dl className={styles.specs}><div><dt>Kateqoriya</dt><dd>{listing.category || "Qeyd edilməyib"}</dd></div><div><dt>Şəhər</dt><dd>{listing.location || "Qeyd edilməyib"}</dd></div><div><dt>Vəziyyət</dt><dd>Yeni</dd></div></dl>
      <section className={styles.description}><h2>Elanın təsviri</h2><p className={!expanded ? styles.clamped : ""}>{listing.description || "Təsvir əlavə edilməyib."}</p><button onClick={() => setExpanded(value => !value)}>{expanded ? "Daha az göstər" : "Davamını oxu"}<ChevronDown size={17}/></button></section>
      <div className={styles.stats}><span>Elan № <strong>{listing.id}</strong></span><span><Eye size={17}/><strong>{listing.views ?? 0}</strong> baxış</span><span><UserRound size={17}/><strong>{saved ? 1 : 0}</strong> nəfər seçib</span><span><Clock size={17}/><strong>{listing.age || "Bu gün"}</strong></span></div>
    </div><aside className={styles.sidebar}>
      <section className={styles.seller}><p className={styles.price}>{listing.price}</p><Link className={styles.sellerIdentity} href={sellerHref} aria-label="Elan sahibinin profilinə bax"><span className={styles.avatar}>{listing.seller?.image ? <img src={listing.seller.image} alt=""/> : <UserRound size={43}/>}</span><div><strong>{listing.seller?.name || "Elan sahibi"}</strong><BadgeCheck size={16} fill="#24c46b" color="#fff"/><span>Elan sahibi</span></div></Link><div className={styles.sellerButtons}><button type="button" onClick={toggleSaved} disabled={favoriteBusy} aria-busy={favoriteBusy} aria-pressed={saved}>{saved ? "İzlənir" : "İzlə"}</button><Link href={sellerHref}>Bütün elanlarına bax<ArrowRight size={17}/></Link></div><ProductContact phone={phone} phoneHref={phoneHref}/><Link className={styles.message} href="/messages"><MessageCircle size={18} fill="currentColor"/>Mesaj yaz</Link></section>
      <section className={styles.address}><div><h2>Ünvan</h2><button onClick={() => setMap(true)}>Xəritədə bax<ArrowRight size={17}/></button></div><button className={styles.mapPreview} onClick={() => setMap(true)} aria-label="Ünvanı xəritədə aç">{hasCoordinates && <iframe title={address} loading="lazy" tabIndex={-1} src={`https://www.openstreetmap.org/export/embed.html?bbox=${listing.longitude!-.015}%2C${listing.latitude!-.01}%2C${listing.longitude!+.015}%2C${listing.latitude!+.01}&layer=mapnik&marker=${listing.latitude}%2C${listing.longitude}`}/>}<span>{address}</span></button></section>
      <section className={styles.safety}><span><ShieldCheck size={27}/></span><div><h2>Təhlükəsiz alış-veriş üçün məsləhətlər</h2><p>Ödəniş etməzdən əvvəl məhsulu yerində yoxlayın.</p><button onClick={() => setModal("Təhlükəsiz alış-veriş")}>Ətraflı oxu<ArrowRight size={16}/></button></div></section>
    </aside></div>
    <section className={styles.related}><h2>Oxşar elanlar</h2><div className={`listing-grid ${styles.relatedGrid}`}>{related.map(item => <ListingCard key={item.id} listing={item}/>)}</div></section>
    <div className={styles.mobileContact} aria-label="Satıcı ilə əlaqə">{phoneHref ? <a href={phoneHref}><Phone size={19}/>Zəng et</a> : <span>Nömrə qeyd edilməyib</span>}<Link href="/messages"><MessageCircle size={19}/>Mesaj yaz</Link></div>
    {viewer && <ImageViewer images={images.map(src=>({src,alt:listing.title}))} initialIndex={activeImage} title={listing.title} onClose={() => setViewer(false)}/>}
    {map && <LocationDialog business={location} address={address} onClose={() => setMap(false)}/>}
    {notice && <button className={styles.toast} onClick={() => setNotice("")}>{notice}<X size={15}/></button>}
    {modal && <dialog ref={dialog} className={styles.dialog} onCancel={() => setModal(null)}><div><h2>{modal}</h2><button onClick={() => setModal(null)} aria-label="Bağla"><X size={21}/></button></div>{modal === "Şikayət et" ? <form onSubmit={event => { event.preventDefault(); setModal(null); setNotice("Demo: şikayət forması qəbul edildi."); }}><label>Şikayətin səbəbi<select required defaultValue=""><option value="" disabled>Seçin</option><option>Yanlış məlumat</option><option>Təkrar elan</option><option>Digər</option></select></label><label>Əlavə məlumat<textarea rows={3}/></label><button className={styles.confirm}>Göndər</button></form> : <><p>{modal === "Təhlükəsiz alış-veriş" ? "Məhsulu yoxlayın, satıcının məlumatlarını dəqiqləşdirin və tanımadığınız şəxslərə əvvəlcədən ödəniş göndərməyin." : "Bu reklam aləti demo görünüşdədir. Ödəniş xidməti hələ qoşulmayıb."}</p><button className={styles.confirm} onClick={() => setModal(null)}>Bağla</button></>}</dialog>}
  </div></div>;
}
