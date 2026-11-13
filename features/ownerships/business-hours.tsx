"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Clock } from "lucide-react";
import styles from "./business-profile.module.css";

export function BusinessHours({ days }: { days?: string[] }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const workDays = days?.length ? days : ["Çərşənbə axşamı", "Çərşənbə", "Cümə", "Şənbə"];
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpen(false); button.current?.focus(); } };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
  }, [open]);
  return <div ref={root} className={styles.hours}>
    <button ref={button} type="button" className={styles.hoursTrigger} aria-expanded={open} onClick={() => setOpen(value => !value)}><Clock size={22}/><span>{workDays.join(", ")} <span className={styles.hoursTime}>09:00 – 20:00</span></span><ChevronDown size={18} className={open ? styles.hoursChevronOpen : ""}/></button>
    {open && <div className={styles.hoursDropdown}><h3><Clock size={23}/> İş qrafiki</h3><ul>{workDays.map((day, index) => <li key={`${day}-${index}`}><span className={styles.dayCheck}><Check size={19}/></span><strong>{day}</strong><span className={styles.dayTime}>09:00 – 20:00</span></li>)}</ul></div>}
  </div>;
}
