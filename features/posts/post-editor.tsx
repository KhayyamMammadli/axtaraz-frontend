"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, Monitor, Smartphone, UploadCloud, ImageIcon, PlusCircle, X, Heart, Share2, Clock, Eye, UserRound, ChevronRight } from "lucide-react";
import styles from "./post-editor.module.css";
type Picture = { id:string;url:string;name:string };
export function PostEditor() {
  const [data,setData]=useState({title:"",short:"",category:"",subcategory:"",content:""});
  const [cover,setCover]=useState<Picture|null>(null);
  const [gallery,setGallery]=useState<Picture[]>([]);
  const [tag,setTag]=useState("");
  const [tags,setTags]=useState<string[]>([]);
  const [mobile,setMobile]=useState(false);
  const [message,setMessage]=useState("");
  const urls=useRef(new Set<string>());
  useEffect(()=>{const current=urls.current;return ()=>current.forEach(url=>URL.revokeObjectURL(url));},[]);
  const field=(key:keyof typeof data)=>({value:data[key],onChange:(event:React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>)=>setData(current=>({...current,[key]:event.target.value}))});
  function upload(files:FileList|null,isCover:boolean) {
    if(!files)return;
    const added:Picture[]=[];let error="";
    for(const file of Array.from(files)) {
      if(!["image/jpeg","image/png"].includes(file.type)||file.size>3*1024*1024){error="Yalnız 3 MB-dək JPEG və PNG şəkillər əlavə edin.";continue;}
      if(added.length>=(isCover?1:30-gallery.length)){error=`Maksimum ${isCover?1:30} şəkil əlavə edə bilərsiniz.`;break;}
      const url=URL.createObjectURL(file);urls.current.add(url);added.push({id:crypto.randomUUID(),url,name:file.name});
    }
    if(added.length){if(isCover){if(cover){URL.revokeObjectURL(cover.url);urls.current.delete(cover.url);}setCover(added[0]);}else setGallery(current=>[...current,...added]);}setMessage(error);
  }
  function remove(picture:Picture,isCover:boolean){URL.revokeObjectURL(picture.url);urls.current.delete(picture.url);if(isCover)setCover(null);else setGallery(current=>current.filter(item=>item.id!==picture.id));}
  function addTag(){const value=tag.trim();if(value&&!tags.some(item=>item.toLocaleLowerCase("az")===value.toLocaleLowerCase("az")))setTags(current=>[...current,value]);setTag("");}
  function submit(event:FormEvent){event.preventDefault();if(!cover){setMessage("Cover şəklini əlavə edin.");return;}setMessage("Bloqun önizləməsi hazırdır. Yayımlamaq üçün server bağlantısı hələ qoşulmayıb.");}
  function uploadBox(isCover:boolean){return <label className={`${styles.upload} ${isCover?styles.coverUpload:""}`} onDragOver={event=>event.preventDefault()} onDrop={event=>{event.preventDefault();upload(event.dataTransfer.files,isCover);}}><UploadCloud size={27}/><strong>{isCover?"Yeni bloq üçün şəkil əlavə edin":"Şəkil əlavə et"}</strong><small>{isCover?"JPEG, PNG formatları, maksimum ölçü 3 MB":"Maksimum 30 şəkil yükləyə bilərsiniz"}</small>{isCover&&<span><ImageIcon size={15}/>Yüklə</span>}<input type="file" aria-label={isCover?"Cover şəkli yüklə":"Qalereya şəkilləri yüklə"} accept="image/jpeg,image/png" multiple={!isCover} onChange={event=>{upload(event.target.files,isCover);event.target.value="";}}/></label>;}
  return <div className={`page-shell ${styles.page}`} data-post-editor><div className={styles.heading}><Link href="/posts" aria-label="Bloqlara qayıt"><ArrowLeft size={22}/></Link><h1>Yeni bloq yerləşdir</h1></div><div className={styles.layout}>
    <form className={styles.form} onSubmit={submit}><h2>Bloq məlumatları</h2><label><span>Başlıq</span><input required maxLength={150} placeholder="Daxil edin" {...field("title")}/></label><label><span>Qısa başlıq</span><input maxLength={250} placeholder="Daxil edin" {...field("short")}/></label>
      <div className={styles.fields}><label><span>Kateqoriya <em>*</em></span><select required value={data.category} onChange={event=>setData(current=>({...current,category:event.target.value,subcategory:""}))}><option value="">Kateqoriya seçin</option><option>Bloq kateqoriyası</option></select></label><label><span>Alt kateqoriya</span><select disabled={!data.category} {...field("subcategory")}><option value="">Alt kateqoriya seçin</option></select></label></div>
      <div className={styles.uploadSection}><h3>Cover şəkli <em>*</em></h3>{uploadBox(true)}{cover&&<div className={styles.coverThumb}><img src={cover.url} alt={cover.name}/><button type="button" aria-label="Cover şəklini sil" onClick={()=>remove(cover,true)}><X size={17}/></button></div>}</div>
      <div className={styles.gallerySection}><h3>Qalereya şəkilləri <small>(istəyə bağlı)</small><span>{gallery.length} / 30 şəkil</span></h3>{uploadBox(false)}<div className={styles.thumbnails}>{gallery.map(picture=><div key={picture.id}><img src={picture.url} alt={picture.name}/><button type="button" aria-label="Şəkli sil" onClick={()=>remove(picture,false)}><X size={13}/></button></div>)}</div></div>
      <label><span>Bloq üçün etiketlər</span><div className={styles.tagInput}><input maxLength={50} value={tag} onChange={event=>setTag(event.target.value)} placeholder="Daxil edin" onKeyDown={event=>{if(event.key==="Enter"||event.key===","){event.preventDefault();addTag();}}}/><button type="button" aria-label="Etiket əlavə et" onClick={addTag}><PlusCircle size={21}/></button></div></label><div className={styles.tags}>{tags.map(value=><span key={value}>{value}<button type="button" aria-label={`${value} etiketini sil`} onClick={()=>setTags(current=>current.filter(item=>item!==value))}><X size={12}/></button></span>)}</div>
      <label><span>Bloq kontenti</span><div className={styles.textarea}><textarea required maxLength={200} placeholder="Kontent əlavə edin" {...field("content")}/><small>{data.content.length}/200</small></div></label>
      {message&&<p className={styles.message} role="status">{message}</p>}<div className={styles.submitRow}><label className={styles.terms}><input type="checkbox" required/><span>Bütün <a href="https://axtar.az/terms" target="_blank" rel="noreferrer">şərtlər</a> və <a href="https://axtar.az/rules" target="_blank" rel="noreferrer">qaydalarla</a> razıyam</span></label><button type="submit">Yeni bloq yarat</button></div>
    </form>
    <aside className={styles.preview}><div className={styles.previewHeading}><div><h2>Önizləmə</h2><p>Bloqun necə görünəcəyini önizləyin.</p></div><div className={styles.devices}><button type="button" aria-label="Masaüstü önizləmə" aria-pressed={!mobile} className={!mobile?styles.active:""} onClick={()=>setMobile(false)}><Monitor size={20}/></button><button type="button" aria-label="Mobil önizləmə" aria-pressed={mobile} className={mobile?styles.active:""} onClick={()=>setMobile(true)}><Smartphone size={20}/></button></div></div>
      <article className={`${styles.article} ${mobile?styles.mobile:""}`}><nav>Ana səhifə<ChevronRight size={14}/>Bloqlar<ChevronRight size={14}/>Yeni bloq</nav><div className={styles.cover}><span className={styles.category}>{data.subcategory||data.category||"Kateqoriya"}</span><div className={styles.coverActions}><span><Heart size={18} fill="currentColor"/></span><span><Share2 size={18}/></span></div>{cover?<img src={cover.url} alt={data.title||"Bloqun cover şəkli"}/>:<div className={styles.placeholder}><ImageIcon size={32}/><span>Cover şəklini əlavə edin</span></div>}</div><h2>{data.title||"Bloq başlığı burada görünəcək"}</h2><div className={styles.meta}><span><Clock size={15}/>İndi</span><span><Eye size={16}/>0 baxış</span><Heart size={15} fill="currentColor"/></div><div className={styles.author}><span><UserRound size={22} fill="white"/></span><strong>İstifadəçi</strong></div><p className={styles.short}>{data.short||"Qısa təsvir bloqun önizləməsində burada görünəcək."}</p><p className={styles.content}>{data.content||"Bloq mətnini yazdıqca məzmun burada görünəcək."}</p>{tags.length>0&&<div className={styles.tags}>{tags.map(value=><span key={value}>#{value}</span>)}</div>}{gallery.length>0&&<div className={styles.previewGallery}>{gallery.map(picture=><img key={picture.id} src={picture.url} alt={picture.name}/>)}</div>}</article>
    </aside>
  </div></div>;
}
