"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, Clock, Pencil, Plus, Store, Trash2, X } from "lucide-react";
import { BusinessCard } from "@/features/home/premium-businesses-carousel";
import type { Ownership } from "@/features/ownerships/api";
import { favoriteBusinesses } from "@/features/ownerships/favorite-data";
import styles from "./account-cabinet.module.css";

const initialBusinesses: Ownership[] = favoriteBusinesses.slice(0, 2).map((business, index) => ({
  id: index + 1, title: business.name, main_image_full: business.image, images: [business.image], products_count: Number(business.count),
  status: index === 0 ? "active" : "pending", level: "premium", recommended: true,
  mobile_number: "+99450 850 09 55", slogan: index === 0 ? "Keyfiyyətli xidmət, etibarlı seçim" : "Biznesiniz üçün yeni imkanlar",
}));
export function AccountBusinesses({ listView }: { listView: boolean }) {
  const [businesses, setBusinesses] = useState(initialBusinesses);
  const [action, setAction] = useState<{ type: "edit" | "delete"; business: Ownership } | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { if (action) dialog.current?.showModal(); }, [action]);
  return <div className={styles.businessPanel}>
    <div className={styles.businessHeading}><h2>Biznes siyahısı</h2><Link href="/ownerships/create"><Plus size={17}/> Yeni biznes</Link></div>
    {!businesses.length ? <div className={styles.empty}><Store size={35}/><h2>Hələ biznes yoxdur</h2><p>İlk biznesinizi əlavə edərək başlayın.</p></div> : listView ? <div className={styles.tableWrap}><table className={styles.listingTable}><caption className="sr-only">Bizneslərim</caption><thead><tr><th scope="col">Biznes</th><th scope="col">Əlaqə nömrəsi</th><th scope="col">Sloqan</th><th scope="col">Status</th><th scope="col">İş günləri</th><th scope="col">Əməliyyat</th></tr></thead><tbody>{businesses.map(business => <tr key={business.id}><td><div className={styles.businessTableIdentity}><img src={business.main_image_full || ""} alt=""/><strong>{business.title}</strong></div></td><td><a href={`tel:${business.mobile_number?.replace(/\s/g, "")}`}>{business.mobile_number}</a></td><td>{business.slogan}</td><td><span className={`${styles.businessStatus} ${business.status === "active" ? styles.statusActive : styles.statusPending}`}>{business.status === "active" ? <Check size={14}/> : <Clock size={14}/>} {business.status === "active" ? "Aktivdir" : "Gözləmədə"}</span></td><td className={styles.workHours}>Həftə içi: 09:00 – 18:00<br/>Həftə sonu: 11:00 – 15:00</td><td><div className={styles.tableActions}><button onClick={() => setAction({ type: "edit", business })} aria-label={`${business.title} — redaktə et`}><Pencil size={15}/></button><button onClick={() => setAction({ type: "delete", business })} aria-label={`${business.title} — sil`}><Trash2 size={15}/></button></div></td></tr>)}</tbody></table></div> : <div className={styles.businessCards}>{businesses.map(business => <BusinessCard key={business.id} business={business} onEdit={() => setAction({ type: "edit", business })} onDelete={() => setAction({ type: "delete", business })}/>)}</div>}
    {action && <dialog ref={dialog} className={styles.profileDialog} onCancel={() => setAction(null)} aria-labelledby="business-action-title"><div className={styles.modalHeading}><h2 id="business-action-title">{action.type === "edit" ? "Biznesi redaktə et" : "Biznesi sil"}</h2><button type="button" onClick={() => setAction(null)} aria-label="Bağla"><X size={20}/></button></div>{action.type === "delete" ? <><p>“{action.business.title}” demo siyahınızdan silinsin?</p><div className={styles.modalFooter}><button onClick={() => setAction(null)}>İmtina et</button><button type="submit" onClick={() => { setBusinesses(previous => previous.filter(item => item.id !== action.business.id)); setAction(null); }}>Sil</button></div></> : <form onSubmit={event => { event.preventDefault(); const data = new FormData(event.currentTarget); setBusinesses(previous => previous.map(item => item.id === action.business.id ? { ...item, title: String(data.get("title")), mobile_number: String(data.get("phone")), slogan: String(data.get("slogan")) } : item)); setAction(null); }}><label>Biznes adı<input name="title" defaultValue={action.business.title} required/></label><label>Əlaqə nömrəsi<input name="phone" type="tel" defaultValue={action.business.mobile_number || ""} required/></label><label>Sloqan<input name="slogan" defaultValue={action.business.slogan || ""}/></label><div className={styles.modalFooter}><button type="button" onClick={() => setAction(null)}>İmtina et</button><button type="submit">Yadda saxla</button></div></form>}</dialog>}
  </div>;
}
