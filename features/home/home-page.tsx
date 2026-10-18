import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PremiumBusinesses } from "./premium-businesses";
import { listings } from "@/features/listings/data";
import { FeedTabs } from "./feed-tabs";
import { ListingCard } from "@/features/listings/listing-card";

const ownership="https://storage.axtar.az/uploads/ownerships_main/min/2026/06/05/e7aac09e3bdeefa0c19f2791ddba60dd.png";
const posts=[
 {title:"Test",href:"/post/test-3",category:"Elektronika",author:"Xeyyam",date:"2026-08-16 18:28:01",image:"https://storage.axtar.az/uploads/posts/min/2026/08/16/6a81c8c682955-8c473ea6eaaec3447d728283aea346a7.png",description:"test",count:"143"},
 {title:"test blog 7",href:"/post/test-blog-7",category:"Bloq kateqoriyası",author:"Xeyyam Memmedli",date:"10.06.2026",image:"https://storage.axtar.az/uploads/posts/min/2026/06/10/6a292ee80429a-a242d5f7bd988b2edbdfeb0b1931e8dd.png",description:"SEO",count:"259"},
 {title:"blog test 6",href:"/post/blog-test-6",category:"Bloq kateqoriyası",author:"Xeyyam Memmedli",date:"10.06.2026",image:"https://storage.axtar.az/uploads/posts/min/2026/06/10/6a29275c18122-c2d40615727189a2200b6088299fd16b.png",description:"test",count:"222"},
 {title:"test blog 4",href:"/post/test-blog-4-2",category:"Bloq kateqoriyası",author:"Xeyyam Memmedli",date:"10.06.2026",image:"https://storage.axtar.az/uploads/posts/min/2026/06/10/6a292408be5d9-08223c701137bafa279fd0a0f39413f4.png",description:"asdsdas",count:"219"}
];

export function HomePage(){return <div className="page-shell"><h1 className="sr-only">Axtar.az — elanlar, bizneslər və xidmətlər</h1>
<PremiumBusinesses />
<FeedTabs/>
<section className="listing-grid home-listings" aria-label="Elanlar">{listings.map(item=><ListingCard key={item.id} listing={item}/>)}</section>
<section className="infinity-promo-banner"><div className="infinity-promo-banner__content"><h2>Axtar.az'da elan yerləşdir, satışların artsın.</h2><p>NEW 100% Authentic UGG Brand Women's Tazz II Braid Platform Slippers Shoes Sand</p><Link href="/product/create" className="infinity-promo-banner__button"><img src="https://axtar.az/img/plus.svg" alt=""/> Yeni</Link></div><div className="infinity-promo-banner__visual"><img className="infinity-promo-banner__image" src="https://axtar.az/img/hand.svg" alt=""/></div></section>
<section className="blog-section"><div className="section-heading blog-heading"><div><h2><img src="https://axtar.az/img/blog-book.svg" alt=""/> Bloglar</h2><p>Daha düzgün qərar verməyiniz üçün faydalı bloglar</p></div><Link href="/posts">Hamısına bax <ArrowRight size={15}/></Link></div><div className="blog-layout"><article className="blog-feature"><Link href={posts[0].href} className="blog-feature-image"><img src={posts[0].image} alt={posts[0].title}/></Link><div className="blog-feature-body"><span>{posts[0].category}</span><h3><Link href={posts[0].href}>{posts[0].title}</Link></h3><p>{posts[0].description}</p><small>{posts[0].author} · {posts[0].date}</small></div><Link className="related-listings" href="/full-search"><strong>Bu bloqda əlaqəli {posts[0].count} aktiv elan</strong><span>Mövzu ilə bağlı satışda olan elanlara baxın <ArrowRight size={15}/></span></Link></article><div className="blog-list">{posts.slice(1).map(post=><article className="blog-mini" key={post.href}><Link href={post.href} className="blog-mini-image"><img src={post.image} alt=""/></Link><div><small>{post.category}</small><h3><Link href={post.href}>{post.title}</Link></h3><p>{post.description}</p><span>{post.date} · {post.count} uyğun elan</span></div></article>)}</div></div></section></div>}
