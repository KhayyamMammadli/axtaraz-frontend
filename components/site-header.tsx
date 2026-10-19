"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronDown, Heart, List, MapPin, Menu, MessageCircle, Plus, Search, X } from "lucide-react";
const regions=["Bütün bölgələr","Bakı","Sumqayıt","Gəncə","Mingəçevir","Lənkəran","Şəki","Quba"];
const categories=["Hazır bizneslər","Heyvanlar","Uşaqlar üçün","İtmiş əşyalar","Geyimlər, Kişi, Qadın, Uşaq","İdman və əyləncə","Zoo məhsullar","Təmir və tikinti","Məişət texnikası","Ev və bağ üçün","Komputerlər","Qida məhsulları","Restoranlar Kafelər","Qızıl zinət əşyaları","Tibbi məhsullar","Şəxsi əşyalar","Avadanlıqlar","Bazarlıq","Telefonlar","Xidmətlər","Daşınmaz əmlak","Elektronika"];

function SearchForm({ query, setQuery, region, setRegion, compact = false }: {
  query: string;
  setQuery: (value: string) => void;
  region: string;
  setRegion: (value: string) => void;
  compact?: boolean;
}) {
  return <form action="/full-search" className={compact ? "main-search compact-search" : "main-search"}>
    <Search size={18}/>
    <input name="title" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Axtar..." aria-label="Elan axtar"/>
    <label className="region-select"><MapPin size={16}/><select name="location" value={region} onChange={e=>setRegion(e.target.value)}>{regions.map(x=><option key={x} value={x==="Bütün bölgələr"?"":x}>{x}</option>)}</select><ChevronDown size={15}/></label>
    <button className="search-submit" aria-label="Axtar"><Search size={18}/></button>
  </form>;
}
function CatalogPanel({ close }: { close: () => void }) {
  return <div className="catalog-panel"><div className="catalog-panel-head"><strong>Kateqoriyalar</strong><button onClick={close} aria-label="Bağla"><X size={18}/></button></div><div className="catalog-links">{categories.map(x=><Link key={x} href={`/full-search?title=${encodeURIComponent(x)}`}>{x}<span>›</span></Link>)}</div></div>;
}
export function SiteHeader(){
  const pathname=usePathname();
  const[query,setQuery]=useState(""),[region,setRegion]=useState("Bütün bölgələr"),[catalogOpen,setCatalogOpen]=useState(false),[mobileMenu,setMobileMenu]=useState(false),[compact,setCompact]=useState(false);
  const compactRef=useRef(false);
  const isAuthRoute = pathname === "/login" || pathname === "/register" || pathname === "/forgot-password";
  useEffect(()=>{
    const onScroll=()=>{
      const scrollY=window.scrollY;
      if(!compactRef.current && scrollY>180){
        compactRef.current=true;
        setCompact(true);
      }else if(compactRef.current && scrollY<55){
        compactRef.current=false;
        setCompact(false);
      }
    };
    onScroll();
    window.addEventListener("scroll",onScroll,{passive:true});
    return ()=>window.removeEventListener("scroll",onScroll);
  },[]);
  return <header className={compact || isAuthRoute ? "site-header is-compact" : "site-header"}>
    <div className="topbar"><div className="topbar-inner page-shell-wide">
      <Link href="/" className="brand"><img src="https://axtar.az/img/logo.svg" alt="axtar.az"/></Link>
      <button className="icon-button menu-toggle" aria-label="Menyu" onClick={()=>setMobileMenu(!mobileMenu)}>{mobileMenu?<X size={20}/>:<Menu size={20}/>}</button>
      <nav className={mobileMenu?"main-nav is-open":"main-nav"}>
        <Link className={pathname.startsWith("/full-search")?"active":""} href="/full-search?title=Televizor">Elanlar</Link>
        <Link className={pathname.startsWith("/ownership")?"active":""} href="/ownerships">Bizneslər</Link>
        <Link className={pathname.startsWith("/post")?"active":""} href="/posts">Bloqlar</Link>
      </nav>
      <div className="account-actions"><><Link className="icon-button" href="/favorites" aria-label="Seçilmişlər"><Heart size={21}/></Link><Link className="icon-button" href="/messages" aria-label="Mesajlar"><MessageCircle size={20}/></Link><Link className="login-button" href="/login">Daxil ol</Link></></div>
    </div></div>
    <div className="searchbar-wrap page-shell-wide"><div className="searchbar">
      <button className={catalogOpen?"catalog-button is-open":"catalog-button"} onClick={()=>setCatalogOpen(!catalogOpen)}><span className="catalog-glyph">☷</span>Kataloq</button>
      <SearchForm query={query} setQuery={setQuery} region={region} setRegion={setRegion}/>
      <Link href="/product/create" className="new-button"><Plus size={20}/>Yeni</Link>
    </div>{catalogOpen&&<CatalogPanel close={()=>setCatalogOpen(false)}/>}</div>
    <div className="compact-header page-shell-wide">
      <Link href="/" className="compact-brand" aria-label="axtar.az"><img src="https://axtar.az/img/logo.svg" alt=""/></Link>
      <div className="compact-catalog-wrap">
        <button className={catalogOpen?"compact-catalog is-open":"compact-catalog"} onClick={()=>setCatalogOpen(!catalogOpen)} aria-label="Kataloq"><List size={22}/></button>
        {catalogOpen&&<CatalogPanel close={()=>setCatalogOpen(false)}/>}
      </div>
      <SearchForm query={query} setQuery={setQuery} region={region} setRegion={setRegion} compact/>
      <Link href="/product/create" className="compact-create" aria-label="Yeni elan"><Plus size={22}/></Link>
      <Link className="compact-favorite" href="/favorites" aria-label="Seçilmişlər"><Heart size={22}/><span className="favorites-badge">5</span></Link>
      <Link className="compact-message" href="/messages" aria-label="Mesajlar"><MessageCircle size={21}/></Link>
      <Link className="compact-login" href="/login">Daxil ol</Link>
    </div>
  </header>;
}
