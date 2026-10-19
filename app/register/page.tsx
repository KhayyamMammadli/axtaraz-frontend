import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/features/auth/register-form";
import styles from "@/features/auth/login.module.css";

export const metadata: Metadata = {
  title: "Qeydiyyat",
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return (
    <section className={`${styles.screen} ${styles.registerScreen}`} aria-label="Axtar.az qeydiyyat">
      <div className={styles.layout}>
        <div className={styles.panel}>
          <Link href="/" className={styles.logo} aria-label="Axtar.az ana səhifə">
            <img src="https://axtar.az/img/logo.svg" alt="axtar.az" />
          </Link>
          <h1>Qeydiyyat</h1>
          <p className={styles.subtitle}>Zəhmət olmasa qeydiyyat üçün məlumatları daxil edin</p>
          <RegisterForm />
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
