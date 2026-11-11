"use client";
import { Fragment, useEffect, useRef, useState } from "react";
import { ArrowLeft, ChevronDown, ChevronRight, MapPin, Search, TrainFront, X } from "lucide-react";
import { regions, bakuMetros } from "@/features/listings/regions";
import styles from "./region-picker.module.css";

function MetroIcon() { return <svg width="24" height="24" viewBox="0 0 28 28" fill="none" aria-hidden="true"><circle cx="14" cy="14" r="12" stroke="currentColor" strokeWidth="2"/><path d="m7 18 4-10 3 7 3-7 4 10M6 18h5m6 0h5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>; }
export function RegionPicker({ value, onChange, metros, onMetrosChange }: { value:string[];onChange:(value:string[])=>void;metros:string[];onMetrosChange:(value:string[])=>void }) {
  const [open,setOpen]=useState(false),[metroView,setMetroView]=useState(false),[query,setQuery]=useState("");
  const [draft,setDraft]=useState<string[]>(value),[draftMetros,setDraftMetros]=useState<string[]>(metros);
  const root=useRef<HTMLDivElement>(null),trigger=useRef<HTMLButtonElement>(null);
  useEffect(()=>{
    if(!open)return;
    const outside=(event:PointerEvent)=>{if(!root.current?.contains(event.target as Node))setOpen(false);};
    const escape=(event:KeyboardEvent)=>{if(event.key==="Escape"){event.preventDefault();setOpen(false);trigger.current?.focus();}};
    document.addEventListener("pointerdown",outside);document.addEventListener("keydown",escape);
    return ()=>{document.removeEventListener("pointerdown",outside);document.removeEventListener("keydown",escape);};
  },[open]);
  function toggleRegion(region:string){setDraft(current=>current.includes(region)?current.filter(value=>value!==region):[...current,region]);if(region==="Bakı"&&draft.includes(region))setDraftMetros([]);}
  function apply(){onChange(draft);onMetrosChange(draft.includes("Bakı")?draftMetros:[]);setOpen(false);trigger.current?.focus();}
  const items=(metroView?bakuMetros:regions).filter(item=>item.toLocaleLowerCase("az").includes(query.toLocaleLowerCase("az").trim()));
  return <div className={styles.wrap} ref={root}>
    <div className={styles.triggerRow}><button ref={trigger} type="button" className={`${styles.trigger} ${open?styles.open:""}`} aria-expanded={open} aria-haspopup="dialog" onClick={()=>{setDraft(value);setDraftMetros(metros);setMetroView(false);setQuery("");setOpen(current=>!current);}}><MapPin size={16}/><span>{value.length===1?value[0]:value.length?`${value.length} bölgə`:"Bölgələr"}</span>{value.includes("Bakı")&&metros.length>0&&<span className={styles.metroSummary}><MetroIcon/><b>{metros.length}</b></span>}<ChevronDown size={15}/></button>{value.length>0&&<button type="button" className={styles.clear} aria-label="Bölgə və metro seçimini təmizlə" onClick={()=>{onChange([]);onMetrosChange([]);setDraft([]);setDraftMetros([]);}}><X size={15}/></button>}</div>
    {open&&<div className={styles.panel} role="dialog" aria-label={metroView?"Metro seçimi":"Bölgələri seçin"}>
      {metroView&&<button type="button" className={styles.back} onClick={()=>{setMetroView(false);setQuery("");}}><ArrowLeft size={18}/>Geri</button>}
      <div className={styles.search}><Search size={18}/><input key={metroView?"metro":"region"} autoFocus value={query} onChange={event=>setQuery(event.target.value)} onKeyDown={event=>{if(event.key==="Enter")event.preventDefault();}} placeholder={metroView?"Metro axtar...":"Bölgə axtar..."} aria-label={metroView?"Metro axtar":"Bölgə axtar"}/></div>
      <div className={styles.list}>{items.map(item=><Fragment key={item}><label className={(metroView?draftMetros:draft).includes(item)?styles.selected:""}><input type="checkbox" checked={(metroView?draftMetros:draft).includes(item)} onChange={()=>metroView?setDraftMetros(current=>current.includes(item)?current.filter(value=>value!==item):[...current,item]):toggleRegion(item)}/><span>{item}</span></label>{!metroView&&item==="Bakı"&&draft.includes("Bakı")&&<button type="button" className={styles.metroLink} onClick={()=>{setMetroView(true);setQuery("");}}><TrainFront size={17}/><strong>Metro</strong><span>{draftMetros.length?`${draftMetros.length} metro`:"Fərqi yoxdur"}</span><ChevronRight size={15}/></button>}</Fragment>)}{!items.length&&<p>{metroView?"Metro":"Bölgə"} tapılmadı.</p>}</div>
      <div className={styles.actions}><button type="button" onClick={()=>{if(metroView)setDraftMetros([]);else{setDraft([]);setDraftMetros([]);}setQuery("");}}>Sıfırla</button><button type="button" className={draft.length?styles.hasSelection:""} onClick={metroView?()=>{setMetroView(false);setQuery("");}:apply}>Tətbiq et</button></div>
    </div>}
  </div>;
}
