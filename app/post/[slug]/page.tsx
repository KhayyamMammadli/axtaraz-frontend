import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Eye, Heart, Share2 } from "lucide-react";
import { formatPostDate, getPostAuthor, getPostBySlug, getPostImage } from "@/features/posts/api";

type Props = { params: Promise<{ slug: string }> };
export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
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
  const post = await getPostBySlug(slug);
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

  return (
    <div className="page-shell post-detail">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
      />
      <nav className="breadcrumbs">
        <Link href="/">Ana səhifə</Link><span>›</span>
        <Link href="/posts">Bloqlar</Link><span>›</span><b>{post.title}</b>
      </nav>
      <article>
        <div className="post-hero">
          {image && <img src={image} alt={post.title} />}
          <div>
            <button aria-label="Favoritə əlavə et"><Heart size={20} /></button>
            <button aria-label="Paylaş"><Share2 size={20} /></button>
          </div>
        </div>
        <header className="post-title-card">
          <h1>{post.title}</h1>
          <div>
            <span>◷ &nbsp;{formatPostDate(post.created_at)}</span>
            <span><Eye size={15} /> {post.view_count ?? 0} baxış</span>
            {author && <b>{author}</b>}
            <Link href="/posts">Bütün bloqlara bax</Link>
          </div>
        </header>
        <section className="post-copy">
          {post.short_description && <p>{post.short_description}</p>}
          {post.description && <p>{post.description}</p>}
        </section>
        <div className="post-feedback">
          Bu məqaləni faydalı hesab etdiniz? Rəyiniz bizim üçün önəmlidir. <button>♡ &nbsp;Bəyənirəm</button>
        </div>
        <section className="post-related">
          <h2>Əlaqəli elanlar</h2>
          <Link href="/full-search">Hamısına bax <ArrowRight size={15} /></Link>
        </section>
      </article>
    </div>
  );
}
