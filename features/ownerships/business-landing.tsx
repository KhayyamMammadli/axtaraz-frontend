"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./business-landing.module.css";
import { businessPlans as plans } from "./business-plans";
const faqs = [
  ["Biznes yaratmaq nə qədər çəkir?", "Məlumatları doldurduqdan sonra səhifəniz qısa müddətdə aktiv olur."],
  ["Ödənişi necə edə bilərəm?", "Ödəniş kart və ya uyğun ödəniş üsulu ilə edilə bilər."],
  ["Paket dəyişmək mümkündür?", "Bəli, daha sonra paketi yüksəldə bilərsiniz."],
  ["Sonradan paketi dəyişə bilərəm?", "Bəli, istənilən vaxt yeni paket seçmək mümkündür."],
  ["Subdomain nədir?", "Biznesiniz üçün ayrıca qısa ünvan yaradılır."],
  ["Texniki dəstək necə olur?", "Suallarınız üçün komandamız sizə kömək edir."],
];
function Icon({ code, className = "" }: { code: string; className?: string }) { return <span aria-hidden="true" className={`${styles.icon} ${className}`}>{code}</span>; }
export function BusinessLanding() {
  const [period, setPeriod] = useState(30);
  const [selected, setSelected] = useState("business");
  return <div className={`page-shell ${styles.page}`} data-business-landing>
    <section className={styles.hero}>
      <div className={styles.intro}><div className={styles.brandRow}><Link href="/" className={styles.brand}>Axtar<span>.az</span></Link><span className={styles.chip}>BİZNES SƏHİFƏSİ</span></div>
        <h1>Biznesinizi <span>Axtar.az</span>-da yaradın</h1>
        <p>Öz biznes səhifənizi yaradın, məhsul və xidmətlərinizi nümayiş etdirin, daha çox müştəri əldə edin və satışlarınızı artırın.</p>
        <ul className={styles.checks}>{["Daha çox müştəri və görünürlük","Güvənli və peşəkar imic","Sadə idarəetmə paneli","Reklam və tanıtım imkanları","7/24 texniki dəstək"].map(text => <li key={text}><Icon code={"\uf058"}/>{text}</li>)}</ul>
      </div>
      <img className={styles.heroImage} src="https://axtar.az/img/biznesimg.jpeg" alt="Axtar.az biznes səhifəsinin kompüter və telefonda görünüşü"/>
    </section>
    <section className={styles.main}>
      <div className={styles.packages}><h2>BİZNES PAKETLƏRİ</h2>
        <div className={styles.periods} role="group" aria-label="Paket müddəti seçimi">{[30,60,90,180].map(value => <button type="button" key={value} aria-pressed={period === value} className={period === value ? styles.activePeriod : ""} onClick={() => setPeriod(value)}>{value} gün</button>)}</div>
        <div className={styles.cards}>{plans.map(plan => <article key={plan.id} className={`${styles.card} ${selected === plan.id ? styles.selected : ""}`} style={{"--plan-color":plan.color} as React.CSSProperties}>
          {plan.badge && <span className={styles.badge}>{plan.badge}</span>}
          {selected === plan.id && <span className={styles.selectedLabel}>Seçilmiş paket</span>}
          <h3>{plan.name}</h3><div className={styles.price}><strong>{plan.price * period / 30} AZN</strong><span>/ {period} gün</span></div>
          <div className={styles.planIcon}><Icon code={plan.icon}/></div>
          <ul>{plan.features.map(feature => <li key={feature}><Icon code={"\uf00c"}/>{feature}</li>)}</ul>
          <button type="button" aria-pressed={selected === plan.id} onClick={() => setSelected(plan.id)}>{selected === plan.id ? "Seçildi" : "Seç"}</button>
        </article>)}</div>
      </div>
      <aside className={styles.faq}><h2>TEZ-TEZ VERİLƏN SUALLAR</h2>{faqs.map(([question,answer]) => <details key={question}><summary>{question}<Icon code={"\uf107"}/></summary><p>{answer}</p></details>)}
        <div className={styles.help}><div><Icon code={"\uf4ad"}/></div><h3>Daha çox sualınız var?</h3><p>Bizə yazın, kömək edək.</p><a href="https://axtar.az/contact">Bizə yazın</a></div>
      </aside>
    </section>
    <section className={styles.cta}><img src="https://axtar.az/img/imglog.png" alt="Biznes sahiblərinin rəyləri" loading="lazy"/><div><h2>Artıq 1000+ biznes Axtar.az-da!</h2><p>Siz də indi qoşulun, biznesinizi internetdə böyüdün, daha çox müştəriyə çatın.</p></div><Link href={`/ownerships/create/details?package=${selected}&period=${period}`}>Biznes yarat <Icon code={"\uf061"}/></Link></section>
    <section className={styles.benefits}>{[["\uf1ad","Sürətli aktivləşdirmə","1 saat ərzində"],["\uf3ed","Təhlükəsiz ödəniş","100% qorunur"],["\uf017","Daimi dəstək","Hər gün 09:00 - 18:00"],["\uf0a1","Reklam dəstəyi","Meta reklam təlimatı və dəstək"]].map(([icon,title,text]) => <div key={title}><div><Icon code={icon}/></div><section><h3>{title}</h3><p>{text}</p></section></div>)}</section>
  </div>;
}
