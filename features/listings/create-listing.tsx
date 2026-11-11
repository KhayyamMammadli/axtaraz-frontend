"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, UploadCloud, ImageIcon, Info, Trash2, Plus, Eye, EyeOff, MapPin, ShieldCheck, Phone, CircleCheck, MoreHorizontal, ChevronRight, Gift } from "lucide-react";
import styles from "./create-listing.module.css";
const categories = ["Nəqliyyat", "Elektronika", "Daşınmaz əmlak", "Xidmətlər", "Telefonlar", "Şəxsi əşyalar", "Kompüterlər", "Ev və bağ üçün", "Məişət texnikası", "Təmir və tikinti"];
const days = ["Bazar ertəsi", "Çərşənbə axşamı", "Çərşənbə", "Cümə axşamı", "Cümə", "Şənbə", "Bazar"];
type Photo = { id: string; url: string; name: string };
export function CreateListing({ variant = "offer" }: { variant?: "offer" | "wanted" | "lost" }) {
  const isLost = variant === "lost";
  const [rewardEnabled, setRewardEnabled] = useState(false);
  const isWanted = variant === "wanted";
  const priceLabel = isWanted ? "Təxmini büdcə" : "Qiymət";
  const [data, setData] = useState({ category: "", title: "", price: "", city: "", description: "", address: "", first: "", last: "", email: "", phone: "", password: "", confirm: "", store: "", lostAt: "", approximateAt: "", reward: "" });
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [cover, setCover] = useState("");
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
      added.push({id:crypto.randomUUID(),url:URL.createObjectURL(file),name:file.name});
    }
    const next = [...photos,...added]; photoRef.current = next; setPhotos(next); if (!cover && added.length) setCover(added[0].id); setError(message);
  }
  function removePhoto(photo: Photo) { const next = photos.filter(item => item.id !== photo.id); URL.revokeObjectURL(photo.url); photoRef.current = next; setPhotos(next); if (cover === photo.id) setCover(next[0]?.id ?? ""); }
  function submit(event: FormEvent) {
    event.preventDefault(); setNotice("");
    if (!photos.length) { setError("Minimum 1 şəkil əlavə edin."); inputRef.current?.focus(); return; }
    if (data.password !== data.confirm) { setError("Şifrələr eyni olmalıdır."); return; }
    setError(""); setNotice("Önbaxış hazırdır. Elanı yayımlamaq üçün server bağlantısı hələ qoşulmayıb.");
  }
  const image = photos.find(photo => photo.id === cover)?.url;
  return <div className={styles.page} data-listing-editor><div className="page-shell">
    <div className={styles.heading}><Link href="/full-search" aria-label="Elanlara qayıt"><ArrowLeft size={22}/></Link><h1>{isLost ? "Yeni itkin elan yarat" : isWanted ? "Elan axtar" : "Yeni elan yerləşdir"}</h1></div>
    <div className={styles.layout}>
      <form className={styles.form} onSubmit={submit}>
        <section className={styles.panel}><h2>{isLost ? "İtkin haqqında məlumat" : "Elan haqqında məlumatlar"}</h2><div className={styles.fields}>
          <label>Kateqoriya seçimi <em>*</em><select required {...field("category")}><option value="">Seçin</option>{categories.map(value => <option key={value}>{value}</option>)}</select></label>
          <label>Elanın adı <em>*</em><input required maxLength={100} placeholder="Placeholder text..." {...field("title")}/></label>
          <label>{priceLabel} <em>*</em><input required type="number" min="0" step="0.01" placeholder="Placeholder text..." {...field("price")}/></label>
          <label>Şəhər <em>*</em><select required {...field("city")}><option value="">Seçin</option>{["Bakı","Sumqayıt","Gəncə","Mingəçevir","Lənkəran","Şəki","Quba"].map(value => <option key={value}>{value}</option>)}</select></label>
          {isLost && <>
            <label>Mağaza<select {...field("store")}><option value="">Seçin</option><option value="personal">Şəxsi elan</option></select></label>
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
        <section className={styles.panel}><h2>Məhsul və ya xidmət üçün məkan təyin edin</h2><iframe title="Məkan xəritəsi" className={styles.map} src={`https://www.openstreetmap.org/export/embed.html?bbox=48.1%2C39.6%2C50.3%2C40.7&layer=mapnik${data.city === "Bakı" ? "&marker=40.4093%2C49.8671" : ""}`} loading="lazy"/><label>Ünvan <em>*</em><div className={styles.address}><input required placeholder="Ünvanı axtarın: Bakı, Nərimanov, Gəncə..." {...field("address")}/><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.address || data.city || "Bakı")}`} target="_blank" rel="noreferrer"><MapPin size={18}/>Xəritədə göstər</a></div></label><p className={styles.help}>Ünvanı yazın və xəritədə yoxlayın.</p></section>
        {variant === "offer" && <section className={styles.panel}><h2>İş saatları</h2><label className={styles.radio}><input type="radio" name="hours" checked={sameHours} onChange={() => setSameHours(true)}/>Hər gün eyni saatlarda</label><label className={styles.radio}><input type="radio" name="hours" checked={!sameHours} onChange={() => setSameHours(false)}/>Fərqli iş qrafiki</label>
          {(sameHours ? hours.slice(0,1) : hours).map(row => <div className={styles.hours} key={row.day}><strong>{sameHours ? "Hər gün" : row.day}</strong><input aria-label={`${row.day} açılış`} type="time" value={row.start} onChange={event => setHours(current => current.map(item => sameHours || item.day === row.day ? {...item,start:event.target.value} : item))}/><span>–</span><input aria-label={`${row.day} bağlanış`} type="time" value={row.end} onChange={event => setHours(current => current.map(item => sameHours || item.day === row.day ? {...item,end:event.target.value} : item))}/>{!sameHours && <button type="button" aria-label={`${row.day} sil`} onClick={() => setHours(current => current.filter(item => item.day !== row.day))}><Trash2 size={17}/></button>}</div>)}
          {!sameHours && <button type="button" className={styles.addDay} disabled={hours.length === 7} onClick={() => {const day = days.find(day => !hours.some(row => row.day === day));if(day)setHours(current => [...current,{day,start:"09:00",end:"18:00"}]);}}><Plus size={17}/>Gün əlavə et</button>}
        </section>}
        <section className={styles.panel}><h2>Əlaqə məlumatlarınız</h2><div className={styles.fields}>
          <label>Ad <em>*</em><input required autoComplete="given-name" placeholder="Adınızı yazın" {...field("first")}/></label><label>Soyad <em>*</em><input required autoComplete="family-name" placeholder="Soyadınızı yazın" {...field("last")}/></label>
          <label>E-mail <em>*</em><input required type="email" autoComplete="email" placeholder="E-mail ünvanınızı yazın" {...field("email")}/></label><label>Mobil nömrə <em>*</em><div className={styles.phone}><span>🇦🇿</span><strong>+994</strong><input required type="tel" autoComplete="tel-national" pattern="[0-9 ()-]{9,16}" placeholder="(050) 000-00-00" {...field("phone")}/></div></label>
          {(["password","confirm"] as const).map(key => <label key={key}>{key === "password" ? "Şifrə" : "Şifrənin təkrarı"} <em>*</em><div className={styles.password}><input required minLength={8} autoComplete="new-password" type={visible[key] ? "text" : "password"} placeholder={key === "password" ? "Şifrənizi yazın" : "Şifrənizi təkrarlayın"} {...field(key)}/><button type="button" aria-label="Şifrəni göstər/gizlət" onClick={() => setVisible(current => ({...current,[key]:!current[key]}))}>{visible[key] ? <EyeOff size={20}/> : <Eye size={20}/>}</button></div></label>)}
        </div><div className={styles.info}><Info size={17}/>Gizliliyinizi qoruyuruq. Məlumatlarınızı üçüncü şəxslərlə paylaşmırıq.</div>{error && <p className={styles.error} role="alert">{error}</p>}{notice && <p className={styles.info} role="status">{notice}</p>}<button className={styles.submit} type="submit">Elanı yerləşdir <ArrowRight size={21}/></button></section>
      </form>
      <aside className={styles.preview}><h2>Elanınız belə görünəcək</h2><div className={styles.previewCard}><nav>Ana səhifə <ChevronRight size={15}/>{data.category || "Kateqoriya"}<ChevronRight size={15}/>Elan</nav><div className={styles.previewTitle}><h3>{data.title || "Elanın adı burada görünəcək"}</h3><MoreHorizontal size={23}/></div><div className={styles.previewGrid}><div><div className={styles.previewImage}>{image ? <img src={image} alt={data.title || "Elanın ön şəkli"}/> : <><ImageIcon size={62}/><strong>Şəkil əlavə edilməyib</strong></>}</div><div className={styles.facts}>{[[priceLabel,`${data.price || 0} ₼`],["Kateqoriya",data.category || "Seçin"],["Tarix",date],["Elan nömrəsi","—"]].map(([label,value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div><div className={styles.description}><h4>{isLost ? "İtkin haqqında məlumat" : "Elanın təsviri"}</h4>{isLost && rewardEnabled && data.reward && <div className={styles.rewardPreview}><Gift size={17}/>{data.reward} ₼ mükafat</div>}<p>{data.description || "Elan haqqında daxil etdiyiniz məlumat burada görünəcək."}</p><span>Daha ətraflı →</span></div><div className={styles.stats}><span><Eye size={12}/>Baxış: 0</span><span>ID: —</span><span>Saxla</span><span>24 saat qalır</span></div></div><div className={styles.seller}><strong className={styles.price}>{data.price || 0} ₼</strong><div className={styles.owner}><span className={styles.avatar}/><div><small>Elan sahibi</small><strong>{[data.first,data.last].filter(Boolean).join(" ") || "İstifadəçi"}</strong><small className={styles.green}>● Onlayndır</small></div></div><p className={styles.green}><CircleCheck size={13}/>Aktivdir</p><div className={styles.previewActions}><span>İzlə</span><span className={styles.green}><Phone size={13}/>+994 {data.phone || "50 000 00 00"}</span><span>Mesaj yaz</span></div><div className={styles.miniPanel}><strong>Ünvan</strong><span className={styles.blue}>Xəritədə göstər →</span><div className={styles.miniMap}><MapPin size={31}/>{data.address && <small>{data.address}</small>}</div></div><div className={styles.safety}><ShieldCheck size={26}/><div><strong>Təhlükəsiz alış-veriş üçün məsləhətlər</strong><p>Nağd ödəniş edərkən diqqətli olun.</p><span>Ətraflı oxu →</span></div></div></div></div></div></aside>
    </div>
  </div></div>;
}
