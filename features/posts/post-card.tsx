"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { formatPostDate, getPostAuthor, getPostImage, type BlogPost } from "./api";

export function PostCard({ post, onRemoveFavorite }: { post: BlogPost; onRemoveFavorite?: () => void }) {
  if (onRemoveFavorite) return <article className="favorite-blog-card">
    <Link href={`/post/${post.slug}`} className="favorite-blog-image">{getPostImage(post) && <img src={getPostImage(post)} alt={post.title} />}</Link>
    <button className="favorite-remove-button favorite-blog-remove" type="button" aria-label="Bloqu favoritlərdən sil" onClick={onRemoveFavorite}><Trash2 size={17}/></button>
    <div className="favorite-blog-copy"><h2><Link href={`/post/${post.slug}`}>{post.title}</Link></h2><p>{post.short_description || post.description || ""}</p></div>
  </article>;

  return <Link href={`/post/${post.slug}`} className="public-blog-card" key={post.id}>
    {getPostImage(post) && <img src={getPostImage(post)} alt={post.title} />}
    <div><div className="public-blog-meta"><span>{formatPostDate(post.created_at)}</span>{getPostAuthor(post) && <b>{getPostAuthor(post)}</b>}</div><h2>{post.title}</h2><p>{post.short_description || post.description || ""}</p><footer><strong>{formatPostDate(post.created_at)}</strong><span>{post.view_count ?? 0} baxış</span></footer></div>
  </Link>;
}
