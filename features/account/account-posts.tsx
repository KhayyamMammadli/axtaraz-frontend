"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Pencil, Plus, Rss, Trash2, X } from "lucide-react";
import { PostCard } from "@/features/posts/post-card";
import { formatPostDate, getPostAuthor, getPostImage, type BlogPost } from "@/features/posts/api";
import { listings } from "@/features/listings/data";
import { favoriteBusinesses } from "@/features/ownerships/favorite-data";
import styles from "./account-cabinet.module.css";

const initialPosts: BlogPost[] = [
  { title: "Avtomobil alarkən nələrə diqqət etməli?", image: listings[15].image, description: "Avtomobil seçimi üçün faydalı məsləhətlər." },
  { title: "Biznesinizi inkişaf etdirməyin yolları", image: favoriteBusinesses[0].image, description: "Yeni imkanlar və biznesiniz üçün düzgün addımlar." },
  { title: "Təhlükəsizlik sistemlərinin seçimi", image: listings[0].image, description: "Eviniz və iş yeriniz üçün etibarlı həllər." },
  { title: "Onlayn satış üçün faydalı məsləhətlər", image: listings[1].image, description: "Elanınızı hazırlayarkən bu məqamlara diqqət edin." },
].map((post, index) => ({ id: index + 1, slug: `demo-blog-${index + 1}`, title: post.title, attachment: post.image, short_description: post.description, created_at: "2026-08-16", status: "active", view_count: 118 + index * 37, created_by: { id: 1, name: "Xəyyam", last_name: "Məmmədli" } }));

export function AccountPosts({ listView }: { listView: boolean }) {
  const [posts, setPosts] = useState(initialPosts);
  const [action, setAction] = useState<{ type: "edit" | "delete"; post: BlogPost } | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { if (action) dialog.current?.showModal(); }, [action]);
  return <div className={styles.businessPanel}>
    <div className={styles.businessHeading}><h2>Bloq siyahısı</h2><Link href="/posts/create"><Plus size={17}/> Yeni bloq yarat</Link></div>
    {!posts.length ? <div className={styles.empty}><Rss size={35}/><h2>Hələ bloq yoxdur</h2><p>İlk bloqunuzu yaradaraq başlayın.</p></div> : listView ? <div className={styles.tableWrap}><table className={styles.listingTable}><caption className="sr-only">Bloqlarım</caption><thead><tr><th scope="col">Bloq</th><th scope="col">Müəllif</th><th scope="col">Tarix</th><th scope="col">Baxış</th><th scope="col">Status</th><th scope="col">Əməliyyat</th></tr></thead><tbody>{posts.map(post => <tr key={post.id}><td><div className={styles.businessTableIdentity}><img src={getPostImage(post)} alt=""/><strong>{post.title}</strong></div></td><td>{getPostAuthor(post)}</td><td className={styles.tableDate}>{formatPostDate(post.created_at)}</td><td>{post.view_count ?? 0}</td><td><span className={`${styles.businessStatus} ${styles.statusActive}`}>Aktivdir</span></td><td><div className={styles.tableActions}><button onClick={() => setAction({ type: "edit", post })} aria-label={`${post.title} — redaktə et`}><Pencil size={15}/><span>Redaktə et</span></button><button onClick={() => setAction({ type: "delete", post })} aria-label={`${post.title} — sil`}><Trash2 size={15}/><span>Sil</span></button></div></td></tr>)}</tbody></table></div> : <div className={styles.postCards}>{posts.map(post => <PostCard key={post.id} post={post} onEdit={() => setAction({ type: "edit", post })} onDelete={() => setAction({ type: "delete", post })}/>)}</div>}
    {action && <dialog ref={dialog} className={styles.profileDialog} onCancel={() => setAction(null)} aria-labelledby="post-action-title"><div className={styles.modalHeading}><h2 id="post-action-title">{action.type === "edit" ? "Bloqu redaktə et" : "Bloqu sil"}</h2><button type="button" onClick={() => setAction(null)} aria-label="Bağla"><X size={20}/></button></div>{action.type === "delete" ? <><p>“{action.post.title}” demo siyahınızdan silinsin?</p><div className={styles.modalFooter}><button onClick={() => setAction(null)}>İmtina et</button><button type="submit" onClick={() => { setPosts(previous => previous.filter(item => item.id !== action.post.id)); setAction(null); }}>Sil</button></div></> : <form onSubmit={event => { event.preventDefault(); const data = new FormData(event.currentTarget); setPosts(previous => previous.map(item => item.id === action.post.id ? { ...item, title: String(data.get("title")), short_description: String(data.get("description")) } : item)); setAction(null); }}><label>Bloqun adı<input name="title" defaultValue={action.post.title} required/></label><label>Qısa təsvir<textarea className={styles.postDescription} name="description" defaultValue={action.post.short_description || ""} rows={4} required/></label><div className={styles.modalFooter}><button type="button" onClick={() => setAction(null)}>İmtina et</button><button type="submit">Yadda saxla</button></div></form>}</dialog>}
  </div>;
}
