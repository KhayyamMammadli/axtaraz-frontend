"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Heart, MapPin, Menu, MessageCircle, Plus, Search, X } from "lucide-react";
import { categories } from "@/features/listings/data";

const regions = ["Bütün bölgələr", "Bakı", "Sumqayıt", "Gəncə", "Mingəçevir", "Lənkəran", "Şəki", "Quba"];

export function SiteHeader() {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("Bütün bölgələr");
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <header className="site-header">
      <div className="topbar">
        <div className="topbar-inner page-shell-wide">
          <Link href="/" className="brand" aria-label="Axtar.az ana səhifə"><img src="https://axtar.az/img/logo.svg" alt="axtar.az" /></Link>
          <button className="icon-button menu-toggle" type="button" aria-label={mobileMenu ? "Menyunu bağla" : "Menyunu aç"} onClick={() => setMobileMenu(!mobileMenu)}>{mobileMenu ? <X size={20} /> : <Menu size={20} />}</button>
          <nav className={mobileMenu ? "main-nav is-open" : "main-nav"} aria-label="Əsas menyu">
            <Link href="/full-search?title=Televizor">Elanlar</Link><Link href="/ownerships">Bizneslər</Link><Link href="/posts">Bloqlar</Link>
          </nav>
          <div className="account-actions">
            <Link className="icon-button" href="/full-search?tab=favorites" aria-label="Seçilmişlər"><Heart size={21} /></Link>
            <Link className="icon-button" href="/login" aria-label="Mesajlar"><MessageCircle size={20} /></Link>
            <Link className="login-button" href="/login">Daxil ol</Link>
          </div>
        </div>
      </div>
      <div className="searchbar-wrap page-shell-wide">
        <div className="searchbar">
          <button className={catalogOpen ? "catalog-button is-open" : "catalog-button"} type="button" aria-expanded={catalogOpen} onClick={() => setCatalogOpen(!catalogOpen)}><span className="catalog-glyph">☷</span>Kataloq</button>
          <form action="/full-search" className="main-search">
            <Search size={18} />
            <input name="title" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Axtar..." aria-label="Elan axtar" />
            <label className="region-select"><MapPin size={16} /><select name="location" value={region} onChange={(event) => setRegion(event.target.value)} aria-label="Bölgə seçin">{regions.map((item) => <option key={item} value={item === "Bütün bölgələr" ? "" : item}>{item}</option>)}</select><ChevronDown size={15} /></label>
            <button className="search-submit" type="submit" aria-label="Axtar"><Search size={18} /></button>
          </form>
          <Link href="/full-search?intent=create" className="new-button"><Plus size={20} /><span>Yeni</span></Link>
        </div>
        {catalogOpen && <div className="catalog-panel"><div className="catalog-panel-head"><strong>Kateqoriyalar</strong><button type="button" onClick={() => setCatalogOpen(false)} aria-label="Bağla"><X size={18} /></button></div><div className="catalog-links">{categories.map((category) => <Link key={category} href={`/full-search?title=${encodeURIComponent(category)}`} onClick={() => setCatalogOpen(false)}>{category}<span>›</span></Link>)}</div></div>}
      </div>
    </header>
  );
}
