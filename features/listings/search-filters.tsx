"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, ChevronLeft, ChevronRight, Filter, Plus, X } from "lucide-react";
import styles from "./search-filters.module.css";

const options: Record<string, string[]> = {
  sort: ["Ən çox satılanlar", "Ən yenilər", "Ən köhnələr", "Ən ucuz", "Ən bahalı", "Endirimli məhsullar", "Tövsiyə olunanlar"],
  category: ["Hamısı", "Yataq otağı mebeli", "Düşərgə və Haykinq", "Yataq dəstləri", "Qonaq otağı mebeli", "RV mebel", "Körpə və uşaq mebelləri", "Veranda mebel", "Mətbəx mebeli", "Ofis mebeli", "Bağ mebeli"],
  color: ["Hamısı", "Qara", "Ağ", "Göy", "Yaşıl", "Qırmızı", "Boz", "Qəhvəyi", "Qızılı", "Gümüşü"],
  age: ["Hamısı", "0–3 yaş", "Uşaqlar üçün", "Yeniyetmələr üçün", "Böyüklər üçün", "Ailə üçün", "Universal"],
  material: ["Hamısı", "Taxta", "Metal", "Parça", "Dəri", "Plastik", "Şüşə"],
  operation: ["Hamısı", "Avtomatik", "Mexaniki", "Elektron", "Pult ilə idarə", "Sensorlu idarə", "Smart rejim"],
  battery: ["Hamısı", "2000 mAh-a qədər", "2000–4000 mAh", "4000 mAh-dan çox"],
};
const colors = ["#929292","#1717f5","#f1f2f3","#111111","#07820b","#f3f0d7","#ffeb00","#ff9800","#ffb5c4","#f20c0c","#b9362e","#8d13aa","#8ca4d5","#128c8c"];

export function ListingFilterBar({ resultCount = 0 }: { resultCount?: number }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, string>>({sort:"Ən çox satılanlar"});
  const [menuPosition, setMenuPosition] = useState<{left:number;top:number;width:number;maxHeight:number}|null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const menuRef = useRef<HTMLDivElement>(null);

  const labels: Record<string,string> = {sort:"Çeşidlə",category:"Kateqoriya",color:"Rəng",age:"Yaş qrupu",material:"Əsas material",operation:"Əməliyyat rejimi",battery:"Batareyanın xüsusiyyəti"};
  const chips = ["sort","category","color","age","material","operation","battery"];

  useEffect(() => {
    if (!active) { setMenuPosition(null); return; }
    const updatePosition = () => {
      const rect = buttonRefs.current[active]?.getBoundingClientRect();
      if (!rect) return;
      const width = Math.min(Math.max(rect.width, 230), window.innerWidth - 16);
      const idealHeight = Math.min(420, options[active].length * 42 + 18);
      const below = window.innerHeight - rect.bottom - 8;
      const openBelow = below >= Math.min(idealHeight, 190) || rect.top < idealHeight + 16;
      const maxHeight = Math.max(100, Math.min(idealHeight, openBelow ? below : rect.top - 8));
      const top = openBelow ? rect.bottom + 3 : rect.top - maxHeight - 3;
      const left = Math.max(8, Math.min(rect.left, window.innerWidth - width - 8));
      setMenuPosition({left, top:Math.max(8,top), width, maxHeight});
    };
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    const closeOnOutside = (event: PointerEvent) => {
      const target = event.target as Node;
      if (menuRef.current?.contains(target) || buttonRefs.current[active]?.contains(target)) return;
      setActive(null);
    };
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setActive(null); };
    document.addEventListener("pointerdown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      document.removeEventListener("pointerdown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [active]);

  function setValue(key: string, value: string) {
    setValues((current) => ({...current, [key]: value}));
    setActive(null);
  }

  const menu = active && menuPosition ? createPortal(
    <div ref={menuRef} id={`filter-menu-${active}`} className={styles.menu} role="listbox" aria-label={labels[active]}
      style={{left:menuPosition.left,top:menuPosition.top,width:menuPosition.width,maxHeight:menuPosition.maxHeight}}>
      {options[active].map((option) => <button type="button" role="option" aria-selected={values[active]===option} key={option}
        className={values[active]===option?styles.optionActive:""} onClick={() => setValue(active,option)}>{option}</button>)}
    </div>,
    document.body
  ) : null;

  return <>
    <div className={styles.wrap}>
      <button type="button" className={styles.filterButton} onClick={() => {setDrawerOpen(true);setActive(null);}}><Filter size={19}/>Filter</button>
      <button type="button" className={styles.arrow} aria-label="Filterləri sola sürüşdür" onClick={() => scrollRef.current?.scrollBy({left:-320,behavior:"smooth"})}><ChevronLeft size={24}/></button>
      <div className={styles.scroller} ref={scrollRef}>
        <div className={styles.chips}>
          {chips.map((key) => <div className={styles.selectWrap} key={key}>
            <button type="button" ref={(node) => {buttonRefs.current[key]=node;}} className={`${styles.select} ${active===key?styles.selected:""}`}
              aria-expanded={active===key} aria-controls={`filter-menu-${key}`}
              onClick={() => setActive(active===key?null:key)}>
              <span>{labels[key]}{values[key] ? <>: <b>{values[key]}</b></> : null}</span><ChevronDown size={19} className={active===key?styles.up:""}/>
            </button>
          </div>)}
        </div>
      </div>
      <button type="button" className={styles.arrow} aria-label="Filterləri sağa sürüşdür" onClick={() => scrollRef.current?.scrollBy({left:320,behavior:"smooth"})}><ChevronRight size={24}/></button>
    </div>
    {menu}
    {drawerOpen && <div className={styles.backdrop} onMouseDown={(event) => {if(event.target===event.currentTarget)setDrawerOpen(false);}}>
      <aside className={styles.drawer} role="dialog" aria-modal="true" aria-label="Filter et">
        <header className={styles.drawerHeader}><h2>Filter et</h2><button type="button" aria-label="Bağla" onClick={() => setDrawerOpen(false)}><X size={25}/></button></header>
        <div className={styles.drawerBody}>
          <section className={styles.filterSection}><h3>Kateqoriya <em>(0)</em></h3>{["Yataq otağı mebeli","Düşərgə və Haykinq","Yataq dəstləri","Qonaq otağı mebeli","RV mebel","Körpə və uşaq mebelləri","Veranda mebel"].map(x=><label className={styles.checkPill} key={x}><input type="checkbox"/><span>{x}</span></label>)}<button type="button" className={styles.more}><Plus size={19}/>Daha çox göstər</button></section>
          <section className={styles.filterSection}><h3>Rəng <em>(0)</em></h3><div className={styles.colors}>{colors.map((color,i)=><label key={color+i} aria-label={color}><input type="checkbox"/><i style={{backgroundColor:color}}/></label>)}</div></section>
          <section className={styles.filterSection}><h3>Material</h3>{["Yaddaş köpüyü","Lateks","Polivinil xlorid","Pambıq"].map(x=><label className={styles.checkPill} key={x}><input type="checkbox"/><span>{x}</span></label>)}</section>
          <section className={styles.filterSection}><h3>Qiymət</h3><div className={styles.price}><input placeholder="Min" inputMode="numeric"/><span>—</span><input placeholder="Maks" inputMode="numeric"/></div></section>
        </div>
        <footer className={styles.drawerFooter}><button type="button" className={styles.reset} onClick={()=>setValues({sort:"Ən çox satılanlar"})}>Sıfırla</button><button type="button" className={styles.results} onClick={()=>setDrawerOpen(false)}>{resultCount || 91} nəticə</button></footer>
      </aside>
    </div>}
  </>;
}
