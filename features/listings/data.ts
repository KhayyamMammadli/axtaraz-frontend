export type Listing = {
  id: string;
  title: string;
  price: string;
  location: string;
  age: string;
  image: string;
  kind: "premium" | "vip" | "urgent" | "sale" | "recommended" | "latest";
  category: string;
  detail: string;
};

export const listings: Listing[] = [
  {
    id: "laqbaum-101",
    title: "Şlaqbaum 055 245 89 79",
    price: "1 000 ₼",
    location: "Bakı",
    age: "Bu gün",
    image: "https://axtar.az/img/product/product-1.jpg",
    kind: "premium",
    category: "Avadanlıqlar",
    detail: "Yaşayış binaları və iş mərkəzləri üçün avtomatik şlaqbaum sistemləri. Quraşdırılma və texniki dəstək mövcuddur.",
  },
  {
    id: "turniket-100",
    title: "Maksisoft turniket sistemi",
    price: "2 550 ₼",
    location: "Bakı",
    age: "Bu gün",
    image: "https://axtar.az/img/product/product-2.jpg",
    kind: "vip",
    category: "Avadanlıqlar",
    detail: "Müasir keçid və girişə nəzarət sistemi. Ətraflı məlumat üçün satıcı ilə əlaqə saxlayın.",
  },
  {
    id: "bollard-99",
    title: "Bollard satışı",
    price: "2 000 ₼",
    location: "Bakı",
    age: "2 gün əvvəl",
    image: "https://axtar.az/img/product/product-3.jpg",
    kind: "urgent",
    category: "Avadanlıqlar",
    detail: "Əraziyə girişə nəzarət üçün yol bollardları. Müxtəlif modellər və quraşdırılma xidməti.",
  },
  {
    id: "ev-59",
    title: "Geniş və işıqlı mənzil",
    price: "120 000 ₼",
    location: "Bakı",
    age: "4 gün əvvəl",
    image: "https://axtar.az/img/product/product-1.jpg",
    kind: "sale",
    category: "Daşınmaz əmlak",
    detail: "Şəhərin əlverişli ərazisində yerləşən mənzil. Baxış üçün əvvəlcədən əlaqə saxlayın.",
  },
  {
    id: "temizlik-88",
    title: "Pulwa kimyəvi təmizləmə aparatı",
    price: "360 ₼",
    location: "Bakı",
    age: "1 həftə əvvəl",
    image: "https://axtar.az/img/product/product-2.jpg",
    kind: "recommended",
    category: "Məişət texnikası",
    detail: "Peşəkar yuma və təmizləmə üçün aparat. Vəziyyəti yaxşıdır.",
  },
  {
    id: "rfd-95",
    title: "RFİD kart və giriş sistemi",
    price: "50 ₼",
    location: "Sumqayıt",
    age: "1 həftə əvvəl",
    image: "https://axtar.az/img/product/product-3.jpg",
    kind: "latest",
    category: "Elektronika",
    detail: "RFİD kartlar və girişə nəzarət avadanlıqları. Topdan və pərakəndə satış.",
  },
  {
    id: "tripod-89",
    title: "Tripod (üçqollu) turniket",
    price: "1 000 ₼",
    location: "Bakı",
    age: "2 həftə əvvəl",
    image: "https://axtar.az/img/product/product-1.jpg",
    kind: "premium",
    category: "Avadanlıqlar",
    detail: "Ofislər və ictimai məkanlar üçün keçid turniketi. Quraşdırılma xidməti var.",
  },
  {
    id: "xprinter-77",
    title: "Xprinter XP-350B satışda",
    price: "130 ₼",
    location: "Gəncə",
    age: "2 həftə əvvəl",
    image: "https://axtar.az/img/product/product-2.jpg",
    kind: "vip",
    category: "Kompüterlər",
    detail: "Etiket çapı üçün kompakt printer. İşlək vəziyyətdədir.",
  },
];

export const feedTabs = [
  { id: "premium", label: "Premium", icon: "crown" },
  { id: "vip", label: "VIP", icon: "gem" },
  { id: "urgent", label: "Təcili", icon: "zap" },
  { id: "sale", label: "Endirimlər", icon: "tag" },
  { id: "recommended", label: "Tövsiyə edilənlər", icon: "thumbs" },
  { id: "latest", label: "Son elanlar", icon: "clock" },
] as const;

export const categories = [
  "Hazır bizneslər", "Heyvanlar", "Uşaqlar üçün", "İtmiş əşyalar",
  "Geyimlər", "İdman və əyləncə", "Təmir və tikinti", "Məişət texnikası",
  "Ev və bağ üçün", "Kompüterlər", "Qida məhsulları", "Restoranlar, kafelər",
  "Qızıl zinət əşyaları", "Tibbi məhsullar", "Telefonlar", "Xidmətlər",
  "Daşınmaz əmlak", "Elektronika", "Avadanlıqlar", "Bazarlıq",
];
