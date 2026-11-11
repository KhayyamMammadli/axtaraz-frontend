import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PremiumBusinesses } from "./premium-businesses";
import { getProducts } from "@/features/listings/api";
import { FeedTabs } from "./feed-tabs";
import { ListingCard } from "@/features/listings/listing-card";
import { getPosts } from "@/features/posts/api";
import { PostCard } from "@/features/posts/post-card";

export async function HomePage() {
  const [listings, posts] = await Promise.all([getProducts(), getPosts()]);

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
        {posts.length ? (
          <div className="blog-directory">
            {posts.slice(0, 4).map(post => <PostCard key={post.id} post={post} />)}
          </div>
        ) : <p>Hazırda göstəriləcək bloq yoxdur.</p>}

      </section>
    </div>
  );
}
