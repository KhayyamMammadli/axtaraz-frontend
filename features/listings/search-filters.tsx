"use client";

import { useRef, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Filter, Plus, X } from "lucide-react";
import styles from "./search-filters.module.css";

const options: Record<string, string[]> = {
  sort: ["Ən çox satılanlar", "Ən yenilər", "Ən köhnələr", "Ən ucuz", "Ən bahalı", "Endirimli məhsullar", "Tövsiyə olunanlar"],
  category: ["Hamısı", "Elektronika", "Ev və bağ", "Nəqliyyat", "Xidmətlər", "Mebel"],
  color: ["Hamısı", "Ağ", "Qara", "Boz", "Qırmızı", "Mavi", "Yaşıl"],
  age: ["Hamısı", "0–1 yaş", "1–3 yaş", "3–6 yaş", "6+ yaş"],
  material: ["Hamısı", "Yaddaş köpüyü", "Lateks", "Pambıq", "Dəri"],
  operation: ["Hamısı", "Avtomatik", "Mexaniki"],
  battery: ["Hamısı", "2000 mAh-a qədər", "2000–4000 mAh", "4000 mAh-dan çox"],
};
const colors = ["#929292","#1717f5","#f1f2f3","#111111","#07820b","#f3f0d7","#ffeb00","#ff9800","#ffb5c4","#f20c0c","#b9362e","#8d13aa","#8ca4d5","#128c8c"];

export function ListingFilterBar({ resultCount = 0 }: { resultCount?: number }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, string>>({sort:"Ən çox satılanlar"});
  const scrollRef = useRef<HTMLDivElement>(null);
  function setValue(key: string, value: string) {
    setValues((current) => ({...current, [key]: value}));
    setActive(null);
  }
  const labels: Record<string,string> = {sort:"Çeşidlə",category:"Kateqoriya",color:"Rəng",age:"Yaş qrupu",material:"Əsas material",operation:"Əməliyyat rejimi",battery:"Batareyanın xüsusiyyəti"};
  const chips = ["sort","category","color","age","material","operation","battery"];
  return <>
    <div className={styles.wrap}>
      <button className={styles.filterButton} onClick={() => {setDrawerOpen(true);setActive(null);}}><Filter size={19}/>Filter</button>
      <button className={styles.arrow} aria-label="Filterləri sola sürüşdür" onClick={() => scrollRef.current?.scrollBy({left:-320,behavior:"smooth"})}><ChevronLeft size={24}/></button>
      <div className={styles.scroller} ref={scrollRef}>
        <div className={styles.chips}>
          {chips.map((key) => <div className={styles.selectWrap} key={key}>
            <button className={`${styles.select} ${active===key?styles.selected:""}`} aria-expanded={active===key} onClick={() => setActive(active===key?null:key)}>
              <span>{labels[key]}{values[key] ? <>: <b>{values[key]}</b></> : null}</span><ChevronDown size={19} className={active===key?styles.up:""}/>
            </button>
            {active===key && <div className={styles.menu}>{options[key].map((option) => <button key={option} className={values[key]===option?styles.optionActive:""} onClick={() => setValue(key,option)}>{option}</button>)}</div>}
          </div>)}
        </div>
      </div>
      <button className={styles.arrow} aria-label="Filterləri sağa sürüşdür" onClick={() => scrollRef.current?.scrollBy({left:320,behavior:"smooth"})}><ChevronRight size={24}/></button>
    </div>
    {drawerOpen && <div className={styles.backdrop} onMouseDown={(event) => {if(event.target===event.currentTarget)setDrawerOpen(false);}}>
      <aside className={styles.drawer} role="dialog" aria-modal="true" aria-label="Filter et">
        <header className={styles.drawerHeader}><h2>Filter et</h2><button aria-label="Bağla" onClick={() => setDrawerOpen(false)}><X size={25}/></button></header>
        <div className={styles.drawerBody}>
          <section className={styles.filterSection}><h3>Kateqoriya <em>(0)</em></h3>{["Yataq otağı mebeli","Düşərgə və Haykinq","Yataq dəstləri","Qonaq otağı mebeli","RV mebel","Körpə və uşaq mebelləri","Veranda mebel"].map(x=><label className={styles.checkPill} key={x}><input type="checkbox"/><span>{x}</span></label>)}<button className={styles.more}><Plus size={19}/>Daha çox göstər</button></section>
          <section className={styles.filterSection}><h3>Rəng <em>(0)</em></h3><div className={styles.colors}>{colors.map((color,i)=><label key={color+i} aria-label={color}><input type="checkbox"/><i style={{backgroundColor:color}}/></label>)}</div></section>
          <section className={styles.filterSection}><h3>Material</h3>{["Yaddaş köpüyü","Lateks","Polivinil xlorid","Pambıq"].map(x=><label className={styles.checkPill} key={x}><input type="checkbox"/><span>{x}</span></label>)}</section>
          <section className={styles.filterSection}><h3>Qiymət</h3><div className={styles.price}><input placeholder="Min" inputMode="numeric"/><span>—</span><input placeholder="Maks" inputMode="numeric"/></div></section>
        </div>
        <footer className={styles.drawerFooter}><button className={styles.reset} onClick={()=>setValues({sort:"Ən çox satılanlar"})}>Sıfırla</button><button className={styles.results} onClick={()=>setDrawerOpen(false)}>91 nəticə</button></footer>
      </aside>
    </div>}
  </>;
}
