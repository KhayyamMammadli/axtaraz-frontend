import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown, Flame, Folder, SlidersHorizontal, UserRound, ArrowRight } from "lucide-react";
import { formatPostDate, getPostAuthor, getPostImage, getPosts } from "@/features/posts/api";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Bloqlar",
  description: "Axtar.az bloqları",
  alternates: { canonical: "/posts" },
};

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <div className="page-shell directory-page">
      <div className="listing-filter-row blog-filter-row">
        <button><SlidersHorizontal size={16} /> Filter</button>
        <button>⇵ &nbsp; Tarixə görə <ChevronDown size={14} /></button>
        <button><Folder size={16} /> Kateqoriyalar <ChevronDown size={14} /></button>
        <button><UserRound size={16} /> Müəlliflər <ChevronDown size={14} /></button>
        <button><Flame size={16} /> Populyarlıq <ChevronDown size={14} /></button>
        <button>Aç <ChevronDown size={14} /></button>
      </div>
      <div className="blog-directory">
        {posts.map((post) => (
          <Link href={`/post/${post.slug}`} className="public-blog-card" key={post.id}>
            {getPostImage(post) && <img src={getPostImage(post)} alt={post.title} />}
            <div>
              <div className="public-blog-meta">
                <span>{formatPostDate(post.created_at)}</span>
                {getPostAuthor(post) && <b>{getPostAuthor(post)}</b>}
              </div>
              <h2>{post.title}</h2>
              <p>{post.short_description || post.description || ""}</p>
              <footer>
                <strong>{formatPostDate(post.created_at)}</strong>
                <span>{post.view_count ?? 0} baxış <ArrowRight size={14} /></span>
              </footer>
            </div>
          </Link>
        ))}
        {posts.length === 0 && <p>Hazırda göstəriləcək bloq yoxdur.</p>}
      </div>
    </div>
  );
}
