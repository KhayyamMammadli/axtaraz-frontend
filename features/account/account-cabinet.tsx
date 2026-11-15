"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Home, ChevronRight, UserRound, Pencil, Trash2, Megaphone, Store, Rss, Clock, CircleAlert, LoaderCircle, ScanLine, X, Plus, LayoutGrid, List, LogOut } from "lucide-react";
import { ListingCard } from "@/features/listings/listing-card";
import { cabinetListings, type Listing } from "@/features/listings/data";
import { logout, useSession } from "@/features/auth/session";
import type { Customer } from "@/features/auth/types";
import { formatPostDate } from "@/features/posts/api";
import { AccountPosts } from "./account-posts";
import { AccountBusinesses } from "./account-businesses";
import { ProfileDialog, type ProfileDetails } from "./profile-dialog";
import styles from "./account-cabinet.module.css";

const tabs = [
  { id: "profile", label: "Məlumatlarım", icon: UserRound, create: "/account/profile" },
  { id: "listings", label: "Elanlarım", icon: Megaphone, create: "/product/create" },
  { id: "businesses", label: "Bizneslərim", icon: Store, create: "/ownerships/create" },
  { id: "posts", label: "Bloqlarım", icon: Rss, create: "/posts/create" },
];
const statuses = [
  { label: "Aktiv", icon: Megaphone }, { label: "İlkin yoxlanışda", icon: Clock },
  { label: "Vaxtı bitmiş", icon: CircleAlert }, { label: "Yoxlanışda", icon: LoaderCircle },
  { label: "Xətalı", icon: ScanLine }, { label: "Ləğv edilib", icon: X },
];
export function AccountCabinet({ section, initialCustomer }: { section: string; initialCustomer: Customer }) {
  const session = useSession();
  const customer = session.customer || initialCustomer;
  const [status, setStatus] = useState(0);
  const [items, setItems] = useState(cabinetListings);
  const [listView, setListView] = useState(false);
  const router = useRouter();
  const deleteDialog = useRef<HTMLDialogElement>(null);
  const deleteCancel = useRef<HTMLButtonElement>(null);
  const editListing = (item: Listing) => router.push(`/product/create?type=${item.adType || "offer"}&edit=${encodeURIComponent(item.id)}`);
  const [deleting, setDeleting] = useState<Listing | null>(null);
  const [name, setName] = useState(initialCustomer.full_name);
  const [avatar, setAvatar] = useState<string | undefined>(initialCustomer.logo || undefined);
  const [profileOpen, setProfileOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [profile, setProfile] = useState<ProfileDetails>({ firstName: initialCustomer.name, lastName: initialCustomer.last_name, phone: initialCustomer.mobile_number, email: initialCustomer.email });
  const [notice, setNotice] = useState("");
  useEffect(() => {
    if (!deleting) return;
    deleteDialog.current?.showModal();
    deleteCancel.current?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = overflow; };
  }, [deleting]);
  useEffect(() => {
    if (!session.loading && !session.customer && !session.error) router.replace("/login");
  }, [session.loading, session.customer, session.error, router]);
  useEffect(() => {
    setName(customer.full_name); setAvatar(customer.logo || undefined);
    setProfile({firstName:customer.name,lastName:customer.last_name,phone:customer.mobile_number,email:customer.email});
  }, [customer]);
  const tab = tabs.find(item => item.id === section) ?? tabs[0];
  const profileContent = <>
        <div className={styles.avatarRow}><span className={styles.avatar}>{avatar ? <img src={avatar} alt="Profil şəkli"/> : <UserRound size={38}/>}</span><label className={styles.upload}>Şəkli dəyiş<input type="file" accept="image/*" onChange={event => { const file = event.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onload = () => setAvatar(String(reader.result)); reader.readAsDataURL(file); } }}/></label></div>
        <h2>{name}</h2><p className={styles.email}>{profile.email}</p>
        <button className={styles.profileAction} onClick={() => setProfileOpen(true)}>Məlumatları yenilə <Pencil size={16}/></button>
        <button className={`${styles.profileAction} ${styles.passwordAction}`} onClick={() => setPasswordOpen(true)}>Şifrəni yenilə <Pencil size={16}/></button>
        <div className={styles.profileDetails}><div><span>Telefon nömrəsi</span><strong>{profile.phone}</strong></div><div><span>E-poçt ünvanı</span><strong>{profile.email}</strong></div><div><span>Qeydiyyat tarixi</span><strong>{formatPostDate(customer.created_at) || "Qeyd edilməyib"}</strong></div></div>
  </>;
  return <div className={`page-shell-wide ${styles.page}`}>
    <nav className={`${styles.breadcrumb} ${styles.desktopOnly}`} aria-label="Səhifə yolu"><Link href="/" aria-label="Ana səhifə"><Home size={16}/></Link><ChevronRight size={14}/><span>Şəxsi kabinet</span><ChevronRight size={14}/><strong>{tab.label}</strong></nav>
    <div className={`${styles.heading} ${styles.desktopOnly}`}><h1>Şəxsi kabinet</h1><button type="button" onClick={async () => { try { await logout(); router.replace("/login"); router.refresh(); } catch { setNotice("Çıxış mümkün olmadı. Yenidən cəhd edin."); } }}><LogOut size={18}/>Çıxış et</button></div>
    <div className={`${styles.layout} ${styles.tabLayout} ${section === "profile" ? styles.profileLayout : ""}`}>
      {section !== "profile" && <aside className={`${styles.profile} ${styles.desktopProfile}`} aria-label="Şəxsi məlumatlar">{profileContent}</aside>}
      <section className={`${styles.content} ${section !== "listings" ? styles.businessContent : ""}`} aria-label="Paylaşımlarım">
        <div className={styles.tabRow}><nav className={styles.tabs} aria-label="Kabinet bölmələri">{tabs.map(({ id, label, icon: Icon }) => <Link key={id} href={`/account/${id}`} className={`${section === id ? styles.activeTab : ""} ${id === "profile" && section !== "profile" ? styles.mobileProfileTab : ""}`} aria-current={section === id ? "page" : undefined} onClick={() => setStatus(0)}><Icon size={20}/>{label}</Link>)}</nav>{section !== "profile" && <button className={styles.viewToggle} onClick={() => setListView(value => !value)} aria-label={listView ? "Kart görünüşü" : "Siyahı görünüşü"}>{listView ? <LayoutGrid size={19}/> : <List size={21}/>}</button>}</div>
        {section === "listings" && <div className={styles.statuses} aria-label="Paylaşım statusu">{statuses.map(({ label, icon: Icon }, index) => <button key={label} className={status === index ? styles.activeStatus : ""} onClick={() => setStatus(index)} aria-pressed={status === index}><Icon size={18}/>{label} <span>({section === "listings" && index === 0 ? items.length : 0})</span></button>)}</div>}
        {section === "profile" ? (<section className={`${styles.profile} ${styles.profileTab}`} aria-label="Şəxsi məlumatlar">
        {profileContent}
      </section>) : section === "businesses" ? <AccountBusinesses listView={listView}/> : section === "posts" ? <AccountPosts listView={listView}/> : section === "listings" && status === 0 && items.length ? (listView ? <div className={styles.tableWrap}><table className={styles.listingTable}><caption className="sr-only">Elanlarım</caption><thead><tr><th scope="col">Şəkil</th><th scope="col">Elan adı</th><th scope="col">Qiymət</th><th scope="col">Mağaza / istifadəçi</th><th scope="col">Tarix</th><th scope="col">Əməliyyat</th></tr></thead><tbody>{items.map(item => <tr key={item.id}><td><Link href={`/product/${item.slug}`} aria-label={item.title}><img className={styles.tableImage} src={item.image} alt={item.title} loading="lazy"/></Link></td><td><Link className={styles.tableTitle} href={`/product/${item.slug}`}>{item.title}</Link></td><td className={styles.tablePrice}>{item.price}</td><td>{name}</td><td className={styles.tableDate}>{item.age}</td><td><div className={styles.tableActions}><button type="button" onClick={() => editListing(item)} aria-label={`${item.title} — redaktə et`}><Pencil size={15}/><span>Redaktə et</span></button><button type="button" onClick={() => setDeleting(item)} aria-label={`${item.title} — sil`}><Trash2 size={15}/><span>Sil</span></button></div></td></tr>)}</tbody></table></div> : <div className={`listing-grid ${styles.grid}`}>{items.map(item => <ListingCard key={item.id} listing={item} onEdit={() => editListing(item)} onDelete={() => setDeleting(item)}/>)}</div>) : <div className={styles.empty}><tab.icon size={36}/><h2>Hələ paylaşım yoxdur</h2><p>Bu bölmədəki paylaşımlarınız burada görünəcək.</p><Link href={tab.create}><Plus size={16}/> Paylaşım yarat</Link></div>}
      </section>
    </div>
    {notice && <p className={styles.notice} role="status">{notice}<button onClick={() => setNotice("")} aria-label="Bağla"><X size={16}/></button></p>}
    {(profileOpen || passwordOpen) && <ProfileDialog mode={passwordOpen ? "password" : "profile"} profile={{ ...profile, avatar }} onClose={() => { setProfileOpen(false); setPasswordOpen(false); }} onSave={value => { setProfile(value); setName(`${value.firstName} ${value.lastName}`); setAvatar(value.avatar); setProfileOpen(false); setNotice("Məlumatlar demo görünüşdə yeniləndi."); }} onPasswordSave={() => { setPasswordOpen(false); setNotice("Demo: şifrə forması uğurla yoxlanıldı."); }}/>}
    {deleting && <dialog ref={deleteDialog} className={`${styles.dialog} ${styles.deleteDialog}`} aria-labelledby="delete-listing-title" aria-describedby="delete-listing-description" onCancel={() => setDeleting(null)} onClick={event => { if (event.target === event.currentTarget) { const bounds = event.currentTarget.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) setDeleting(null); } }}>
      <button type="button" className={styles.close} onClick={() => setDeleting(null)} aria-label="Bağla"><X size={19}/></button>
      <h2 id="delete-listing-title">Elanı silməyə əminsiniz?</h2><p id="delete-listing-description">“{deleting.title}” siyahınızdan silinəcək.</p>
      <div className={styles.deleteActions}><button type="button" ref={deleteCancel} onClick={() => setDeleting(null)}>Xeyr</button><button type="button" onClick={() => { setItems(previous => previous.filter(item => item.id !== deleting.id)); setDeleting(null); setNotice("Elan silindi."); }}>Bəli, sil</button></div>
    </dialog>}
  </div>;
}
