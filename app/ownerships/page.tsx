import type { Metadata } from "next";
import Link from "next/link";
export const metadata:Metadata={title:"Bizneslər",description:"Axtar.az premium biznesləri",alternates:{canonical:"/ownerships"}};
const image="https://storage.axtar.az/uploads/ownerships_main/min/2026/06/05/e7aac09e3bdeefa0c19f2791ddba60dd.png";
export default function OwnershipsPage(){return <div className="page-shell directory-page"><div className="section-heading"><h1>Premium Bizneslər</h1></div><div className="business-grid directory-business-grid">{["Test MMC","TEst 2","template 2"].map(name=><article className="business-card" key={name}><Link className="business-cover" href="/ownerships"><img src={image} alt=""/></Link><div className="business-avatar"><img src={image} alt=""/></div><div className="business-toolbar"><Link className="outline-button" href="/login">İzlə</Link></div><div className="business-body"><h2>{name}</h2><span className="business-count">0 elan</span></div></article>)}</div></div>}
