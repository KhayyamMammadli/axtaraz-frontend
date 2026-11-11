"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronRight, Plus } from "lucide-react";

const items = [
  { label: "Biznes", href: "/ownerships/create", icon: "\uf54e" },
  { label: "Bloq", href: "/posts/create", icon: "\uf781" },
];

const adTypes = [
  { type: "offer", label: "Təklif edilir", description: "Məhsul və ya xidmət təklif edirəm", icon: "\uf02c" },
  { type: "wanted", label: "Axtarılır", description: "Məhsul, xidmət və ya əmlak axtarıram", icon: "\uf002" },
  { type: "lost", label: "İtkin", description: "İtmiş əşya və ya digər itki barədə", icon: "\uf06a" },
];

export function CreateMenu({ compact = false }: { compact?: boolean }) {
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
  return <div ref={root} className={`create-menu-wrap${compact ? " create-menu-compact" : ""}`}>
    <button ref={trigger} type="button" className={compact ? "compact-create" : "new-button"} aria-label="Yeni yarat" aria-expanded={open} onClick={() => { setOpen(current => !current); setAdsOpen(false); }}><Plus size={compact ? 22 : 20}/>{!compact && "Yeni"}</button>
    {open && <nav className="create-dropdown" aria-label="Yeni yarat">
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
