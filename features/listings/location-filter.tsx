"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, MapPin } from "lucide-react";
import styles from "./location-filter.module.css";

import { regions, bakuMetros } from "./regions";



type Props = { title: string; location: string; metro: string };

export function LocationFilter({ title, location, metro }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [region, setRegion] = useState(location);
  const [station, setStation] = useState(metro);

  function apply() {
    const params = new URLSearchParams();
    if (title.trim()) params.set("title", title.trim());
    if (region) params.set("location", region);
    if (region === "Bakı" && station) params.set("metro", station);
    const query = params.toString();
    router.push(query ? `/full-search?${query}` : "/full-search");
    setOpen(false);
  }

  return (
    <div className={styles.filter}>
      <button type="button" className={styles.trigger} aria-expanded={open} aria-haspopup="dialog" onClick={() => setOpen(!open)}>
        <MapPin size={16} />
        <span>{station ? `Bakı · ${station}` : region || "Bölgələr"}</span>
        <ChevronDown size={15} className={open ? styles.chevronOpen : ""} />
      </button>
      {open && (
        <div className={styles.popover} role="dialog" aria-label="Bölgə və metro seçimi">
          <label className={styles.field}>
            <span>Bölgə</span>
            <select value={region} onChange={(event) => { setRegion(event.target.value); setStation(""); }}>
              <option value="">Bütün bölgələr</option>
              {regions.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <ChevronDown size={16} aria-hidden="true" />
          </label>
          {region === "Bakı" && (
            <label className={styles.field}>
              <span>Metro</span>
              <select value={station} onChange={(event) => setStation(event.target.value)}>
                <option value="">Bütün metrolar</option>
                {bakuMetros.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
              <ChevronDown size={16} aria-hidden="true" />
            </label>
          )}
          <div className={styles.actions}>
            <button type="button" className={styles.reset} onClick={() => { setRegion(""); setStation(""); }}>Sıfırla</button>
            <button type="button" className={styles.apply} onClick={apply}>Tətbiq et</button>
          </div>
        </div>
      )}
    </div>
  );
}
