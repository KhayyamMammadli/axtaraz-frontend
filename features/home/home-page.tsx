import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PremiumBusinesses } from "./premium-businesses";
import { getProducts } from "@/features/listings/api";
import { FeedTabs } from "./feed-tabs";
import { ListingCard } from "@/features/listings/listing-card";
import {
  formatPostDate,
  getPostAuthor,
  getPostImage,
  getPosts,
} from "@/features/posts/api";

export async function HomePage() {
  const [listings, posts] = await Promise.all([getProducts(), getPosts()]);
  const featuredPost = posts[0];
  const otherPosts = posts.slice(1, 4);

  return (
    <div className="page-shell">
      <h1 className="sr-only">Axtar.az — elanlar, bizneslər və xidmətlər</h1>
      <PremiumBusinesses />
      <FeedTabs />
      <section className="listing-grid home-listings" aria-label="Elanlar">
        {listings.map((item) => (
          <ListingCard key={item.id} listing={item} />
        ))}
      </section>
      <section className="infinity-promo-banner">
        <div className="infinity-promo-banner__content">
          <h2>Axtar.az&apos;da elan yerləşdir, satışların artsın.</h2>
          <p>Elanınızı yerləşdirin və daha çox insana çatdırın.</p>
          <Link href="/product/create" className="infinity-promo-banner__button">
            <img src="https://axtar.az/img/plus.svg" alt="" /> Yeni
          </Link>
        </div>
        <div className="infinity-promo-banner__visual">
          <img className="infinity-promo-banner__image" src="https://axtar.az/img/hand.svg" alt="" />
        </div>
      </section>
      <section className="blog-section">
        <div className="section-heading blog-heading">
          <div>
            <h2><img src="https://axtar.az/img/blog-book.svg" alt="" /> Bloglar</h2>
            <p>Daha düzgün qərar verməyiniz üçün faydalı bloglar</p>
          </div>
          <Link href="/posts">Hamısına bax <ArrowRight size={15} /></Link>
        </div>
        {featuredPost ? (
          <div className="blog-layout">
            <article className="blog-feature">
              <Link href={`/post/${featuredPost.slug}`} className="blog-feature-image">
                {getPostImage(featuredPost) && (
                  <img src={getPostImage(featuredPost)} alt={featuredPost.title} />
                )}
              </Link>
              <div className="blog-feature-body">
                <h3><Link href={`/post/${featuredPost.slug}`}>{featuredPost.title}</Link></h3>
                <p>{featuredPost.short_description || featuredPost.description || ""}</p>
                <small>
                  {[getPostAuthor(featuredPost), formatPostDate(featuredPost.created_at), `${featuredPost.view_count ?? 0} baxış`]
                    .filter(Boolean)
                    .join(" · ")}
                </small>
              </div>
              <Link className="related-listings" href={`/post/${featuredPost.slug}`}>
                <strong>{featuredPost.view_count ?? 0} baxış</strong>
                <span>Məqaləni oxumağa davam edin <ArrowRight size={15} /></span>
              </Link>
            </article>
            <div className="blog-list">
              {otherPosts.map((post) => (
                <article className="blog-mini" key={post.id}>
                  <Link href={`/post/${post.slug}`} className="blog-mini-image">
                    {getPostImage(post) && <img src={getPostImage(post)} alt={post.title} />}
                  </Link>
                  <div>
                    <h3><Link href={`/post/${post.slug}`}>{post.title}</Link></h3>
                    <p>{post.short_description || post.description || ""}</p>
                    <span>
                      {[formatPostDate(post.created_at), `${post.view_count ?? 0} baxış`]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <p>Hazırda göstəriləcək bloq yoxdur.</p>
        )}
      </section>
    </div>
  );
}
