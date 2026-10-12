import Link from "next/link";
import { MapPin, Mail, Phone, ChevronRight } from "lucide-react";

const columns = [
 ["Hazır bizneslər","Heyvanlar","Uşaqlar üçün","İtmiş əşyalar","Geyimlər","Kişi","Qadın","Uşaq","İdman və əyləncə"],
 ["Zoo məhsullar","Təmir və tikinti","Məişət texnikası","Ev və bağ üçün","Komputerlər","Qida məhsulları"],
 ["Restoranlar Kafelər","Qızıl zinət əşyaları","Tibbi məhsullar","Şəxsi əşyalar","Avadanlıqlar","Bazarlıq"],
 ["Telefonlar","Xidmətlər","Daşınmaz əmlak","Elektronika"],
];
export function SiteFooter() {
 return <footer className="site-footer">
  <div className="footer-inner page-shell-wide">
   <div className="footer-brand-col"><Link href="/" className="brand"><img src="https://axtar.az/img/logo.svg" alt="axtar.az"/></Link><p>Azərbaycanın ən yeni, ən sərfəli və ən yenilikçi elan platforması.</p><a href="mailto:support@axtar.az"><Mail size={15}/> support@axtar.az</a><a href="tel:+9945554444"><Phone size={15}/> +9945554444a</a><span><MapPin size={15}/> Baku city</span></div>
   <div className="footer-category-col"><div className="footer-type-tabs"><span className="active">Təklif edilir</span><span>Axtarılır</span><span>İtkin</span></div><div className="footer-categories">{columns.map((column,i)=><div key={i}>{column.map(item=><Link key={item} href={`/full-search?title=${encodeURIComponent(item)}`}>{item}</Link>)}</div>)}</div></div>
   <div className="footer-apps"><h2>Sosial şəbəkələr</h2><div className="footer-socials">{["Facebook","Instagram","Linkedin","WhatsApp"].map(x=><a key={x} href="#" aria-label={x}><img src={`https://axtar.az/img/${x}.svg`} alt={x}/></a>)}</div><h2>Mobil tətbiq</h2><div className="store-badges"><a href="#"><img src="https://axtar.az/img/app-store.svg" alt="App Store"/></a><a href="#"><img src="https://axtar.az/img/google-play.svg" alt="Google Play"/></a></div></div>
  </div>
  <div className="footer-disclaimer">Axtar.az elanların məzmununa görə məsuliyyət daşımır. Satıcı ilə alıcı arasında baş verən razılaşmalara görə sayt məsuliyyət daşımır.</div>
  <div className="footer-bottom page-shell-wide"><span>© Müəllif hüquqları qorunur 2026</span><img src="https://axtar.az/img/payment-item.svg" alt="Ödəniş üsulları"/></div>
 </footer>;
}
