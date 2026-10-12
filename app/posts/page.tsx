import type { Metadata } from "next";
import Link from "next/link";
export const metadata:Metadata={title:"Bloglar",description:"Daha düzgün qərar verməyiniz üçün faydalı bloglar",alternates:{canonical:"/posts"}};
const posts=[
 {title:"Test",href:"/post/test-3",category:"Elektronika",author:"Xeyyam",date:"16.08.2026",image:"https://storage.axtar.az/uploads/posts/min/2026/08/16/6a81c8c682955-8c473ea6eaaec3447d728283aea346a7.png",description:"test"},
 {title:"test blog 7",href:"/post/test-blog-7",category:"Bloq kateqoriyası",author:"Xeyyam Memmedli",date:"10.06.2026",image:"https://storage.axtar.az/uploads/posts/min/2026/06/10/6a292ee80429a-a242d5f7bd988b2edbdfeb0b1931e8dd.png",description:"SEO"},
 {title:"blog test 6",href:"/post/blog-test-6",category:"Bloq kateqoriyası",author:"Xeyyam Memmedli",date:"10.06.2026",image:"https://storage.axtar.az/uploads/posts/min/2026/06/10/6a29275c18122-c2d40615727189a2200b6088299fd16b.png",description:"test"},
 {title:"test blog 4",href:"/post/test-blog-4-2",category:"Bloq kateqoriyası",author:"Xeyyam Memmedli",date:"10.06.2026",image:"https://storage.axtar.az/uploads/posts/min/2026/06/10/6a292408be5d9-08223c701137bafa279fd0a0f39413f4.png",description:"asdsdas"}
];
export default function PostsPage(){return <div className="page-shell directory-page"><div className="section-heading"><div><h1>Bloglar</h1><p>Daha düzgün qərar verməyiniz üçün faydalı bloglar</p></div></div><div className="blog-directory">{posts.map((post,i)=><article className={i===0?"blog-card blog-feature":"blog-mini"} key={post.href}><Link className={i===0?"blog-feature-image":"blog-mini-image"} href={post.href}><img src={post.image} alt={post.title}/></Link><div className="blog-card-content"><span className="blog-tag">{post.category}</span><h2><Link href={post.href}>{post.title}</Link></h2><p>{post.description}</p><small>{post.author} · {post.date}</small></div></article>)}</div></div>}
