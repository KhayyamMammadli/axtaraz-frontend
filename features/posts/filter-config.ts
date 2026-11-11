import type { FilterConfig, FilterField } from "@/features/filters/search-filters";

const category: FilterField = {
  key: "category", label: "Kateqoriyalar", icon: "category", multiple: true,
  allOption: "Bütün kateqoriyalar", options: ["Bütün kateqoriyalar", "Bloq kateqoriyası"],
};
const author: FilterField = {
  key: "author", label: "Müəlliflər", icon: "author", multiple: true,
  allOption: "Bütün müəlliflər", options: ["Bütün müəlliflər", "Tural Rzaxanov"],
};
export const postFilterConfig: FilterConfig = {
  showSelected: false,
  fields: [
    { key: "sort", label: "Tarixə görə", icon: "sort", options: ["Ən yenilər", "Ən köhnələr"] },
    category,
    author,
    { key: "popularity", label: "Populyarlıq", icon: "popularity", options: ["Ən populyar", "Az populyar"] },
    { key: "status", label: "Aç", options: ["Hamısı", "Açıq", "Bağlı"] },
  ],
  drawerFields: [
    { ...category, label: "Kateqoriya" },
    author,
    { key: "sort", label: "Sıralama", options: ["Ən yenilər", "Ən köhnələr", "Ən populyar"] },
  ],
};
