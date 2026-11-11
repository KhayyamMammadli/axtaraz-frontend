"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, ChevronLeft, ChevronRight, Filter, Plus, X, ArrowDownWideNarrow, CreditCard, Truck, Tag, Folder, UserRound, Flame } from "lucide-react";
import styles from "./search-filters.module.css";

const listingOptions: Record<string, string[]> = {
  sort: ["Ən çox satılanlar", "Ən yenilər", "Ən köhnələr", "Ən ucuz", "Ən bahalı", "Endirimli məhsullar", "Tövsiyə olunanlar"],
  category: ["Hamısı", "Yataq otağı mebeli", "Düşərgə və Haykinq", "Yataq dəstləri", "Qonaq otağı mebeli", "RV mebel", "Körpə və uşaq mebelləri", "Veranda mebel", "Mətbəx mebeli", "Ofis mebeli", "Bağ mebeli"],
  color: ["Hamısı", "Qara", "Ağ", "Göy", "Yaşıl", "Qırmızı", "Boz", "Qəhvəyi", "Qızılı", "Gümüşü"],
  age: ["Hamısı", "0–3 yaş", "Uşaqlar üçün", "Yeniyetmələr üçün", "Böyüklər üçün", "Ailə üçün", "Universal"],
  material: ["Hamısı", "Taxta", "Metal", "Parça", "Dəri", "Plastik", "Şüşə"],
  operation: ["Hamısı", "Avtomatik", "Mexaniki", "Elektron", "Pult ilə idarə", "Sensorlu idarə", "Smart rejim"],
  battery: ["Hamısı", "2000 mAh-a qədər", "2000–4000 mAh", "4000 mAh-dan çox"],
};
const colors = ["#929292","#1717f5","#f1f2f3","#111111","#07820b","#f3f0d7","#ffeb00","#ff9800","#ffb5c4","#f20c0c","#b9362e","#8d13aa","#8ca4d5","#128c8c"];

export type FilterField = { key: string; label: string; options: string[]; icon?: "sort" | "credit" | "delivery" | "discount" | "category" | "author" | "popularity"; allOption?: string; multiple?: boolean; type?: "colors" | "price"; expandable?: boolean; toolbar?: boolean };
export type FilterConfig = { fields: FilterField[]; defaults?: Record<string, string[]>; booleanGroup?: string[]; drawerFields?: FilterField[]; showSelected?: boolean };
const icons = { sort: ArrowDownWideNarrow, credit: CreditCard, delivery: Truck, discount: Tag, category: Folder, author: UserRound, popularity: Flame };
export const listingFilterConfig: FilterConfig = {
  defaults: { sort: ["Ən çox satılanlar"] },
  fields: Object.entries(listingOptions).map<FilterField>(([key, options]) => ({key, options, label: ({sort:"Çeşidlə",category:"Kateqoriya",color:"Rəng",age:"Yaş qrupu",material:"Əsas material",operation:"Əməliyyat rejimi",battery:"Batareyanın xüsusiyyəti"} as Record<string,string>)[key], multiple:key !== "sort", expandable:key === "category", type:key === "color" ? "colors" : undefined})).concat([{key:"price",label:"Qiymət",options:[],multiple:false,expandable:false,type:"price",toolbar:false}] as FilterField[])
};
export function SearchFilterBar({ resultCount = 0, config = listingFilterConfig }: { resultCount?: number; config?: FilterConfig }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, string[]>>(config.defaults ?? {});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [price, setPrice] = useState({ min: "", max: "" });
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{left:number;top:number;width:number;maxHeight:number}|null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const menuRef = useRef<HTMLDivElement>(null);
  const options = Object.fromEntries(config.fields.map(field => [field.key,field.options]));
  const labels = Object.fromEntries(config.fields.map(field => [field.key,field.label]));
  const chips = config.fields.filter(field => field.toolbar !== false).map(field => field.key);
  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;
    const update = () => { setCanLeft(node.scrollLeft > 2); setCanRight(node.scrollLeft + node.clientWidth < node.scrollWidth - 2); };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    node.addEventListener("scroll", update);
    return () => { observer.disconnect(); node.removeEventListener("scroll", update); };
  }, []);
  useEffect(() => {
    if (!drawerOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const close = (event: KeyboardEvent) => { if(event.key === "Escape") setDrawerOpen(false); };
    document.addEventListener("keydown",close);
    return () => { document.body.style.overflow = previous; document.removeEventListener("keydown",close); };
  }, [drawerOpen]);
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
    setValues((current) => ({...current, [key]: value === (config.fields.find(field => field.key === key)?.allOption ?? "Hamısı") ? [] : [value]}));
    setActive(null);
  }

  function toggle(field: FilterField, option: string) {
    setValues(current => ({...current, [field.key]: field.multiple ? (current[field.key]?.includes(option) ? current[field.key].filter(value => value !== option) : [...(current[field.key] ?? []),option]) : [option]}));
  }

  const menu = active && menuPosition ? createPortal(
    <div ref={menuRef} id={`filter-menu-${active}`} className={styles.menu} role="listbox" aria-label={labels[active]}
      style={{left:menuPosition.left,top:menuPosition.top,width:menuPosition.width,maxHeight:menuPosition.maxHeight}}>
      {options[active].map((option) => <button type="button" role="option" aria-selected={values[active]?.includes(option) || (option === (config.fields.find(field => field.key === active)?.allOption ?? "Hamısı") && !values[active]?.length)} key={option}
        className={(values[active]?.includes(option) || (option === (config.fields.find(field => field.key === active)?.allOption ?? "Hamısı") && !values[active]?.length))?styles.optionActive:""} onClick={() => setValue(active,option)}>{option}</button>)}
    </div>,
    document.body
  ) : null;

  return <>
    <div className={styles.wrap}>
      <button type="button" className={styles.filterButton} onClick={() => {setDrawerOpen(true);setActive(null);}}><Filter size={19}/>Filter</button>
      <button type="button" disabled={!canLeft} className={`${styles.arrow} ${styles.leftArrow}`} aria-label="Filterləri sola sürüşdür" onClick={() => scrollRef.current?.scrollBy({left:-320,behavior:"smooth"})}><ChevronLeft size={24}/></button>
      <div className={styles.scroller} ref={scrollRef}>
        <div className={styles.chips}>
          {chips.map((key) => <div className={styles.selectWrap} key={key}>
            <button type="button" ref={(node) => {buttonRefs.current[key]=node;}} className={`${styles.select} ${active===key?styles.selected:""}`}
              aria-expanded={active===key} aria-controls={`filter-menu-${key}`}
              onClick={() => setActive(active===key?null:key)}>
              {(() => { const icon = config.fields.find(field => field.key === key)?.icon; const Icon = icon ? icons[icon] : null; return Icon ? <Icon size={20} className={icon === "discount" ? styles.discountIcon : undefined}/> : null; })()}<span>{labels[key]}{config.showSelected !== false && values[key]?.length && !values[key].includes(labels[key]) && !(key === "sort" && config.booleanGroup) ? <>: <b>{values[key].join(", ")}</b></> : null}</span><ChevronDown size={19} className={active===key?styles.up:""}/>
            </button>
          </div>)}
        </div>
      </div>
      <button type="button" disabled={!canRight} className={`${styles.arrow} ${styles.rightArrow}`} aria-label="Filterləri sağa sürüşdür" onClick={() => scrollRef.current?.scrollBy({left:320,behavior:"smooth"})}><ChevronRight size={24}/></button>
    </div>
    {menu}
    {drawerOpen && <div className={styles.backdrop} onMouseDown={(event) => {if(event.target===event.currentTarget)setDrawerOpen(false);}}>
      <aside className={styles.drawer} role="dialog" aria-modal="true" aria-label="Filter et">
        <header className={styles.drawerHeader}><h2>Filter et</h2><button type="button" aria-label="Bağla" onClick={() => setDrawerOpen(false)}><X size={25}/></button></header>
        <div className={styles.drawerBody}>
          {(config.drawerFields ?? config.fields).filter(field => !config.booleanGroup?.includes(field.key)).map(field => <section className={styles.filterSection} key={field.key}>
            <h3>{field.label} {field.multiple && <em>({values[field.key]?.length ?? 0})</em>}</h3>
            {field.type === "price" ? <div className={styles.price}><input aria-label="Minimum qiymət" placeholder="Min" inputMode="numeric" value={price.min} onChange={event => setPrice({...price,min:event.target.value})}/><span>—</span><input aria-label="Maksimum qiymət" placeholder="Maks" inputMode="numeric" value={price.max} onChange={event => setPrice({...price,max:event.target.value})}/></div> : field.type === "colors" ? <div className={styles.colors}>{colors.map((color,i) => <label key={color} aria-label={field.options[i+1] ?? color}><input type="checkbox" checked={values[field.key]?.includes(color) ?? false} onChange={() => toggle(field,color)}/><i style={{backgroundColor:color}}/></label>)}</div> : <>{field.options.filter(option => option !== (field.allOption ?? "Hamısı")).slice(0,field.expandable && !expanded[field.key] ? 7 : undefined).map(option => <label className={styles.checkPill} key={option}><input type={field.multiple ? "checkbox" : "radio"} name={field.key} checked={values[field.key]?.includes(option) ?? false} onChange={() => toggle(field,option)}/><span>{option}</span></label>)}{field.expandable && field.options.length > 8 && <button type="button" className={styles.more} onClick={() => setExpanded(current => ({...current,[field.key]:!current[field.key]}))}><Plus size={19}/>{expanded[field.key] ? "Daha az göstər" : "Daha çox göstər"}</button>}</>}
          </section>)}
          {config.booleanGroup && <section className={styles.filterSection}><h3>Biznes filtrləri</h3>{config.booleanGroup.map(key => { const field = config.fields.find(field => field.key === key)!; return <label className={styles.checkPill} key={key}><input type="checkbox" checked={!!values[key]?.length} onChange={() => toggle({...field,multiple:true},field.label)}/><span>{field.label}</span></label>; })}</section>}

        </div>
        <footer className={styles.drawerFooter}><button type="button" className={styles.reset} onClick={()=>{setValues(config.defaults ?? {});setPrice({min:"",max:""});}}>Sıfırla</button><button type="button" className={styles.results} onClick={()=>setDrawerOpen(false)}>{resultCount} nəticə</button></footer>
      </aside>
    </div>}
  </>;
}
