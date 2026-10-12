import Link from "next/link";
import { Facebook, Instagram, Linkedin, MapPin, MessageCircle } from "lucide-react";
import { categories } from "@/features/listings/data";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner page-shell-wide">
        <div className="footer-brand-col"><Link href="/" className="brand"><img src="https://axtar.az/img/logo.svg" alt="axtar.az" /></Link><p>Azərbaycanın ən yeni, ən sərfəli və ən yenilikçi elan platforması.</p><a href="mailto:support@axtar.az">support@axtar.az</a><a href="tel:+994555444444">+994 55 544 44 44</a><span><MapPin size={15} /> Bakı, Azərbaycan</span><div className="social-links"><a href="https://www.facebook.com/" aria-label="Facebook"><Facebook size={17} /></a><a href="https://www.instagram.com/" aria-label="Instagram"><Instagram size={17} /></a><a href="https://www.linkedin.com/" aria-label="LinkedIn"><Linkedin size={17} /></a><a href="https://wa.me/" aria-label="WhatsApp"><MessageCircle size={17} /></a></div></div>
        <div className="footer-category-col"><h2>Elan kateqoriyaları</h2><div className="footer-categories">{categories.slice(0, 12).map((category) => <Link key={category} href={`/full-search?title=${encodeURIComponent(category)}`}>{category}</Link>)}</div></div>
        <div className="footer-links-col"><h2>Axtar.az</h2><Link href="/ownerships">Bizneslər</Link><Link href="/posts">Bloqlar</Link><Link href="/full-search">Bütün elanlar</Link><Link href="/login">Daxil ol</Link><div className="store-badges"><span> App Store</span><span>▶ Google Play</span></div></div>
      </div>
      <div className="footer-bottom page-shell-wide"><p>Axtar.az elanların məzmununa görə məsuliyyət daşımır. Satıcı ilə alıcı arasında baş verən razılaşmalara görə sayt məsuliyyət daşımır.</p><span>© 2026 Axtar.az. Müəllif hüquqları qorunur.</span></div>
    </footer>
  );
}
