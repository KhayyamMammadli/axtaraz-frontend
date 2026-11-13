"use client";

import { ChevronDown, Clock, Phone } from "lucide-react";
import styles from "./product-detail.module.css";

export function ProductContact({ phone, phoneHref }: { phone: string; phoneHref: string }) {
  return <div className={styles.contactAccordion}>
    {phoneHref ? <details className={styles.contactSection}>
      <summary className={styles.phoneSummary}><Phone size={18}/><strong>{phone}</strong><ChevronDown size={17}/></summary>
      <div className={styles.contactDetails}><h3>Əlaqə nömrəsi</h3><a className={styles.phoneNumber} href={phoneHref}><Phone size={17}/><span>{phone}</span></a></div>
    </details> : <p className={styles.contactNote}>Əlaqə nömrəsi qeyd edilməyib.</p>}
    <div className={styles.contactNote}><Clock size={17}/><span>İş saatları qeyd edilməyib.</span></div>
  </div>;
}
