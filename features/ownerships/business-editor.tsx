"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, ChartNoAxesColumnIncreasing, Headphones, LockKeyhole, ImageIcon, UploadCloud, Trash2, Plus, MapPin, Phone, Eye, Star, ShoppingBag, Gem, Users, Send } from "lucide-react";
import { businessPlans } from "./business-plans";
import styles from "./business-editor.module.css";
const days = ["Bazar ertəsi", "Çərşənbə axşamı", "Çərşənbə", "Cümə axşamı", "Cümə", "Şənbə", "Bazar"];
const categories = ["Nəqliyyat", "Elektronika", "Daşınmaz əmlak", "Xidmətlər", "Telefonlar", "Şəxsi əşyalar", "Kompüterlər", "Ev və bağ üçün", "Məişət texnikası", "Təmir və tikinti"];
type Picture = { id: string; url: string; name: string };
export function BusinessEditor({ initialPlan, initialPeriod }: { initialPlan: string; initialPeriod: number }) {
  const [planId, setPlanId] = useState(initialPlan);
  const [viewedPlanId, setViewedPlanId] = useState(initialPlan);
  const [period, setPeriod] = useState(initialPeriod);
  const [data, setData] = useState({ category: "", city: "", name: "", slogan: "", about: "", phone: "", subdomain: "", address: "" });
  const [pictures, setPictures] = useState<{ logo: Picture[]; cover: Picture[]; gallery: Picture[] }>({ logo: [], cover: [], gallery: [] });
  const [phones, setPhones] = useState<{id:string;value:string}[]>([]);
  const [sameHours, setSameHours] = useState(false);
  const [hours, setHours] = useState(days.map((day,i) => ({day,start:i === 5 ? "10:00" : i === 6 ? "12:00" : "09:00",end:i === 5 ? "16:00" : i === 6 ? "17:00" : "18:00"})));
  const [message, setMessage] = useState("");
  const [tab, setTab] = useState("Haqqımızda");
  const [expandedAbout, setExpandedAbout] = useState(false);
  const urls = useRef(new Set<string>());
  useEffect(() => { const current = urls.current; return () => current.forEach(url => URL.revokeObjectURL(url)); }, []);
  const plan = businessPlans.find(plan => plan.id === viewedPlanId)!;
  const galleryLimit = planId === "premium" ? 100 : planId === "business" ? 30 : 15;
  const field = (key: keyof typeof data) => ({value:data[key],onChange:(event:React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) => setData(current => ({...current,[key]:event.target.value}))});
  function selectPlan(id:string) { const limit = id === "premium" ? 100 : id === "business" ? 30 : 15; if(pictures.gallery.length > limit) { setMessage(`Bu paketdə maksimum ${limit} qalereya şəkli ola bilər. Artıq şəkilləri silin.`); return; } setPlanId(id);setViewedPlanId(id);setMessage(""); }
  function upload(kind:keyof typeof pictures, files:FileList|null) {
    if(!files) return;
    const added:Picture[] = [];let error = "";
    const limit = kind === "gallery" ? galleryLimit - pictures.gallery.length : 1;
    for(const file of Array.from(files)) {
      if(!["image/jpeg","image/png"].includes(file.type) || file.size > 5*1024*1024) { error = "Yalnız 5 MB-dək JPG və PNG şəkillər qəbul edilir.";continue; }
      if(added.length >= limit) {error = `Maksimum ${kind === "gallery" ? galleryLimit : 1} şəkil seçə bilərsiniz.`;break;}
      const url=URL.createObjectURL(file);urls.current.add(url);added.push({id:crypto.randomUUID(),url,name:file.name});
    }
    if(added.length) { if(kind !== "gallery") pictures[kind].forEach(picture => {URL.revokeObjectURL(picture.url);urls.current.delete(picture.url);});setPictures(current => ({...current,[kind]:kind === "gallery" ? [...current.gallery,...added] : added})); }
    setMessage(error);
  }
  function remove(kind:keyof typeof pictures,picture:Picture) {URL.revokeObjectURL(picture.url);urls.current.delete(picture.url);setPictures(current => ({...current,[kind]:current[kind].filter(item=>item.id!==picture.id)}));}
  function submit(event:FormEvent) { event.preventDefault(); if(!pictures.logo.length || !pictures.cover.length) {setMessage("Mağaza loqosu və örtük şəklini əlavə edin.");return;} setMessage("Məlumatlar hazırdır. Yoxlamaya göndərmək üçün server bağlantısı hələ qoşulmayıb."); }
  function uploadBox(kind:keyof typeof pictures, title:string) { return <label className={styles.upload} onDragOver={event=>event.preventDefault()} onDrop={event=>{event.preventDefault();upload(kind,event.dataTransfer.files);}}><UploadCloud size={25}/><strong>{title}</strong><small>{kind === "logo" ? "PNG, JPG (500×500px)" : kind === "gallery" ? `Maksimum ${galleryLimit} şəkil yükləyə bilərsiniz` : "və ya sürükləyib buraxın"}</small>{kind === "logo" && <small>və ya sürükləyib buraxın</small>}<input type="file" aria-label={title} accept="image/jpeg,image/png" multiple={kind === "gallery"} onChange={event=>{upload(kind,event.target.files);event.target.value="";}}/></label>; }
  const logo=pictures.logo[0]?.url,cover=pictures.cover[0]?.url;
  return <div className={styles.page} data-business-editor><div className="page-shell"><div className={styles.heading}><Link href="/ownerships/create" aria-label="Paketlərə qayıt"><ArrowLeft size={23}/></Link><h1>Yeni biznes yarat</h1></div>
    <div className={styles.layout}>
      <aside className={`${styles.panel} ${styles.packages}`}><h2>1. Paket seçim</h2><p>Ehtiyacınıza ən uyğun paketi seçərək başlayın.</p><div className={styles.planTabs}>{["start","premium","business"].map(id=><button type="button" key={id} aria-pressed={id===planId} className={id===planId?styles.active:""} onClick={()=>setViewedPlanId(id)}>{id === "business" ? "BİZNES" : id.toUpperCase()}</button>)}</div>
        <div className={styles.planCard}><div className={styles.planHead}><ChartNoAxesColumnIncreasing size={43}/><div><h3>{plan.name}</h3><strong>{plan.price*period/30} AZN<small>/ {period} gün</small></strong></div></div><ul>{plan.features.map(feature=><li key={feature}><Check size={15}/>{feature}</li>)}</ul><button type="button" className={styles.chosen} aria-pressed={planId === viewedPlanId} onClick={() => selectPlan(viewedPlanId)}>{planId === viewedPlanId ? <>Seçildi <Check size={17}/></> : "Seç"}</button></div>
        <div className={styles.periods}>{[30,60,90,180].map(value=><button type="button" key={value} aria-pressed={period===value} className={period===value?styles.active:""} onClick={()=>setPeriod(value)}>{value} gün{value===period&&<span>seçili</span>}</button>)}</div>
        <div className={styles.secure}><LockKeyhole size={13}/>Ödəniş təhlükəsizdir və məlumatlarınız qorunur.</div><a href="https://axtar.az/contact" className={styles.help}><Headphones size={27}/><div><strong>Yardıma ehtiyacınız var?</strong><p>Bizə yazın, sizə kömək edək.</p></div></a>
      </aside>
      <form className={`${styles.panel} ${styles.form}`} onSubmit={submit}><h2>2. Biznes məlumatlarınızı daxil edin</h2><h3>Ümumi məlumatlar</h3>
        <label>Kateqoriya <em>*</em><select required {...field("category")}><option value="">Seçin</option>{categories.map(value=><option key={value}>{value}</option>)}</select></label>
        <label>Şəhər<select {...field("city")}><option value="">Seçin</option>{["Bakı","Sumqayıt","Gəncə","Şəki","Lənkəran","Quba"].map(value=><option key={value}>{value}</option>)}</select></label>
        <label>Biznes adı <em>*</em><input required maxLength={100} placeholder="Məs: Modern Home" {...field("name")}/></label>
        <label>Sloqan <small>(istəyə bağlı)</small><span className={styles.count}>{data.slogan.length}/80</span><input maxLength={80} placeholder="Məs: Eviniz üçün ən yaxşı seçimlər" {...field("slogan")}/></label>
        <label>Haqqımızda <em>*</em><div className={styles.textarea}><textarea required maxLength={1000} placeholder="Biznesiniz haqqında məlumat yazın..." {...field("about")}/><span>{data.about.length}/1000</span></div></label>
        <h3>Vizual materiallar</h3><div className={styles.uploadSection}><strong>Mağaza loqosu <em>*</em></strong><div className={styles.logoUpload}><div className={styles.logoSample}>{logo?<img src={logo} alt="Mağaza loqosu"/>:<ImageIcon size={28}/>}</div>{uploadBox("logo","Loqo yüklə")}</div></div>
        <div className={styles.uploadSection}><strong>Mağazanın örtüyü (cover) <em>*</em></strong>{uploadBox("cover","Örtük şəkli yüklə")}{cover&&<div className={styles.coverThumb}><img src={cover} alt="Örtük şəkli"/><button type="button" aria-label="Örtük şəklini sil" onClick={()=>remove("cover",pictures.cover[0])}><Trash2 size={15}/></button></div>}</div>
        <div className={styles.uploadSection}><strong>Qalereya şəkilləri <small>(istəyə bağlı)</small><span className={styles.count}>{pictures.gallery.length} / {galleryLimit} şəkil</span></strong>{uploadBox("gallery","Şəkil əlavə et")}<div className={styles.thumbnails}>{pictures.gallery.map(picture=><div key={picture.id}><img src={picture.url} alt={picture.name}/><button type="button" aria-label="Qalereya şəklini sil" onClick={()=>remove("gallery",picture)}><Trash2 size={13}/></button></div>)}</div></div>
        <h3>İş saatları</h3><div className={styles.radioGroup}><label><input type="radio" name="business-hours" checked={sameHours} onChange={()=>{setSameHours(true);if(!hours.length)setHours([{day:days[0],start:"09:00",end:"18:00"}]);}}/>Hər gün eyni saatlarda</label><label><input type="radio" name="business-hours" checked={!sameHours} onChange={()=>setSameHours(false)}/>Fərqli iş qrafiki</label></div>
        {(sameHours?hours.slice(0,1):hours).map(row=><div className={styles.hours} key={row.day}><strong>{sameHours?"Hər gün":row.day}</strong><input type="time" aria-label={`${row.day} açılış`} value={row.start} onChange={event=>setHours(current=>current.map(item=>sameHours||item.day===row.day?{...item,start:event.target.value}:item))}/><span>–</span><input type="time" aria-label={`${row.day} bağlanış`} value={row.end} onChange={event=>setHours(current=>current.map(item=>sameHours||item.day===row.day?{...item,end:event.target.value}:item))}/>{!sameHours&&<button type="button" aria-label={`${row.day} sil`} onClick={()=>setHours(current=>current.filter(item=>item.day!==row.day))}><Trash2 size={15}/></button>}</div>)}
        {!sameHours&&<button type="button" className={styles.add} disabled={hours.length===7} onClick={()=>{const day=days.find(day=>!hours.some(item=>item.day===day));if(day)setHours(current=>[...current,{day,start:"09:00",end:"18:00"}]);}}><Plus size={15}/>Gün əlavə et</button>}
        <h3>Əlaqə məlumatları</h3><label>Əsas telefon <em>*</em><div className={styles.phone}><span>+994</span><input required type="tel" pattern="[0-9 ()-]{9,16}" placeholder="55 123 45 67" {...field("phone")}/></div></label>
        {phones.map((phone,index)=><div className={styles.extraPhone} key={phone.id}><label>Əlavə telefon {index+1}<input type="tel" placeholder="+994" value={phone.value} onChange={event=>setPhones(current=>current.map(item=>item.id===phone.id?{...item,value:event.target.value}:item))}/></label><button type="button" aria-label="Əlavə telefonu sil" onClick={()=>setPhones(current=>current.filter(item=>item.id!==phone.id))}><Trash2 size={16}/></button></div>)}
        <button type="button" className={styles.add} onClick={()=>setPhones(current=>[...current,{id:crypto.randomUUID(),value:""}])}><Plus size={16}/>Əlavə telefon əlavə et</button>
        <label>Subdomain <small>(5–30 simvol, hərf və rəqəmlər)</small><div className={styles.subdomain}><input disabled={planId!=="premium"} minLength={5} maxLength={30} pattern="[a-zA-Z0-9]{5,30}" placeholder="biznesiniz" {...field("subdomain")}/><span>.axtar.az</span></div></label>
        {planId!=="premium"&&<div className={styles.upgrade}>Yalnız Premium paketində mövcuddur. Premium paket seçdikdən sonra subdomaininizi daxil edə bilərsiniz.<button type="button" onClick={()=>selectPlan("premium")}>Premium paketə keç <ArrowRight size={14}/></button></div>}
        <label>Ünvan <em>*</em><div className={styles.address}><input required placeholder="Məs: Bakı, Nəsimi r., Azadlıq pr. 152" {...field("address")}/><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.address||data.city||"Bakı")}`} target="_blank" rel="noreferrer"><MapPin size={14}/>Xəritədə göstər</a></div></label>
        {message&&<p className={styles.message} role="status">{message}</p>}<button type="submit" className={styles.submit}><Send size={17}/>Yoxlamaya göndər</button><p className={styles.reviewNote}><LockKeyhole size={12}/>Məlumatlarınız admin tərəfindən yoxlanılacaq və təsdiq edildikdən sonra aktiv olacaq</p>
      </form>
      <aside className={`${styles.panel} ${styles.preview}`}><h2>3. Biznes səhifəniz belə görünəcək</h2><div className={styles.previewCard}><div className={styles.cover}>{cover&&<img src={cover} alt="Biznesin örtük şəkli"/>}</div><div className={styles.identity}><div className={styles.avatar}>{logo?<img src={logo} alt="Biznes loqosu"/>:<ImageIcon size={24}/>}</div><div className={styles.businessName}><h3>{data.name||"Biznesin adı"}</h3>{planId!=="start"&&<span className={styles.premium}>{planId==="premium"?"Premium":"Biznes"}</span>}<p>{data.slogan||data.category||"Kateqoriya seçilməyib"}</p><strong className={styles.rating}><Star size={17}/>Hələ rəy yoxdur</strong></div><div className={styles.actions}><span><Eye size={14}/>İzlə</span><span><Phone size={13}/>+994 {data.phone||"55 123 45 67"}</span><span>Mesaj yaz</span></div></div>
        <div className={styles.stats}>{[[ShoppingBag,"0","Elan"],[Gem,"0","Baxış"],[Users,"0","İzləyici"]].map(([Icon,value,label])=>{const StatIcon=Icon as typeof ShoppingBag;return <div key={String(label)}><StatIcon size={21}/><strong>{String(value)}<small>{String(label)}</small></strong></div>;})}</div>
        <div className={styles.location}><span><MapPin size={14}/>{data.address||"Ünvan seçilməyib"}</span><span>{hours.length?`${sameHours?"Hər gün":hours[0].day} ${hours[0].start} – ${hours[0].end}`:"İş saatları seçilməyib"}</span><strong>Açıqdır</strong></div>
        <div className={styles.tabs}>{["Haqqımızda","Təkliflər","Qalereya","Rəylər (0)"].map(value=><button type="button" key={value} className={tab===value?styles.currentTab:""} onClick={()=>setTab(value)}>{value}</button>)}</div>
        <div className={styles.previewBody}>{tab==="Haqqımızda"&&<><p className={expandedAbout?styles.expandedAbout:styles.about}>{data.about||"Biznesiniz haqqında yazdığınız məlumat burada görünəcək."}</p><button type="button" className={styles.more} onClick={()=>setExpandedAbout(current=>!current)}>{expandedAbout?"Daha az göstər":"Daha çox oxu"} →</button></>}{tab==="Təkliflər"&&<p>Hələ təklif əlavə edilməyib.</p>}{tab==="Rəylər (0)"&&<p>Hələ rəy yoxdur.</p>}{(tab==="Haqqımızda"||tab==="Qalereya")&&<><h3>Qalereya</h3><div className={styles.previewGallery}>{pictures.gallery.length?pictures.gallery.slice(0,4).map(picture=><img key={picture.id} src={picture.url} alt={picture.name}/>):Array.from({length:4},(_,index)=><span key={index}/>)}</div></>}</div>
      </div></aside>
    </div></div></div>;
}
