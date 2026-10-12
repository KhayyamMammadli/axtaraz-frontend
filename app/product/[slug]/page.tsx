import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { listings } from "@/features/listings/data";
type Props={params:Promise<{slug:string}>};
function getListing(slug:string){return listings.find(x=>x.slug===slug)}
export async function generateMetadata({params}:Props):Promise<Metadata>{const item=getListing((await params).slug);return item?{title:item.title,description:`${item.title} — ${item.price}`,openGraph:{type:"website",images:[item.image]}}:{title:"Elan tapılmadı"}}
export default async function ProductPage({params}:Props){const slug=(await params).slug,item=getListing(slug);if(!item)notFound();const schema={"@context":"https://schema.org","@type":"Product",name:item.title,image:item.image,offers:{"@type":"Offer",priceCurrency:"AZN",price:item.price.replace(/[^0-9]/g,""),url:`https://axtar.az/product/${slug}`}};return <div className="page-shell detail-page"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/><nav className="breadcrumbs"><Link href="/">Ana səhifə</Link><span>›</span><span>{item.title}</span></nav><article className="detail-layout"><div className="detail-main"><h1>{item.title}</h1><div className="detail-photo"><img src={item.image} alt={item.title}/></div><p>{item.location} · {item.age}</p></div><aside className="seller-card"><strong className="detail-price">{item.price}</strong></aside></article></div>}
