"use client";

import { useState, type FormEvent } from "react";
import { Phone, RefreshCw } from "lucide-react";
import styles from "./login.module.css";

export function ForgotPasswordForm() {
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Şifrəni yeniləmək üçün təsdiq kodu göndəriləcək.");
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.field}>
        <span>Mobil nömrə</span>
        <span className={styles.inputWrap}>
          <Phone aria-hidden="true" size={19} />
          <input
            type="tel"
            name="phone"
            autoComplete="tel"
            placeholder="(055) 000-00-00"
            required
          />
        </span>
      </label>

      <label className={styles.captcha}>
        <input type="checkbox" name="captcha" required />
        <span>Mən robot deyiləm</span>
        <span className={styles.captchaBrand} aria-hidden="true">
          <RefreshCw size={28} />
          <small>reCAPTCHA</small>
        </span>
      </label>

      <button className={styles.submit} type="submit">Kod göndər</button>
      <p className={styles.message} aria-live="polite">{message}</p>
    </form>
  );
}
