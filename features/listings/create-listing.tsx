"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBusinessOptions } from "@/features/ownerships/use-business-options";
import { usePlaces } from "./use-places";
import { uploadImage } from "@/features/uploads/upload-image";
import { CustomSelect } from "@/components/custom-select";
import type { Listing } from "./data";
import { useSession } from "@/features/auth/session";
import { ArrowLeft, ArrowRight, UploadCloud, ImageIcon, Info, Trash2, Plus, Eye, EyeOff, MapPin, ShieldCheck, Phone, CircleCheck, MoreHorizontal, ChevronRight, Gift } from "lucide-react";
import styles from "./create-listing.module.css";
const days = ["Bazar ertəsi", "Çərşənbə axşamı", "Çərşənbə", "Cümə axşamı", "Cümə", "Şənbə", "Bazar"];
type Photo = { id: string; url: string; name: string; file?: File; uploadedName?: string };
export function CreateListing({ variant = "offer", initialListing }: { variant?: "offer" | "wanted" | "lost"; initialListing?: Listing }) {
  const router = useRouter();
  const categories = useBusinessOptions("product-categories");
  const cities = useBusinessOptions("cities");
  const [traceId, setTraceId] = useState("");
  const [traceError, setTraceError] = useState("");
  const [traceAttempt, setTraceAttempt] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const submitLock = useRef(false);
  const traceRequest = useRef<Promise<string> | null>(null);
  useEffect(() => {
    let active = true;
    setTraceError("");
    const request = traceRequest.current ??= fetch("/api/uploads/traces", { method: "POST", cache: "no-store" }).then(async response => {
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || "Yükləmə sessiyası yaradılmadı.");
      if (typeof payload.data?.trace_id !== "string" || !payload.data.trace_id) throw new Error("Yükləmə sessiyası yaradılmadı.");
      return payload.data.trace_id as string;
    });
    void request.then(id => { if (active) setTraceId(id); }).catch(error => { if (active) { traceRequest.current = null; setTraceError(error instanceof Error ? error.message : "Yükləmə sessiyası yaradılmadı."); } });
    return () => { active = false; };
  }, [traceAttempt]);
  const { customer } = useSession();
  const loggedIn = !!customer;
  const [mobileViewport, setMobileViewport] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const previewRef = useRef<HTMLElement>(null);
  const previewTrigger = useRef<HTMLButtonElement>(null);
  const previewBack = useRef<HTMLButtonElement>(null);
  const editorRef = useRef<HTMLFormElement>(null);
  const editorScroll = useRef(0);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 760px)");
    const update = () => { setMobileViewport(media.matches); if (!media.matches) setPreviewOpen(false); };
    update(); media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (!previewOpen || !mobileViewport) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    previewRef.current?.scrollTo(0, 0);
    previewBack.current?.focus({ preventScroll: true });
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setPreviewOpen(false); previewTrigger.current?.focus({ preventScroll: true }); }
      if (event.key === "Tab") {
        const buttons = previewRef.current?.querySelectorAll<HTMLButtonElement>("button:not([disabled])");
        const first = buttons?.[0], last = buttons?.[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener("keydown", key);
    return () => { document.body.style.overflow = overflow; document.removeEventListener("keydown", key); };
  }, [previewOpen, mobileViewport]);
  function closePreview() { setPreviewOpen(false); window.scrollTo(0, editorScroll.current); previewTrigger.current?.focus({ preventScroll: true }); }
  function publishPreview() {
    closePreview();
    requestAnimationFrame(() => editorRef.current?.requestSubmit());
  }
  const isLost = variant === "lost";
  const [rewardEnabled, setRewardEnabled] = useState(false);
  const isWanted = variant === "wanted";
  const priceLabel = isWanted ? "Təxmini büdcə" : "Qiymət";
  const [data, setData] = useState({ category: "", title: initialListing?.title || "", price: initialListing?.price.replace(/[^\d.,]/g, "").replace(",", ".") || "", city: "", description: initialListing?.description || "", address: initialListing?.address || "", first: "", last: "", email: "", phone: initialListing?.phone || "", password: "", confirm: "", store: "", lostAt: "", approximateAt: "", reward: "" });
  const [subway, setSubway] = useState("");
  const subways = usePlaces("subways/1", data.city === "1");
  const categoryLabel = categories.options.find(option => option.value === data.category)?.label || "";
  const cityLabel = cities.options.find(option => option.value === data.city)?.label || "";
  useEffect(() => {
    if (!initialListing) return;
    setData(current => ({ ...current, category: current.category || categories.options.find(option => option.label === initialListing.category || option.label.split(" / ")[0] === initialListing.category)?.value || "", city: current.city || cities.options.find(option => option.label === initialListing.location)?.value || "" }));
  }, [initialListing, categories.options, cities.options]);
  const [photos, setPhotos] = useState<Photo[]>(() => initialListing?.image ? [{ id: `existing-${initialListing.id}`, url: initialListing.image, name: initialListing.title }] : []);
  const [cover, setCover] = useState(initialListing?.image ? `existing-${initialListing.id}` : "");
  useEffect(() => {
    if (!customer) return;
    setData(current => ({ ...current, first: current.first || customer.name, last: current.last || customer.last_name, email: current.email || customer.email, phone: current.phone || customer.mobile_number.replace(/^\+?994/, "0") }));
  }, [customer]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [sameHours, setSameHours] = useState(false);
  const [hours, setHours] = useState(days.map((day, i) => ({ day, start: i === 5 ? "10:00" : i === 6 ? "12:00" : "09:00", end: i === 5 ? "16:00" : i === 6 ? "17:00" : "18:00" })));
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const [date, setDate] = useState("");
  const photoRef = useRef<Photo[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { setDate(new Intl.DateTimeFormat("az-AZ", {dateStyle:"short",timeStyle:"short"}).format(new Date())); return () => photoRef.current.forEach(photo => URL.revokeObjectURL(photo.url)); }, []);
  const field = (key: keyof typeof data) => ({ value: data[key], onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setData(current => ({...current,[key]:event.target.value})) });
  function addPhotos(files: FileList | null) {
    if (!files) return;
    const added: Photo[] = []; let message = "";
    for (const file of Array.from(files)) {
      if (!["image/jpeg","image/png"].includes(file.type) || file.size > 5 * 1024 * 1024) { message = "Yalnız 5 MB-dək JPG və PNG şəkillər qəbul edilir."; continue; }
      if (photos.length + added.length >= 20) { message = "Maksimum 20 şəkil əlavə edə bilərsiniz."; break; }
      added.push({id:crypto.randomUUID(),url:URL.createObjectURL(file),name:file.name,file});
    }
    const next = [...photos,...added]; photoRef.current = next; setPhotos(next); if (!cover && added.length) setCover(added[0].id); setError(message);
  }
  function removePhoto(photo: Photo) { const next = photos.filter(item => item.id !== photo.id); URL.revokeObjectURL(photo.url); photoRef.current = next; setPhotos(next); if (cover === photo.id) setCover(next[0]?.id ?? ""); }
  async function submit(event: FormEvent) {
    event.preventDefault(); setNotice("");
    if (submitLock.current) return;
    if (initialListing) { setError("Redaktə API-si hələ qoşulmayıb."); return; }
    if (!loggedIn) { setError("Elan yerləşdirmək üçün hesabınıza daxil olun."); return; }
    if (!traceId) { setError("Yükləmə sessiyasının hazırlanmasını gözləyin."); return; }
    if (!photos.length) { setError("Minimum 1 şəkil əlavə edin."); inputRef.current?.focus(); return; }

    if (!categories.options.some(option => option.value === data.category) || !cities.options.some(option => option.value === data.city)) { setError("Kateqoriya və şəhər seçin."); return; }
    if (variant !== "offer") { setError("Bu elan növünün create parametri hələ təqdim edilməyib."); return; }

    submitLock.current = true; setSubmitting(true); setError("");
    try {
      const uploaded: Photo[] = [];
      for (const [index, photo] of photos.entries()) {
        let name = photo.uploadedName;
        if (!name) {
          if (!photo.file) throw new Error("Şəkli yenidən seçin.");
          setNotice(`Şəkillər yüklənir: ${index+1}/${photos.length}`);
          name = await uploadImage(traceId, photo.file);
          setPhotos(current => current.map(item => item.id === photo.id ? {...item, uploadedName: name} : item));
        }
        uploaded.push({...photo, uploadedName: name});
      }
      const images = uploaded.sort((a,b) => Number(b.id === cover)-Number(a.id === cover)).map(photo => photo.uploadedName!);
      setNotice("Elan göndərilir…");
      const response = await fetch("/api/my/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ category_id: Number(data.category), city_id: Number(data.city), subway_id: data.city === "1" && subway ? Number(subway) : null, description: data.description, price: Number(data.price), ownership_id: null, longitude: null, latitude: null, title_product: data.title, trace_id: traceId, images, fields: [], apply_type: "none", apply_value: null }) });
      const payload = await response.json();
      if (!response.ok) {
        const details = payload.errors && typeof payload.errors === "object" ? Object.values(payload.errors).flat().filter(value => typeof value === "string").join(" ") : "";
        throw new Error(details || payload.message || "Elan yaradılmadı.");
      }
      router.replace("/account/listings"); router.refresh();
    } catch (error) { setError(error instanceof Error ? error.message : "Elan yaradılmadı."); }
    finally { submitLock.current = false; setSubmitting(false); setNotice(""); }
  }
  const image = photos.find(photo => photo.id === cover)?.url;
  return <div className={styles.page} data-listing-editor><div className="page-shell">
    <div className={styles.heading} inert={mobileViewport && previewOpen}><Link href={initialListing ? "/account/listings" : "/full-search"} aria-label="Elanlara qayıt"><ArrowLeft size={22}/></Link><h1>{initialListing ? isLost ? "İtkin elanı redaktə et" : isWanted ? "Axtarılır elanını redaktə et" : "Elanı redaktə et" : isLost ? "Yeni itkin elan yarat" : isWanted ? "Elan axtar" : "Yeni elan yerləşdir"}</h1></div>
    <div className={styles.layout}>
      <form ref={editorRef} id="listing-editor-form" className={styles.form} onSubmit={submit} inert={submitting || (mobileViewport && previewOpen)}>
        <section className={styles.panel}>{!traceId&&<p role="status">{traceError || "Yükləmə sessiyası hazırlanır…"}{traceError&&<button type="button" onClick={()=>setTraceAttempt(value=>value+1)}>Yenidən cəhd et</button>}</p>}<h2>{isLost ? "İtkin haqqında məlumat" : "Elan haqqında məlumatlar"}</h2><div className={styles.fields}>
          <div><label htmlFor="listing-category">Kateqoriya seçimi <em>*</em></label><CustomSelect id="listing-category" name="category" label="Kateqoriya seçimi" required value={data.category} onChange={value => setData(current => ({...current, category: value}))} options={categories.options} disabled={categories.loading || !!categories.error} placeholder={categories.loading ? "Yüklənir…" : "Seçin"}/>{categories.error&&<p role="alert">{categories.error} <button type="button" onClick={categories.retry}>Yenidən cəhd et</button></p>}</div>
          <label>Elanın adı <em>*</em><input required maxLength={100} placeholder="Placeholder text..." {...field("title")}/></label>
          <label>{priceLabel} <em>*</em><input required type="number" min="0" step="0.01" placeholder="Placeholder text..." {...field("price")}/></label>
          <div><label htmlFor="listing-city">Şəhər <em>*</em></label><CustomSelect id="listing-city" name="city" label="Şəhər" required value={data.city} onChange={value => {setData(current => ({...current, city: value}));setSubway("");}} options={cities.options} disabled={cities.loading || !!cities.error} placeholder={cities.loading ? "Yüklənir…" : "Seçin"}/>{cities.error&&<p role="alert">{cities.error} <button type="button" onClick={cities.retry}>Yenidən cəhd et</button></p>}</div>
          {data.city === "1" && <div><label htmlFor="listing-subway">Metro</label><CustomSelect id="listing-subway" label="Metro" value={subway} onChange={setSubway} disabled={subways.loading || !!subways.error} options={subways.data.map(item=>({value:String(item.id),label:item.title}))}/>{subways.error&&<button type="button" onClick={subways.retry}>Metroları yenidən yüklə</button>}</div>}
          <div><label htmlFor="listing-store">Mağaza</label><CustomSelect id="listing-store" name="store" label="Mağaza" value={data.store} onChange={value => setData(current => ({...current, store:value}))} options={[{value:"personal",label:"Şəxsi elan"}]}/></div>
          {isLost && <>
            <label>İtmə vaxtı <em>*</em><input required type="datetime-local" {...field("lostAt")}/></label>
            <label>Təxmini vaxt <em>*</em><input required type="datetime-local" {...field("approximateAt")}/></label>
          </>}
          <label className={styles.full}>{isLost ? "İtkin haqqında məlumat" : "Elan haqqında məlumat"} <em>*</em><div className={styles.textarea}><textarea required maxLength={200} placeholder="Ətraflı məlumat əlavə edin" {...field("description")}/><span>{data.description.length}/200</span></div></label>
        </div>
          {isLost && <div className={styles.reward}>
            <Gift className={styles.rewardIcon} size={44}/>
            <div className={styles.rewardBody}><div className={styles.rewardHeading}><strong>Tapan şəxsə mükafat verilir</strong><button type="button" role="switch" aria-checked={rewardEnabled} aria-label="Tapan şəxsə mükafat verilir" className={`${styles.switch} ${rewardEnabled ? styles.switchOn : ""}`} onClick={() => setRewardEnabled(current => !current)}><span/></button></div>
              <p>Bu seçimi aktivləşdirdiyiniz halda mükafat məbləğini qeyd edə bilərsiniz.</p>
              <label>Mükafat məbləği (AZN)<input type="number" min="0.01" step="0.01" required={rewardEnabled} disabled={!rewardEnabled} placeholder="Məsələn: 300" {...field("reward")}/></label>
            </div>
          </div>}
        </section>
        <section className={styles.panel}><h2>Şəkillər</h2><p className={styles.subtitle}>Məhsulunuzu daha yaxşı təqdim etmək üçün aydın və keyfiyyətli şəkillər əlavə edin.</p>
          <label className={styles.upload} onDragOver={event => event.preventDefault()} onDrop={event => {event.preventDefault();addPhotos(event.dataTransfer.files);}}><UploadCloud size={31}/><strong>Şəkil əlavə edin</strong><span>JPG, PNG formatında, maksimum 5 MB<br/>Minimum 1 şəkil əlavə olunur</span><input ref={inputRef} type="file" accept="image/jpeg,image/png" multiple onChange={event => {addPhotos(event.target.files);event.target.value="";}}/></label>
          <h3>Əlavə edilən şəkillər <span>({photos.length}/20)</span></h3><div className={styles.photos}>{photos.length ? photos.map(photo => <div className={styles.photo} key={photo.id}><button type="button" aria-label="Ön şəkil seç" className={cover === photo.id ? styles.cover : ""} onClick={() => setCover(photo.id)}><img src={photo.url} alt={photo.name}/>{cover === photo.id && <span>Ön şəkil</span>}</button><button type="button" className={styles.remove} aria-label="Şəkli sil" onClick={() => removePhoto(photo)}><Trash2 size={15}/></button></div>) : <p>Şəkil əlavə edildikdən sonra burada görünəcək</p>}</div>
          <div className={styles.info}><Info size={17}/>İpucu: Elanınıza ön şəkil seçmək üçün şəklin üzərinə klikləyin.</div>
        </section>
        <section className={styles.panel}><h2>Məhsul və ya xidmət üçün məkan təyin edin</h2><iframe title="Məkan xəritəsi" className={styles.map} src={`https://www.openstreetmap.org/export/embed.html?bbox=48.1%2C39.6%2C50.3%2C40.7&layer=mapnik${data.city === "1" ? "&marker=40.4093%2C49.8671" : ""}`} loading="lazy"/><label>Ünvan <em>*</em><div className={styles.address}><input required placeholder="Ünvanı axtarın: Bakı, Nərimanov, Gəncə..." {...field("address")}/><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.address || cityLabel || "Bakı")}`} target="_blank" rel="noreferrer"><MapPin size={18}/>Xəritədə göstər</a></div></label><p className={styles.help}>Ünvanı yazın və xəritədə yoxlayın.</p></section>
        {variant === "offer" && <section className={styles.panel}><h2>İş saatları</h2><label className={styles.radio}><input type="radio" name="hours" checked={sameHours} onChange={() => setSameHours(true)}/>Hər gün eyni saatlarda</label><label className={styles.radio}><input type="radio" name="hours" checked={!sameHours} onChange={() => setSameHours(false)}/>Fərqli iş qrafiki</label>
          {(sameHours ? hours.slice(0,1) : hours).map(row => <div className={styles.hours} key={row.day}><strong>{sameHours ? "Hər gün" : row.day}</strong><input aria-label={`${row.day} açılış`} type="time" value={row.start} onChange={event => setHours(current => current.map(item => sameHours || item.day === row.day ? {...item,start:event.target.value} : item))}/><span>–</span><input aria-label={`${row.day} bağlanış`} type="time" value={row.end} onChange={event => setHours(current => current.map(item => sameHours || item.day === row.day ? {...item,end:event.target.value} : item))}/>{!sameHours && <button type="button" aria-label={`${row.day} sil`} onClick={() => setHours(current => current.filter(item => item.day !== row.day))}><Trash2 size={17}/></button>}</div>)}
          {!sameHours && <button type="button" className={styles.addDay} disabled={hours.length === 7} onClick={() => {const day = days.find(day => !hours.some(row => row.day === day));if(day)setHours(current => [...current,{day,start:"09:00",end:"18:00"}]);}}><Plus size={17}/>Gün əlavə et</button>}
        </section>}
        <section className={styles.panel}><h2>Əlaqə məlumatlarınız</h2><div className={styles.fields}>
          <label>Ad <em>*</em><input required autoComplete="given-name" placeholder="Adınızı yazın" {...field("first")}/></label><label>Soyad <em>*</em><input required autoComplete="family-name" placeholder="Soyadınızı yazın" {...field("last")}/></label>
          <label>E-mail <em>*</em><input required type="email" autoComplete="email" placeholder="E-mail ünvanınızı yazın" {...field("email")}/></label><label>Mobil nömrə <em>*</em><div className={styles.phone}><span>🇦🇿</span><strong>+994</strong><input required type="tel" autoComplete="tel-national" pattern="[0-9 ()-]{9,16}" placeholder="(050) 000-00-00" {...field("phone")}/></div></label>
          {!loggedIn && (["password","confirm"] as const).map(key => <label key={key}>{key === "password" ? "Şifrə" : "Şifrənin təkrarı"} <em>*</em><div className={styles.password}><input required minLength={8} autoComplete="new-password" type={visible[key] ? "text" : "password"} placeholder={key === "password" ? "Şifrənizi yazın" : "Şifrənizi təkrarlayın"} {...field(key)}/><button type="button" aria-label="Şifrəni göstər/gizlət" onClick={() => setVisible(current => ({...current,[key]:!current[key]}))}>{visible[key] ? <EyeOff size={20}/> : <Eye size={20}/>}</button></div></label>)}
        </div><div className={styles.info}><Info size={17}/>Gizliliyinizi qoruyuruq. Məlumatlarınızı üçüncü şəxslərlə paylaşmırıq.</div>{error && <p className={styles.error} role="alert">{error}</p>}{notice && <p className={styles.info} role="status">{notice}</p>}<button className={styles.submit} type="submit" disabled={!traceId || submitting}>{submitting ? "Göndərilir…" : "Elanı yerləşdir"} <ArrowRight size={21}/></button></section>
      </form>
      <button ref={previewTrigger} type="button" className={styles.previewTrigger} aria-label="Elanın önbaxışını aç" aria-expanded={previewOpen} aria-controls="listing-mobile-preview" onClick={() => { editorScroll.current = window.scrollY; setPreviewOpen(true); }}><Eye size={25}/></button>
      <div className={styles.mobilePublish} inert={previewOpen}><button type="submit" form="listing-editor-form" disabled={!traceId || submitting}>{initialListing ? "Dəyişiklikləri saxla" : "Elanı yerləşdir"}<ArrowRight size={19}/></button></div>
      <aside ref={previewRef} id="listing-mobile-preview" className={`${styles.preview} ${previewOpen ? styles.previewOpen : ""}`} role={mobileViewport ? "dialog" : undefined} aria-modal={mobileViewport && previewOpen ? true : undefined} aria-label="Elanın önbaxışı" inert={mobileViewport && !previewOpen}><header className={styles.mobilePreviewHeader}><button ref={previewBack} type="button" onClick={closePreview} aria-label="Redaktəyə qayıt"><ArrowLeft size={20}/></button><strong>Elanınız belə görünəcək</strong></header><h2>Elanınız belə görünəcək</h2><div className={styles.previewCard}><nav>Ana səhifə <ChevronRight size={15}/>{categoryLabel || "Kateqoriya"}<ChevronRight size={15}/>Elan</nav><div className={styles.previewTitle}><h3>{data.title || "Elanın adı burada görünəcək"}</h3><MoreHorizontal size={23}/></div><div className={styles.previewGrid}><div><div className={styles.previewImage}>{image ? <img src={image} alt={data.title || "Elanın ön şəkli"}/> : <><ImageIcon size={62}/><strong>Şəkil əlavə edilməyib</strong></>}</div><div className={styles.facts}>{[[priceLabel,`${data.price || 0} ₼`],["Kateqoriya",categoryLabel || "Seçin"],["Tarix",date],["Elan nömrəsi","—"]].map(([label,value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div><div className={styles.description}><h4>{isLost ? "İtkin haqqında məlumat" : "Elanın təsviri"}</h4>{isLost && rewardEnabled && data.reward && <div className={styles.rewardPreview}><Gift size={17}/>{data.reward} ₼ mükafat</div>}<p>{data.description || "Elan haqqında daxil etdiyiniz məlumat burada görünəcək."}</p><span>Daha ətraflı →</span></div><div className={styles.stats}><span><Eye size={12}/>Baxış: 0</span><span>ID: —</span><span>Saxla</span><span>24 saat qalır</span></div></div><div className={styles.seller}><strong className={styles.price}>{data.price || 0} ₼</strong><div className={styles.owner}><span className={styles.avatar}/><div><small>Elan sahibi</small><strong>{[data.first,data.last].filter(Boolean).join(" ") || "İstifadəçi"}</strong><small className={styles.green}>● Onlayndır</small></div></div><p className={styles.green}><CircleCheck size={13}/>Aktivdir</p><div className={styles.previewActions}><span>İzlə</span><span className={styles.green}><Phone size={13}/>+994 {data.phone || "50 000 00 00"}</span><span>Mesaj yaz</span></div><div className={styles.miniPanel}><strong>Ünvan</strong><span className={styles.blue}>Xəritədə göstər →</span><div className={styles.miniMap}><MapPin size={31}/>{data.address && <small>{data.address}</small>}</div></div><div className={styles.safety}><ShieldCheck size={26}/><div><strong>Təhlükəsiz alış-veriş üçün məsləhətlər</strong><p>Nağd ödəniş edərkən diqqətli olun.</p><span>Ətraflı oxu →</span></div></div></div></div></div><footer className={styles.mobilePreviewFooter}><button type="button" onClick={closePreview}>Redaktəyə qayıt</button><button type="button" disabled={!traceId || submitting} onClick={publishPreview}>{initialListing ? "Yadda saxla" : "Elanı yerləşdir"}<ArrowRight size={17}/></button></footer></aside>
    </div>
  </div></div>;
}
