"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight, Plus, Megaphone, Store, Rss, Tag, Search, CircleAlert } from "lucide-react";

const items = [
  { label: "Biznes", href: "/ownerships/create", icon: "\uf54e" },
  { label: "Bloq", href: "/posts/create", icon: "\uf781" },
];

const adTypes = [
  { type: "offer", label: "Təklif edilir", description: "Məhsul və ya xidmət təklif edirəm", icon: "\uf02c" },
  { type: "wanted", label: "Axtarılır", description: "Məhsul, xidmət və ya əmlak axtarıram", icon: "\uf002" },
  { type: "lost", label: "İtkin", description: "İtmiş əşya və ya digər itki barədə", icon: "\uf06a" },
];

export function CreateMenu({ compact = false, mobile = false }: { compact?: boolean; mobile?: boolean }) {
  const [open, setOpen] = useState(false);
  const [adsOpen, setAdsOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) { setOpen(false); setAdsOpen(false); }
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); setAdsOpen(false); trigger.current?.focus(); }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
  }, [open]);
  return <div ref={root} className={`create-menu-wrap${compact ? " create-menu-compact" : ""}${mobile ? " create-menu-mobile" : ""}`}>
    <button ref={trigger} type="button" className={compact ? "compact-create" : "new-button"} aria-label="Yeni yarat" aria-expanded={open} onClick={() => { setOpen(current => !current); setAdsOpen(false); }}><Plus size={compact ? 22 : 20}/>{!compact && "Yeni"}</button>
    {mobile && open && <nav className={`mobile-create-dropdown${adsOpen ? " mobile-create-types" : ""}`} aria-label={adsOpen ? "Elan növünü seçin" : "Yeni yarat"}>
      {adsOpen ? <>
        <button type="button" className="mobile-create-back" onClick={() => setAdsOpen(false)}><ArrowLeft size={20}/>Yeni elan</button>
        {adTypes.map((item, index) => { const Icon = [Tag, Search, CircleAlert][index]; return <Link key={item.type} className="mobile-create-type" href={`/product/create?type=${item.type}`} onClick={() => { setOpen(false); setAdsOpen(false); }}><span className="mobile-create-icon"><Icon size={24} strokeWidth={1.7}/></span><span><strong>{item.label}</strong><small>{item.description}</small></span><ChevronRight size={19}/></Link>; })}
      </> : <>
        <button type="button" className="mobile-create-main-item" aria-expanded={adsOpen} onClick={() => setAdsOpen(true)}><span className="mobile-create-icon"><Megaphone size={24} strokeWidth={1.7}/></span><strong>Yeni elan</strong><ChevronRight size={19}/></button>
        {[{ label: "Yeni biznes", href: "/ownerships/create", icon: Store }, { label: "Yeni bloq", href: "/posts/create", icon: Rss }].map(({ label, href, icon: Icon }) => <Link className="mobile-create-main-item" key={href} href={href} onClick={() => setOpen(false)}><span className="mobile-create-icon"><Icon size={24} strokeWidth={1.7}/></span><strong>{label}</strong><ChevronRight size={19}/></Link>)}
      </>}
    </nav>}
    {!mobile && open && <nav className="create-dropdown" aria-label="Yeni yarat">
      <div className={`create-ad-group${adsOpen ? " is-open" : ""}`} onMouseEnter={() => setAdsOpen(true)} onMouseLeave={() => setAdsOpen(false)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setAdsOpen(false); }}>
        <button type="button" className="create-ad-trigger" aria-expanded={adsOpen} onFocus={() => setAdsOpen(true)} onClick={() => setAdsOpen(true)}><span className="create-item-icon" aria-hidden="true">{"\uf0a1"}</span><span>Elan</span><ChevronRight size={17}/></button>
        {adsOpen && <div className="create-ad-submenu" aria-label="Elan növünü seçin">
          {adTypes.map(item => <Link key={item.type} href={`/product/create?type=${item.type}`} onClick={() => { setOpen(false); setAdsOpen(false); }}><span className="create-ad-icon" aria-hidden="true">{item.icon}</span><span><strong>{item.label}</strong><small>{item.description}</small></span></Link>)}
        </div>}
      </div>
      {items.map(item => <Link key={item.label} href={item.href} onClick={() => setOpen(false)}><span className="create-item-icon" aria-hidden="true">{item.icon}</span><span>{item.label}</span><ChevronRight size={17}/></Link>)}
    </nav>}
  </div>;
}
