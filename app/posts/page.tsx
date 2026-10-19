import type { Metadata } from "next";
import { ChevronDown, Flame, Folder, SlidersHorizontal, UserRound } from "lucide-react";
import { getPosts } from "@/features/posts/api";
import { PostCard } from "@/features/posts/post-card";

export const revalidate = 60;
export const metadata: Metadata = { title: "Bloqlar", description: "Axtar.az bloqları", alternates: { canonical: "/posts" } };

export default async function PostsPage() {
  const posts = await getPosts();
  return <div className="page-shell directory-page">
    <div className="listing-filter-row blog-filter-row">
      <button><SlidersHorizontal size={16} /> Filter</button><button>⇵ &nbsp; Tarixə görə <ChevronDown size={14} /></button><button><Folder size={16} /> Kateqoriyalar <ChevronDown size={14} /></button><button><UserRound size={16} /> Müəlliflər <ChevronDown size={14} /></button><button><Flame size={16} /> Populyarlıq <ChevronDown size={14} /></button><button>Aç <ChevronDown size={14} /></button>
    </div>
    <div className="blog-directory">{posts.map((post) => <PostCard post={post} key={post.id} />)}{posts.length === 0 && <p>Hazırda göstəriləcək bloq yoxdur.</p>}</div>
  </div>;
}
