import type { Metadata } from "next";
import Link from "next/link";
import { ListingCard } from "@/features/listings/listing-card";
import { listings } from "@/features/listings/data";
type SearchParams=Promise<{title?:string;location?:string}>;
export async function generateMetadata({searchParams}:{searchParams:SearchParams}):Promise<Metadata>{const p=await searchParams;const term=p.title?.trim();return {title:term?`${term} elanları`:"Elanlar",description:term?`${term} üzrə elanlar Axtar.az-da`:"Axtar.az elanları",alternates:{canonical:"/full-search"},robots:{index:!term,follow:true}}}
export default async function SearchPage({searchParams}:{searchParams:SearchParams}){
 const p=await searchParams, term=p.title?.trim().toLocaleLowerCase("az")||"", location=p.location||"";
 const results=listings.filter(x=>(!term||x.title.toLocaleLowerCase("az").includes(term))&&(!location||x.location===location));
 return <div className="page-shell search-page"><div className="listing-filter-row"><button>♧ &nbsp; Filter</button><button>Çeşidlə: <b>Ən çox satılanlar</b>⌄</button><button>Kateqoriya⌄</button><button>Rəng⌄</button><button>Yaş qrupu⌄</button><button>»</button></div><div className="search-results"><h1 className="sr-only">{term? `${p.title} elanları`:"Elanlar"}</h1><div className="listing-grid">{results.map(item=><ListingCard key={item.id} listing={item}/>)}</div>{!results.length&&<p className="empty-state">Elan tapılmadı</p>}<Link className="all-listings-link" href="/">Ana səhifə</Link></div></div>
}
