import Link from "next/link";
import { MapPin, Mail, Phone, Tag, Search, CircleAlert } from "lucide-react";

const columns = [
  ["Hazır bizneslər", "Heyvanlar", "Uşaqlar üçün", "İtmiş əşyalar", "Geyimlər, Kişi, Qadın, Uşaq", "İdman və əyləncə"],
  ["Zoo məhsullar", "Təmir və tikinti", "Məişət texnikası", "Ev və bağ üçün", "Komputerlər", "Qida məhsulları"],
  ["Restoranlar Kafelər", "Qızıl zinət əşyaları", "Tibbi məhsullar", "Şəxsi əşyalar", "Avadanlıqlar", "Bazarlıq"],
  ["Telefonlar", "Xidmətlər", "Daşınmaz əmlak", "Elektronika"],
];

const socialNetworks = ["Facebook", "Instagram", "Linkedin", "WhatsApp"];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner page-shell-wide">
        <div className="footer-brand-col">
          <Link href="/" className="brand footer-brand">
            <img src="https://axtar.az/img/logo.svg" alt="axtar.az" />
          </Link>
          <p>Azərbaycanın ən yeni, ən sərfəli və ən yenilikçi elan platforması.</p>
          <div className="footer-contact">
            <span className="footer-contact-icon"><Mail size={19} /></span>
            <span><small>Email:</small><a href="mailto:support@axtar.az">support@axtar.az</a></span>
          </div>
          <div className="footer-contact">
            <span className="footer-contact-icon"><Phone size={19} /></span>
            <span><small>Nömrə:</small><a href="tel:+9945554444">+9945554444</a></span>
          </div>
          <div className="footer-contact">
            <span className="footer-contact-icon"><MapPin size={19} /></span>
            <span><small>Ünvan:</small><b>Baku city</b></span>
          </div>
        </div>

        <div className="footer-category-col">
          <div className="footer-type-tabs">
            <span className="active"><Tag size={20} /> Təklif edilir</span>
            <span><Search size={21} /> Axtarılır</span>
            <span><CircleAlert size={20} /> İtkin</span>
          </div>
          <div className="footer-categories">
            {columns.map((column, index) => (
              <div key={index}>
                {column.map((category) => (
                  <Link key={category} href={`/full-search?title=${encodeURIComponent(category)}`}>
                    {category}<b aria-hidden="true">›</b>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="footer-apps">
          <h2>Sosial şəbəkələr</h2>
          <div className="footer-socials">
            {socialNetworks.map((network) => (
              <a key={network} href="/" aria-label={network}>
                <img src={`https://axtar.az/img/${network}.svg`} alt={network} />
              </a>
            ))}
          </div>
          <h2>Mobil tətbiq</h2>
          <div className="store-badges">
            <span><small>Download on the</small><b><i aria-hidden="true"></i> App Store</b></span>
            <span><small>GET IT ON</small><b><i aria-hidden="true">▶</i> Google Play</b></span>
          </div>
        </div>
      </div>

      <div className="footer-disclaimer page-shell-wide">
        <CircleAlert size={27} fill="currentColor" aria-hidden="true" />
        <div>
          <strong>Axtar.az elanların məzmununa görə məsuliyyət daşımır.</strong>
          <span>Satıcı ilə alıcı arasında baş verən razılaşmalara görə sayt məsuliyyət daşımır.</span>
        </div>
      </div>

      <div className="footer-bottom page-shell-wide">
        <span>© Müəllif hüquqları qorunur 2026</span>
        <img src="https://axtar.az/img/payment-item.svg" alt="Ödəniş üsulları" />
      </div>
    </footer>
  );
}
