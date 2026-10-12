import Link from "next/link";

export default function NotFound() {
  return <section className="auth-page page-shell"><div className="auth-card"><span className="eyebrow">404 · Səhifə tapılmadı</span><h1>Axtardığınız səhifə yoxdur</h1><p>Link dəyişmiş və ya elan artıq mövcud olmaya bilər.</p><Link href="/" className="button-primary">Ana səhifəyə qayıt</Link></div></section>;
}
