"use client";

import Link from "next/link";
import { Trash2, Tag, ArrowRight, BadgeCheck, CircleUserRound } from "lucide-react";
import { formatPostDate, getPostAuthor, getPostImage, type BlogPost } from "./api";
import styles from "./post-card.module.css";

export function PostCard({ post, onRemoveFavorite }: { post: BlogPost; onRemoveFavorite?: () => void }) {
  if (onRemoveFavorite) return <article className="favorite-blog-card">
    <Link href={`/post/${post.slug}`} className="favorite-blog-image">{getPostImage(post) && <img src={getPostImage(post)} alt={post.title} />}</Link>
    <button className="favorite-remove-button favorite-blog-remove" type="button" aria-label="Bloqu favoritlərdən sil" onClick={onRemoveFavorite}><Trash2 size={17}/></button>
    <div className="favorite-blog-copy"><h2><Link href={`/post/${post.slug}`}>{post.title}</Link></h2><p>{post.short_description || post.description || ""}</p></div>
  </article>;

  const author = getPostAuthor(post);
  const image = getPostImage(post);
  const href = `/post/${post.slug}`;
  return <article className={styles.card}>
    <Link href={href} className={styles.image} aria-label={post.title}>
      {image && <img src={image} alt={post.title} loading="lazy" />}
    </Link>
    <div className={styles.body}>
      <div className={styles.meta}>
        <span className={styles.category}><span className={styles.tag}><Tag size={14}/></span>Bloq kateqoriyası</span>
        {author && <span className={styles.author} title={author}><CircleUserRound size={19}/><span>{author}</span><BadgeCheck size={19}/></span>}
      </div>
      <h2><Link href={href}>{post.title}</Link></h2>
      <p>{post.short_description || post.description || ""}</p>
      <footer><time dateTime={post.created_at}>{formatPostDate(post.created_at)}</time><Link href={href} className={styles.read}>{post.view_count ?? 0} baxış <ArrowRight size={17}/></Link></footer>
    </div>
  </article>;
}
