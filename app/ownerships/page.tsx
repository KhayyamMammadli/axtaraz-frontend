import type { Metadata } from "next";
import Link from "next/link";
import { OwnershipCard } from "@/features/ownerships/ownership-card";
import { favoriteBusinesses } from "@/features/ownerships/favorite-data";
import { SearchFilterBar } from "@/features/filters/search-filters";
import { businessFilterConfig } from "@/features/ownerships/filter-config";
export const metadata:Metadata={title:"Bizneslər",description:"Axtar.az premium biznesləri",alternates:{canonical:"/ownerships"}};
export default function OwnershipsPage(){return <div className="page-shell directory-page"><SearchFilterBar config={businessFilterConfig} resultCount={favoriteBusinesses.length}/><div className="business-grid directory-business-grid">{favoriteBusinesses.map((ownership)=><OwnershipCard key={ownership.id} ownership={ownership}/>)}</div><section className="business-promo"><span className="business-promo-icon" aria-hidden="true"><i className="business-promo-glyph">&#xf00c;</i></span><div><h2>Biznesiniz daha çox görünsün.</h2><p>Seçilmiş olun və minlərlə müştəriyə çatın.</p><ul className="business-promo-benefits"><li><i className="business-promo-glyph" aria-hidden="true">&#xf002;</i>Axtarışlarda ön sıralarda</li><li><i className="business-promo-glyph" aria-hidden="true">&#xf06e;</i>Daha çox baxış</li><li><i className="business-promo-glyph" aria-hidden="true">&#xf007;</i>Daha çox müştəri</li></ul></div><Link href="/login">Seçilmiş ol <i className="business-promo-glyph" aria-hidden="true">&#xf061;</i></Link></section></div>}
