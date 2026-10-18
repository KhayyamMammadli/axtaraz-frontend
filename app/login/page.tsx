import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/features/auth/login-form";
import styles from "@/features/auth/login.module.css";

export const metadata: Metadata = {
  title: "Daxil ol",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <section className={styles.screen} aria-label="Axtar.az hesabına daxil ol">
      <div className={styles.layout}>
        <div className={styles.panel}>
          <Link href="/" className={styles.logo} aria-label="Axtar.az ana səhifə">
            <img src="https://axtar.az/img/logo.svg" alt="axtar.az" />
          </Link>
          <h1>Xoş gəlmisiniz</h1>
          <p className={styles.subtitle}>Zəhmət olmasa giriş üçün məlumatları daxil edin</p>
          <LoginForm />
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
