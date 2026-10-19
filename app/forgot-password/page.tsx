import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ForgotPasswordForm } from "@/features/auth/forgot-password-form";
import styles from "@/features/auth/login.module.css";

export const metadata: Metadata = {
  title: "Şifrəni unutdum",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <section className={styles.screen} aria-label="Axtar.az şifrə bərpası">
      <div className={styles.layout}>
        <div className={styles.panel}>
          <Link href="/login" className={styles.backLink}>
            <ArrowLeft aria-hidden="true" size={16} />
            Geri
          </Link>
          <Link href="/" className={styles.logo} aria-label="Axtar.az ana səhifə">
            <img src="https://axtar.az/img/logo.svg" alt="axtar.az" />
          </Link>
          <h1>Şifrəmi unutmuşam</h1>
          <p className={`${styles.subtitle} ${styles.forgotSubtitle}`}>
            Şifrənizi sıfırlamaq üçün mobil nömrənizi daxil edin. Nömrəyə 6 rəqəmli OTP kod göndəriləcək.
          </p>
          <ForgotPasswordForm />
          <div className={styles.register}>
            <span>Hesabınız artıq mövcuddur?</span>
            <Link href="/login">Giriş et</Link>
          </div>
        </div>
        <div className={styles.illustration}>
          <img
            src="/images/login-ship.webp"
            alt="Qırmızı yelkənli gəmidə dənizə baxan kapitan"
            className={styles.ship}
          />
        </div>
      </div>
    </section>
  );
}
