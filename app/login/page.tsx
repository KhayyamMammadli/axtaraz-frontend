import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, LockKeyhole } from "lucide-react";

export const metadata: Metadata = { title: "Daxil ol", robots: { index: false, follow: false } };

export default function LoginPage() {
  return <section className="auth-page page-shell"><div className="auth-card"><span className="auth-icon"><LockKeyhole size={24} /></span><span className="eyebrow">Axtar.az hesabı</span><h1>Daxil ol</h1><p>Seçilmiş elanlara, mesajlara və biznes profilinizə keçid.</p><div className="auth-notice">Hesab və autentifikasiya servisi qoşulduqdan sonra bu bölmə aktiv olacaq.</div><Link href="/" className="button-primary"><ArrowLeft size={16} /> Ana səhifəyə qayıt</Link></div></section>;
}
