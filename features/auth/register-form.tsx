"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Eye, EyeOff, LockKeyhole, Mail, Phone, RefreshCw, UserRound } from "lucide-react";
import styles from "./login.module.css";

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (formData.get("password") !== formData.get("passwordRepeat")) {
      setMessage("Daxil etdiyiniz şifrələr eyni deyil.");
      return;
    }
    setMessage("Qeydiyyat xidməti qoşulduqdan sonra hesabınız yaradılacaq.");
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.field}>
        <span>Ad</span>
        <span className={styles.inputWrap}>
          <UserRound aria-hidden="true" size={19} />
          <input type="text" name="firstName" autoComplete="given-name" required />
        </span>
      </label>

      <label className={styles.field}>
        <span>Soyad</span>
        <span className={styles.inputWrap}>
          <UserRound aria-hidden="true" size={19} />
          <input type="text" name="lastName" autoComplete="family-name" required />
        </span>
      </label>

      <label className={styles.field}>
        <span>Mobil nömrə</span>
        <span className={styles.inputWrap}>
          <Phone aria-hidden="true" size={19} />
          <input type="tel" name="phone" autoComplete="tel" placeholder="(055) 000-00-00" required />
        </span>
      </label>

      <label className={styles.field}>
        <span>E-poçt ünvanı</span>
        <span className={styles.inputWrap}>
          <Mail aria-hidden="true" size={19} />
          <input type="email" name="email" autoComplete="email" placeholder="hello@mail.com" required />
        </span>
      </label>

      <label className={styles.field}>
        <span>Şifrə</span>
        <span className={styles.inputWrap}>
          <LockKeyhole aria-hidden="true" size={19} />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            autoComplete="new-password"
            minLength={8}
            required
          />
          <button
            type="button"
            className={styles.passwordToggle}
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? "Şifrəni gizlət" : "Şifrəni göstər"}
            aria-pressed={showPassword}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </span>
      </label>

      <label className={styles.field}>
        <span>Şifrənin təkrarı</span>
        <span className={styles.inputWrap}>
          <LockKeyhole aria-hidden="true" size={19} />
          <input
            type={showRepeatPassword ? "text" : "password"}
            name="passwordRepeat"
            autoComplete="new-password"
            minLength={8}
            required
          />
          <button
            type="button"
            className={styles.passwordToggle}
            onClick={() => setShowRepeatPassword((visible) => !visible)}
            aria-label={showRepeatPassword ? "Şifrəni gizlət" : "Şifrəni göstər"}
            aria-pressed={showRepeatPassword}
          >
            {showRepeatPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
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

      <button className={styles.submit} type="submit">Qeydiyyatdan keç</button>
      <p className={styles.message} aria-live="polite">{message}</p>

      <div className={styles.register}>
        <span>Hesabınız var?</span>
        <Link href="/login">Daxil ol</Link>
      </div>
    </form>
  );
}
