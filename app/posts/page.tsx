import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown, Flame, Folder, SlidersHorizontal, UserRound, ArrowRight } from "lucide-react";
export const metadata:Metadata={title:"Bloqlar",description:"Axtar.az bloqları",alternates:{canonical:"/posts"}};
const posts=[
 {title:"Blog 3",href:"/post/blog-3",description:"3 df edfw",date:"29.11.2025",count:"821",image:"https://storage.axtar.az/uploads/posts/min/2025/11/29/692afec9473b7-9665c8a3966ebda6c4d6cdf0ead98d13.jpg"},
 {title:"blog 1",href:"/post/blog-1",description:"sd d",date:"29.11.2025",count:"771",image:"https://storage.axtar.az/uploads/posts/min/2025/11/29/692afe9a52702-259e6b080f4cf901609d3ccd468a5d18.jpg"}
];
export default function PostsPage(){return <div className="page-shell directory-page"><div className="listing-filter-row blog-filter-row"><button><SlidersHorizontal size={16}/> Filter</button><button>⇵ &nbsp; Tarixə görə <ChevronDown size={14}/></button><button><Folder size={16}/> Kateqoriyalar <ChevronDown size={14}/></button><button><UserRound size={16}/> Müəlliflər <ChevronDown size={14}/></button><button><Flame size={16}/> Populyarlıq <ChevronDown size={14}/></button><button>Aç <ChevronDown size={14}/></button></div><div className="blog-directory">{posts.map(post=><Link href={post.href} className="public-blog-card" key={post.href}><img src={post.image} alt={post.title}/><div><div className="public-blog-meta"><span>◉ &nbsp;Bloq kateqoriyası</span><b>ⓑ &nbsp;Tural Rzaxa...　⚙</b></div><h2>{post.title}</h2><p>{post.description}</p><footer><strong>{post.date}</strong><span>{post.count} uyğun elan <ArrowRight size={14}/></span></footer></div></Link>)}</div></div>}
