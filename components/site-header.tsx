"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Heart, List, Menu, MessageCircle, Search, X, Flag, FileText, Phone, Mail, MapPin, ChevronRight, ArrowLeft, Home, UserRound } from "lucide-react";
import { AccountMenu } from "./account-menu";
import { CreateMenu } from "./create-menu";
import { RegionPicker } from "./region-picker";
import { useProductFavorites } from "@/features/favorites/product-favorites";
import { useSession } from "@/features/auth/session";
import styles from "./search-discovery.module.css";
const catalogCategories = [
  { name: "Geyimlər (Kişi, Qadın, Uşaq)", icon: "🤹", items: ["Ümumi 23", "Ümumi", "Ümumi 3", "Ümumi 44", ...Array(24).fill("Ümumi 23"), "Ümumi 23", "Ümumi", "Ümumi 11", "Ümumi 32"] },
  { name: "İdman və əyləncə", icon: "🏢", items: ["Ümumi", "İdman avadanlıqları", "Velosipedlər", "Musiqi alətləri", "Oyunlar", "Turizm və istirahət"] },
  { name: "Qida Məhsulları", icon: "🧃", items: ["Ümumi", "Meyvə və tərəvəz", "Ət və süd məhsulları", "Şirniyyatlar", "İçkilər"] },
  { name: "Restoranlar, Kafelər", icon: "🏡", items: ["Ümumi", "Restoranlar", "Kafelər", "Çatdırılma"] },
  { name: "Qızıl Zinət Əşyaları", icon: "🚚", items: ["Ümumi", "Üzüklər", "Sırğalar", "Boyunbağılar", "Bilərziklər", "Saatlar"] },
  { name: "Tibbi Məhsullar", icon: "🏥", items: ["Ümumi", "Tibbi avadanlıqlar", "Sağlamlıq məhsulları"] },
  { name: "Hazır Bizneslər", icon: "🤹", items: ["Ümumi", "Mağazalar", "Restoran və kafelər", "İstehsalat", "Xidmət sahələri"] },
  { name: "Heyvanlar", icon: "👩🏻‍⚕️", items: ["Ümumi", "İtlər", "Pişiklər", "Quşlar", "Balıqlar", "Digər heyvanlar"] },
  { name: "Uşaq üçün", icon: "🧸", items: ["Ümumi", "Oyuncaqlar", "Uşaq arabaları", "Uşaq mebelləri", "Məktəb ləvazimatları"] },
  ...["İtmiş əşyalar", "Zoo məhsullar", "Təmir və tikinti", "Məişət texnikası", "Ev və bağ üçün", "Komputerlər", "Şəxsi əşyalar", "Avadanlıqlar", "Bazarlıq", "Telefonlar", "Xidmətlər", "Daşınmaz əmlak", "Elektronika"].map(name => ({ name, icon: "🏢", items: ["Ümumi"] })),
];

function SearchForm({ query, setQuery, region, setRegion, metros, setMetros, compact = false }: {
  query: string;
  setQuery: (value: string) => void;
  region: string[];
  setRegion: (value: string[]) => void;
  metros: string[];
  setMetros: (value: string[]) => void;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLFormElement>(null);
  const pathname = usePathname();
  useEffect(() => { setOpen(false); }, [pathname, compact]);
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);
  const searchHref = (title: string) => {
    const params = new URLSearchParams({ title });
    region.forEach(value => params.append("location", value));
    metros.forEach(value => params.append("metro", value));
    return `/full-search?${params}`;
  };
  const suggestions = ["Maşın aksesuarları", "Kişi geyimləri", "Kompüter aksesuarları", "Maus"];
  const categories = ["Qadın saatları", "Kişi ayaqqabıları", "Qış geyimləri və aksesuarları"];
  const products = [
    { title: "Paltaryuyan maşın Bosch...", category: "Paltaryuyan maşınlar", query: "Paltaryuyan maşınlar", price: "1099", oldPrice: "", image: 1 },
    { title: "Televizor LG UHD AI...", category: "Elektronika", query: "Televizor", price: "799.99", oldPrice: "1149.99", image: 2 },
    { title: "Soyuducu LG GN...", category: "Məişət texnikası", query: "Soyuducu", price: "1199", oldPrice: "1459.99", image: 3 },
  ];
  const matches = (text: string) => text.toLocaleLowerCase("az").includes(query.trim().toLocaleLowerCase("az"));
  const visibleProducts = products.filter(product => matches(`${product.title} ${product.category}`));
  return <form ref={root} action="/full-search" className={`${compact ? "main-search compact-search" : "main-search"} ${styles.search} ${open ? styles.active : ""}`}
    onSubmit={() => setOpen(false)} onKeyDown={event => { if (event.key === "Escape") { event.stopPropagation(); setOpen(false); } }}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setOpen(false); }}>
    <Search size={18}/>
    <input name="title" value={query} onFocus={()=>setOpen(true)} onClick={()=>setOpen(true)} onChange={e=>{setQuery(e.target.value);setOpen(true);}} placeholder="Axtar..." aria-label="Elan axtar" autoComplete="off" aria-expanded={open} aria-controls={compact ? "compact-search-discovery" : "search-discovery"}/>
    <div className={styles.region} onFocusCapture={()=>setOpen(false)} onPointerDown={()=>setOpen(false)}><RegionPicker value={region} onChange={setRegion} metros={metros} onMetrosChange={setMetros}/></div>
    {metros.map(value => <input type="hidden" name="metro" value={value} key={value}/>)}
    {region.map(value => <input type="hidden" name="location" value={value} key={value}/>)}
    <button className="search-submit" aria-label="Axtar"><Search size={18}/></button>
    {open && <section id={compact ? "compact-search-discovery" : "search-discovery"} className={styles.panel} aria-label="Axtarış təklifləri">
      <div className={styles.column}>{[{ title: "Tez-tez axtarılanlar", items: suggestions }, { title: "Kateqoriyalar", items: categories }].map(group => <section className={styles.card} key={group.title}>
        <h2>{group.title}</h2><ul className={styles.suggestions}>{group.items.filter(matches).map(item => <li key={item}><Link href={searchHref(item)} onClick={()=>setOpen(false)}><img src="https://axtar.az/img/search-line.svg" alt="" width="21" height="21"/><span>{item}</span><ChevronRight size={15}/></Link></li>)}</ul>
        {!group.items.some(matches) && <p className={styles.empty}>Uyğun təklif tapılmadı</p>}
      </section>)}</div>
      <div className={styles.column}><section className={styles.card}><h2>Məhsullar</h2><ul className={styles.products}>{visibleProducts.map(product => <li key={product.image}><Link href={searchHref(product.query)} onClick={()=>setOpen(false)}>
        <span className={styles.thumb}><img src={`https://axtar.az/img/product/product-${product.image}.jpg`} alt="" width="72" height="72"/></span>
        <span className={styles.copy}><small>{product.category}</small><strong>{product.title}</strong></span>
        <span className={styles.prices}>{product.oldPrice && <del>{product.oldPrice} AZN</del>}<strong>{product.price} <small>AZN</small></strong></span>
      </Link></li>)}</ul>{!visibleProducts.length && <p className={styles.empty}>Uyğun məhsul tapılmadı</p>}</section>
      <Link href={searchHref("Məişət texnikası")} className={styles.banner} onClick={()=>setOpen(false)} aria-label="Məişət texnikasına bax"><img src="https://axtar.az/img/banner/household.webp" alt="Məişət texnikası"/></Link>
      </div>
      {query.trim() && <Link className={styles.allResults} href={searchHref(query)} onClick={()=>setOpen(false)}>“{query}” üçün bütün elanlara bax <ChevronRight size={17}/></Link>}
    </section>}
  </form>;
}
function CatalogPanel({ close }: { close: () => void }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [subcategoriesOpen, setSubcategoriesOpen] = useState(false);
  const categoryButtons = useRef<(HTMLButtonElement | null)[]>([]);
  const backButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (subcategoriesOpen && window.matchMedia("(max-width: 640px)").matches) backButton.current?.focus({ preventScroll: true });
  }, [subcategoriesOpen]);
  const activeCategory = catalogCategories[activeIndex];
  return <div className={`catalog-panel${subcategoriesOpen ? " catalog-show-subcategories" : ""}`} aria-label="Kataloq">
    <div className="catalog-sidebar" aria-label="Kateqoriyalar">
      {catalogCategories.map((category, index) => <button key={category.name}
        ref={element => { categoryButtons.current[index] = element; }} type="button"
        className={index === activeIndex ? "catalog-category is-active" : "catalog-category"}
        onMouseEnter={() => setActiveIndex(index)} onFocus={() => setActiveIndex(index)}
        onClick={() => { setActiveIndex(index); setSubcategoriesOpen(true); }} aria-pressed={index === activeIndex}>
        <span className="catalog-category-icon" aria-hidden="true">{category.icon}</span><span>{category.name}</span><ChevronRight className="catalog-mobile-chevron" size={18}/>
      </button>)}
    </div>
    <div className="catalog-subcategories" aria-label={activeCategory.name}>
      <div className="catalog-mobile-heading"><button ref={backButton} type="button" onClick={() => { setSubcategoriesOpen(false); categoryButtons.current[activeIndex]?.focus({ preventScroll: true }); }} aria-label="Kateqoriyalara qayıt"><ArrowLeft size={20}/></button><strong>{activeCategory.name}</strong></div>
      {activeCategory.items.map((item: string, index: number) => <Link key={`${activeIndex}-${index}`}
        href={`/full-search?title=${encodeURIComponent(item.startsWith("Ümumi") ? activeCategory.name : item)}`} onClick={close}>
        {item} <span>(0)</span>
      </Link>)}
    </div>
  </div>;
}
function InfoMenu({ close }: { close: () => void }) {
  const [section, setSection] = useState<string | null>(null);
  return <section id="site-info-menu" className="site-info-menu" aria-label="Sayt haqqında">
    <div className="page-shell-wide info-menu-inner">
      <div className="info-menu-top">
        <nav className="info-menu-links" aria-label="Məlumat">
          {[{ label: "Haqqımızda", icon: Flag }, { label: "Qaydalar", icon: FileText }, { label: "Əlaqə", icon: Phone }].map(({ label, icon: Icon }) =>
            <button key={label} onClick={() => setSection(section === label ? null : label)} aria-expanded={section === label} className={section === label ? "is-active" : ""}><span><Icon size={21}/></span>{label}<ChevronRight size={16}/></button>)}
        </nav>
        <span className="info-country"><span aria-hidden="true">🇦🇿</span> Azərbaycan</span>
      </div>
      {section && <div className="info-menu-detail"><strong>{section}</strong><p>{section === "Haqqımızda" ? "Axtar.az — elanları, biznesləri və faydalı məlumatları bir araya gətirən platforma. Elanları kəşf edin, biznesləri tapın və öz elanınızı paylaşın." : section === "Qaydalar" ? "Elan yerləşdirərkən məhsul və ya xidmət haqqında düzgün məlumat verin. Satıcı ilə alıcı arasında razılaşmaların şərtlərini əvvəlcədən dəqiqləşdirin." : "Suallarınız və təklifləriniz üçün aşağıdakı əlaqə vasitələrindən istifadə edin."}</p></div>}
      <div className="info-menu-bottom">
        <div className="info-contacts">
          <a href="mailto:support@axtar.az"><span className="info-contact-icon"><Mail size={20}/></span><span><small>Email</small><strong>support@axtar.az</strong></span></a>
          <a href="tel:+994500000000"><span className="info-contact-icon"><Phone size={20}/></span><span><small>Nömrə</small><strong>+99450 000 00 00</strong></span></a>
          <div><span className="info-contact-icon"><MapPin size={20}/></span><span><small>Ünvan</small><strong>Bəşir Abbasquluzadə 46/2</strong></span></div>
        </div>
        <div className="info-socials"><span>Sosial şəbəkələr</span><div>{["Facebook", "Instagram", "Linkedin", "WhatsApp"].map(network => <a key={network} href={network === "WhatsApp" ? "https://wa.me/994500000000" : network === "Linkedin" ? "https://www.linkedin.com/company/axtar-az/" : `https://www.${network.toLowerCase()}.com/axtar.az/`} target="_blank" rel="noreferrer" aria-label={network}><img src={`https://axtar.az/img/${network}.svg`} alt="" width="22" height="22"/></a>)}</div></div>
      </div>
      <nav className="info-mobile-nav" aria-label="Əsas keçidlər"><Link href="/full-search" onClick={close}>Elanlar</Link><Link href="/ownerships" onClick={close}>Bizneslər</Link><Link href="/posts" onClick={close}>Bloqlar</Link></nav>
    </div>
  </section>;
}
export function SiteHeader(){
  const pathname=usePathname();
  const loggedIn = !!useSession().customer;
  const favoriteCount = useProductFavorites().ids.length;
  const[query,setQuery]=useState(""),[region,setRegion]=useState<string[]>([]),[catalogOpen,setCatalogOpen]=useState(false),[mobileMenu,setMobileMenu]=useState(false),[compact,setCompact]=useState(false);
  const [metros,setMetros]=useState<string[]>([]);
  const [navigationHidden, setNavigationHidden] = useState(false);
  const compactRef=useRef(false);
  const headerRef=useRef<HTMLElement>(null);
  useEffect(() => {
    if (!catalogOpen && !mobileMenu) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) { setCatalogOpen(false); setMobileMenu(false); }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setCatalogOpen(false); setMobileMenu(false); }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [catalogOpen, mobileMenu]);
  useEffect(() => { setCatalogOpen(false); setMobileMenu(false); }, [pathname]);
  const isAuthRoute = pathname === "/login" || pathname === "/register" || pathname === "/forgot-password";
  useEffect(() => {
    setNavigationHidden(false);
    let previousY = window.scrollY;
    let distance = 0;
    const onScroll = () => {
      // Clamp rubber-band scrolling so reaching either edge does not reverse direction.
      const y = Math.max(0, Math.min(window.scrollY, document.documentElement.scrollHeight - window.innerHeight));
      const delta = y - previousY;
      previousY = y;
      const editingSearch = headerRef.current?.contains(document.activeElement) && document.activeElement?.matches("input, textarea, select");
      if (!window.matchMedia("(max-width: 640px)").matches || y < 64 || catalogOpen || mobileMenu || editingSearch) {
        distance = 0;
        setNavigationHidden(false);
        return;
      }
      distance = Math.sign(delta) === Math.sign(distance) ? distance + delta : delta;
      if (distance > 10) setNavigationHidden(true);
      else if (distance < -10) setNavigationHidden(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname, catalogOpen, mobileMenu]);
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
  return <><header ref={headerRef} className={`${compact || isAuthRoute ? "site-header is-compact" : "site-header"}${mobileMenu ? " info-is-open" : ""}${navigationHidden ? " navigation-hidden" : ""}`}>
    <div className="topbar"><div className="topbar-inner page-shell-wide">
      <Link href="/" className="brand"><img src="https://axtar.az/img/logo.svg" alt="axtar.az"/></Link>
      <button className="icon-button menu-toggle" aria-label={mobileMenu ? "Menyunu bağla" : "Menyu"} aria-expanded={mobileMenu} aria-controls="site-info-menu" onClick={()=>{setMobileMenu(!mobileMenu);setCatalogOpen(false);}}>{mobileMenu?<X size={20}/>:<Menu size={20}/>}</button>
      <nav className="main-nav">
        <Link className={pathname.startsWith("/full-search")?"active":""} href="/full-search">Elanlar</Link>
        <Link className={pathname.startsWith("/ownership")?"active":""} href="/ownerships">Bizneslər</Link>
        <Link className={pathname.startsWith("/post")?"active":""} href="/posts">Bloqlar</Link>
      </nav>
      <div className="account-actions"><><Link className="icon-button" href="/favorites" aria-label="Seçilmişlər"><Heart size={21}/>{favoriteCount > 0 && <span className="favorites-badge">{favoriteCount}</span>}</Link><Link className="icon-button" href="/messages" aria-label="Mesajlar"><MessageCircle size={20}/></Link><AccountMenu/></></div>
    </div></div>
    {mobileMenu && <InfoMenu close={()=>setMobileMenu(false)}/> }
    <div className="searchbar-wrap page-shell-wide"><div className="searchbar">
      <button className={catalogOpen?"catalog-button is-open":"catalog-button"} aria-expanded={catalogOpen} onClick={()=>setCatalogOpen(!catalogOpen)}><span className="catalog-glyph">☷</span>Kataloq</button>
      <SearchForm query={query} setQuery={setQuery} region={region} setRegion={setRegion} metros={metros} setMetros={setMetros}/>
      <CreateMenu/>
    </div>{catalogOpen&&<CatalogPanel close={()=>setCatalogOpen(false)}/>}</div>
    <div className="compact-header page-shell-wide">
      <Link href="/" className="compact-brand" aria-label="axtar.az"><img src="https://axtar.az/img/logo.svg" alt=""/></Link>
      <div className="compact-catalog-wrap">
      <button className={catalogOpen?"compact-catalog is-open":"compact-catalog"} aria-expanded={catalogOpen} onClick={()=>setCatalogOpen(!catalogOpen)} aria-label="Kataloq"><List size={22}/></button>
        {catalogOpen&&<CatalogPanel close={()=>setCatalogOpen(false)}/>}
      </div>
      <SearchForm query={query} setQuery={setQuery} region={region} setRegion={setRegion} metros={metros} setMetros={setMetros} compact/>
      <button className="compact-menu-toggle" aria-label={mobileMenu ? "Menyunu bağla" : "Menyu"} aria-expanded={mobileMenu} aria-controls="site-info-menu" onClick={()=>{setMobileMenu(!mobileMenu);setCatalogOpen(false);}}>{mobileMenu?<X size={23}/>:<Menu size={23}/>}</button>
      <CreateMenu compact/>
      <Link className="compact-favorite" href="/favorites" aria-label="Seçilmişlər"><Heart size={22}/>{favoriteCount > 0 && <span className="favorites-badge">{favoriteCount}</span>}</Link>
      <Link className="compact-message" href="/messages" aria-label="Mesajlar"><MessageCircle size={21}/></Link>
      <AccountMenu compact/>
    </div>
  </header><nav className="mobile-bottom-nav" aria-label="Mobil əsas keçidlər">
    <Link href="/" aria-current={pathname === "/" ? "page" : undefined} className={pathname === "/" ? "is-active" : ""}><Home size={25} strokeWidth={1.8}/><small>Ana səhifə</small></Link>
    <Link href="/favorites" aria-current={pathname.startsWith("/favorites") ? "page" : undefined} className={pathname.startsWith("/favorites") ? "is-active" : ""}><span className="mobile-favorite-symbol"><Heart size={25} strokeWidth={1.8}/>{favoriteCount > 0 && <span className="favorites-badge">{favoriteCount}</span>}</span><small>Seçilmişlər</small></Link>
    <CreateMenu compact mobile/>
    <Link href="/messages" aria-current={pathname.startsWith("/messages") ? "page" : undefined} className={pathname.startsWith("/messages") ? "is-active" : ""}><MessageCircle size={25} strokeWidth={1.8}/><small>Mesajlarım</small></Link>
    <Link href={loggedIn ? "/account/listings" : "/login"} aria-current={pathname.startsWith("/account") || pathname === "/login" ? "page" : undefined} className={pathname.startsWith("/account") || pathname === "/login" ? "is-active" : ""}><UserRound size={25} strokeWidth={1.8}/><small>{loggedIn ? "Kabinetim" : "Daxil ol"}</small></Link>
  </nav></>;
}
