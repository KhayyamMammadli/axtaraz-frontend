import type { Metadata } from "next";
import { SearchFilterBar } from "@/features/filters/search-filters";
import { postFilterConfig } from "@/features/posts/filter-config";
import { getPosts } from "@/features/posts/api";
import { PostCard } from "@/features/posts/post-card";

export const revalidate = 60;
export const metadata: Metadata = { title: "Bloqlar", description: "Axtar.az bloqları", alternates: { canonical: "/posts" } };

export default async function PostsPage() {
  const posts = await getPosts();
  return <div className="page-shell directory-page">
    <SearchFilterBar config={postFilterConfig} resultCount={posts.length} />
    <div className="blog-directory">{posts.map((post) => <PostCard post={post} key={post.id} />)}{posts.length === 0 && <p>Hazırda göstəriləcək bloq yoxdur.</p>}</div>
  </div>;
}
