import type { FilterConfig } from "@/features/filters/search-filters";
export const businessFilterConfig: FilterConfig = {
  defaults: { sort: ["Ən yenilər"] },
  booleanGroup: ["credit", "open", "delivery", "discount", "always"],
  fields: [
    { key: "sort", label: "Tarixə görə", icon: "sort", options: ["Ən yenilər", "Ən köhnələr", "Ən çox baxılanlar"] },
    { key: "category", label: "Biznes kateqoriyaları", multiple: true, expandable: true, options: ["Hamısı", "Nəqliyyat", "Elektronika", "Daşınmaz Əmlak", "Xidmətlər", "Telefonlar", "Şəxsi Əşyalar", "Kompüterlər", "Ev və bağ üçün", "Məişət texnikası", "Təmir tikinti", "Zoo məhsulları"] },
    { key: "credit", label: "Kredit var", icon: "credit", options: ["Hamısı", "Kredit var"] },
    { key: "open", label: "Açıqdır", options: ["Hamısı", "Açıqdır"] },
    { key: "delivery", label: "Çatdırılma var", icon: "delivery", options: ["Hamısı", "Çatdırılma var"] },
    { key: "discount", label: "Endirimlər", icon: "discount", options: ["Hamısı", "Endirimlər"] },
    { key: "always", label: "24/7", options: ["Hamısı", "24/7"] },
  ],
};
