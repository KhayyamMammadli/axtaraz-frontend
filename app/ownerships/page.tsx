import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { OwnershipCard } from "@/features/ownerships/ownership-card";
import { favoriteBusinesses } from "@/features/ownerships/favorite-data";
import { SearchFilterBar } from "@/features/filters/search-filters";
import { businessFilterConfig } from "@/features/ownerships/filter-config";
export const metadata:Metadata={title:"Bizneslər",description:"Axtar.az premium biznesləri",alternates:{canonical:"/ownerships"}};
export default function OwnershipsPage(){return <div className="page-shell directory-page"><SearchFilterBar config={businessFilterConfig} resultCount={favoriteBusinesses.length}/><div className="business-grid directory-business-grid">{favoriteBusinesses.map((ownership)=><OwnershipCard key={ownership.id} ownership={ownership}/>)}</div><section className="business-promo"><span className="business-promo-icon">✓</span><div><h2>Biznesiniz daha çox görünsün.</h2><p>Seçilmiş olun və minlərlə müştəriyə çatın.</p><div>⌕ &nbsp; Axtarışlarda ön sıralarda &nbsp;&nbsp; ◉ &nbsp; Daha çox baxış &nbsp;&nbsp; Daha çox müştəri</div></div><Link href="/login">Seçilmiş ol <ArrowRight size={16}/></Link></section></div>}
