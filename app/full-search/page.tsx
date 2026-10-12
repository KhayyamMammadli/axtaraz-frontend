import type { Metadata } from "next";
import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import { ListingCard } from "@/features/listings/listing-card";
import { categories, listings } from "@/features/listings/data";

type SearchParams = Promise<{ title?: string; location?: string; tab?: string }>;

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const params = await searchParams;
  const term = params.title?.trim();
  return {
    title: term ? `${term} elanları` : "Elan axtarışı",
    description: term ? `${term} üzrə elanları Axtar.az-da tapın.` : "Axtar.az-da minlərlə elan arasında axtarış edin.",
    robots: { index: Boolean(term), follow: true },
  };
}

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const query = params.title?.trim() ?? "";
  const location = params.location?.trim() ?? "";
  const results = listings.filter((item) => (!query || `${item.title} ${item.category}`.toLocaleLowerCase("az").includes(query.toLocaleLowerCase("az"))) && (!location || item.location === location));
  const shown = results.length ? results : listings;
  return <div className="page-shell search-page"><nav className="breadcrumbs"><Link href="/">Ana səhifə</Link><span>›</span><span>Axtarış</span></nav><div className="search-page-head"><div><span className="eyebrow">Axtar.az elanları</span><h1>{query ? `“${query}” üzrə elanlar` : "Elanları kəşf et"}</h1><p>{results.length} elan tapıldı {location ? `· ${location}` : ""}</p></div><button className="filter-button" type="button"><SlidersHorizontal size={17} /> Filter</button></div><div className="search-layout"><aside className="filter-sidebar"><h2>Filter et</h2><div className="filter-block"><h3>Kateqoriya</h3>{categories.slice(0, 7).map((category) => <Link key={category} href={`/full-search?title=${encodeURIComponent(category)}`}>{category}<span>›</span></Link>)}</div><div className="filter-block"><h3>Elan növü</h3><label><input type="checkbox" defaultChecked /> Təklif edilir</label><label><input type="checkbox" /> Axtarılır</label><label><input type="checkbox" /> İtkin</label></div><div className="filter-block"><h3>Qiymət aralığı</h3><div className="price-range"><input aria-label="Minimum qiymət" placeholder="Min ₼" /><input aria-label="Maksimum qiymət" placeholder="Maks ₼" /></div></div><button className="button-primary filter-apply" type="button">Nəticələri göstər</button></aside><section className="search-results" aria-label="Axtarış nəticələri"><div className="results-toolbar"><span>{shown.length} nəticə</span><label>Çeşidlə: <select defaultValue="recent"><option value="recent">Ən yeni</option><option value="low">Əvvəlcə ucuz</option><option value="high">Əvvəlcə bahalı</option></select></label></div><div className="listing-grid">{shown.map((listing) => <ListingCard key={listing.id} listing={listing} />)}</div></section></div></div>;
}
