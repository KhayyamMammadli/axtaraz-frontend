"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Share2, BadgeCheck, MapPin, Clock, ChevronDown, MessageCircle, Contact, Folder, Gift, Images, Star, Mail, Grid2X2, Search, Phone, X } from "lucide-react";
import { ImageViewer } from "@/components/image-viewer";
import { BusinessLocation } from "./business-location";
import { BusinessHours } from "./business-hours";
import type { Ownership } from "./api";
import { ListingCard } from "@/features/listings/listing-card";
import { listings } from "@/features/listings/data";
import styles from "./business-profile.module.css";

const sections = [{ id: "about", label: "Haqqımızda", icon: Contact }, { id: "offers", label: "Təkliflər", icon: Folder }, { id: "campaigns", label: "Kampaniyalar", icon: Gift }, { id: "gallery", label: "Qalereya", icon: Images }, { id: "reviews", label: "Rəylər", icon: Star }];
const categories = ["Bütün təkliflər", "Nəqliyyat", "Elektronika", "Daşınmaz əmlak", "Xidmətlər", "Telefonlar", "Şəxsi əşyalar"];
export function BusinessProfile({ business }: { business: Ownership }) {
  const router = useRouter();
  const [following, setFollowing] = useState(false);
  const [active, setActive] = useState("about");
  const [category, setCategory] = useState(0);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [preview, setPreview] = useState<number | null>(null);
  const cover = business.main_image_full || business.main_image || business.images_full?.[0] || business.images?.[0];
  const gallery = Array.from(new Set([...(business.images_full || []), ...(business.images || []), cover].filter((image): image is string => !!image)));
  const avatar = gallery[0] || cover;
  const count = Math.min(business.products_count ?? 1, listings.length);
  const offers = listings.slice(0, count).filter(item => item.title.toLocaleLowerCase("az").includes(query.toLocaleLowerCase("az")) && (category === 0 || (category === 1 ? /bmw|avto/i.test(item.title) : category === 2)));
  async function share() {
    try { if (navigator.share) await navigator.share({ title: business.title, url: window.location.href }); else { await navigator.clipboard.writeText(window.location.href); setNotice("Keçid kopyalandı."); } } catch { setNotice("Paylaşım tamamlanmadı."); }
  }
  return <div className={styles.screen} data-business-profile><article className={styles.profile}>
    <div className={styles.cover}>{cover && <img src={cover} alt={`${business.title} banneri`}/>}<div className={styles.coverActions}><button type="button" aria-label="Geri qayıt" onClick={() => { if (window.history.length > 1) router.back(); else router.push("/ownerships"); }}><ArrowLeft size={20}/><span>Geri</span></button><button type="button" onClick={share} aria-label="Biznesi paylaş"><Share2 size={20}/><span>Paylaş</span></button></div></div>
    <div className={styles.identity}><div className={styles.avatar}>{avatar ? <img src={avatar} alt={business.title}/> : <span>{business.title[0]}</span>}<BadgeCheck className={styles.verified} size={34}/></div><div className={styles.identityText}><h1>{business.title}</h1><p>{count} elan <span>·</span> Biznes profili <span>·</span> {following ? 1 : 0} izləyici</p></div><button className={styles.follow} onClick={() => setFollowing(value => !value)} aria-pressed={following}>{following ? "İzlənir" : "İzlə"}</button></div>
    <div className={styles.infoBar}><BusinessLocation business={business}/><BusinessHours days={business.work_day_names}/><a href={`tel:${business.mobile_number?.replace(/\s/g, "") || ""}`}><Phone size={18}/>{business.mobile_number || "Nömrə qeyd edilməyib"}</a><Link href="/messages"><MessageCircle size={20}/> Mesaj yaz <ChevronDown size={15}/></Link></div>
    <nav className={styles.tabs} aria-label="Biznes bölmələri">{sections.map(({ id, label, icon: Icon }) => <a key={id} href={`#business-${id}`} className={active === id ? styles.active : ""} onClick={() => setActive(id)}><Icon size={20}/>{label}</a>)}</nav>
    <section id="business-about" className={styles.about}><h2>{business.slogan || business.title}</h2><p>{business.description?.replace(/<[^>]*>/g, "") || "Məhsul və xidmətlərimiz haqqında məlumat üçün bizimlə əlaqə saxlayın."}</p></section>
    <section id="business-gallery" className={styles.section}><h2>Qalereya</h2><div className={styles.gallery}>{gallery.map((image, index) => <button key={image} onClick={() => setPreview(index)} aria-label="Şəkli böyüt"><img src={image} alt={`${business.title} qalereyası`}/></button>)}</div></section>
    <section id="business-offers" className={styles.section}><div className={styles.search}><Search size={19}/><input aria-label="Təkliflərdə axtar" placeholder="Təkliflərdə axtar..." value={query} onChange={event => setQuery(event.target.value)}/></div><nav className={styles.categories} aria-label="Təklif kateqoriyaları">{categories.map((label, index) => <button key={label} className={category === index ? styles.active : ""} onClick={() => setCategory(index)}>{index === 0 ? <Grid2X2 size={18}/> : <Folder size={18}/>} {label}{index === 0 ? ` (${count})` : ""}</button>)}</nav><div className={`listing-grid ${styles.offers}`}>{offers.map(item => <ListingCard key={item.id} listing={item}/>)}</div>{!offers.length && <p className={styles.empty}>Bu bölmədə təklif tapılmadı.</p>}</section>
    {active === "campaigns" && <section id="business-campaigns" className={styles.section}><h2>Kampaniyalar</h2><p className={styles.empty}>Hazırda kampaniya yoxdur.</p></section>}
    {active === "reviews" && <section id="business-reviews" className={styles.section}><h2>Rəylər</h2><p className={styles.empty}>Hələ rəy əlavə edilməyib.</p></section>}
  </article><div className={styles.mobileContact} aria-label="Bizneslə əlaqə">{business.mobile_number ? <a href={`tel:${business.mobile_number.replace(/\s/g, "")}`}><Phone size={19}/>Zəng et</a> : <span>Nömrə qeyd edilməyib</span>}<Link href="/messages"><MessageCircle size={19}/>Mesaj yaz</Link></div>{notice && <button className={styles.notice} onClick={() => setNotice("")}>{notice} <X size={15}/></button>}{preview !== null && <ImageViewer title={business.title} images={gallery.map(src => ({ src, alt: business.title }))} initialIndex={preview} onClose={() => setPreview(null)}/>}</div>;
}
