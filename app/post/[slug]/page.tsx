import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostAuthor, getPostImage } from "@/features/posts/api";

import { PostDetail } from "@/features/posts/post-detail";
import { listings } from "@/features/listings/data";
import { staticPosts } from "@/features/posts/static-posts";

type Props = { params: Promise<{ slug: string }> };
export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = staticPosts.find(item => item.slug === slug);
  if (!post) return { title: "Blog tapılmadı" };

  const image = getPostImage(post);
  return {
    title: post.title,
    description: post.short_description || post.description || undefined,
    alternates: { canonical: `/post/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.short_description || post.description || undefined,
      ...(image ? { images: [image] } : {}),
      publishedTime: post.created_at,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = staticPosts.find(item => item.slug === slug);
  if (!post) notFound();

  const image = getPostImage(post);
  const author = getPostAuthor(post);
  const summary = post.short_description || post.description || "";
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: summary,
    ...(image ? { image } : {}),
    ...(post.created_at ? { datePublished: post.created_at } : {}),
    ...(author ? { author: { "@type": "Person", name: author } } : {}),
    mainEntityOfPage: `https://axtar.az/post/${post.slug}`,
  };


  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}/>
    <PostDetail post={post} related={listings.slice(0, 5)} similar={staticPosts.filter(item => item.id !== post.id).slice(0, 2)}/>
  </>;
}
