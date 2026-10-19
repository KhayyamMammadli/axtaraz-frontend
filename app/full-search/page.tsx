import type { Metadata } from "next";
import Link from "next/link";
import { ListingCard } from "@/features/listings/listing-card";
import { LocationFilter } from "@/features/listings/location-filter";
import { listings } from "@/features/listings/data";

type SearchParams = Promise<{ title?: string; location?: string; metro?: string }>;

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const params = await searchParams;
  const term = params.title?.trim();
  return {
    title: term ? `${term} elanları` : "Elanlar",
    description: term ? `${term} üzrə elanlar Axtar.az-da` : "Axtar.az elanları",
    alternates: { canonical: "/full-search" },
    robots: { index: !term, follow: true },
  };
}

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const term = params.title?.trim().toLocaleLowerCase("az") || "";
  const location = params.location || "";
  const results = listings.filter((item) =>
    (!term || item.title.toLocaleLowerCase("az").includes(term)) &&
    (!location || item.location === location)
  );

  return (
    <div className="page-shell search-page">
      <div className="listing-filter-row">
        <LocationFilter title={params.title || ""} location={location} metro={params.metro || ""} />
        <button type="button">Çeşidlə: <b>Ən çox satılanlar</b>⌄</button>
        <button type="button">Kateqoriya⌄</button>
        <button type="button">Rəng⌄</button>
        <button type="button">Yaş qrupu⌄</button>
        <button type="button">»</button>
      </div>
      <div className="search-results">
        <h1 className="sr-only">{term ? `${params.title} elanları` : "Elanlar"}</h1>
        <div className="listing-grid">{results.map((item) => <ListingCard key={item.id} listing={item} />)}</div>
        {!results.length && <p className="empty-state">Elan tapılmadı</p>}
        <Link className="all-listings-link" href="/">Ana səhifə</Link>
      </div>
    </div>
  );
}
