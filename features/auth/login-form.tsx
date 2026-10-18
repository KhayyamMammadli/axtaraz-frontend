"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Eye, EyeOff, LockKeyhole, Phone, RefreshCw } from "lucide-react";
import styles from "./login.module.css";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Daxil olma xidməti qoşulduqdan sonra hesabınıza daxil ola biləcəksiniz.");
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

      <label className={styles.field}>
        <span>Şifrə</span>
        <span className={styles.inputWrap}>
          <LockKeyhole aria-hidden="true" size={19} />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            autoComplete="current-password"
            required
            aria-label="Şifrə"
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

      <label className={styles.captcha}>
        <input type="checkbox" name="captcha" />
        <span>Mən robot deyiləm</span>
        <span className={styles.captchaBrand} aria-hidden="true">
          <RefreshCw size={28} />
          <small>reCAPTCHA</small>
        </span>
      </label>

      <div className={styles.options}>
        <label className={styles.remember}>
          <input type="checkbox" name="remember" />
          <span>Məni yadda saxla</span>
        </label>
        <button
          type="button"
          className={styles.forgot}
          onClick={() => setMessage("Şifrə bərpa xidməti hələ qoşulmayıb.")}
        >
          Şifrəni unutmusunuz?
        </button>
      </div>

      <button className={styles.submit} type="submit">Daxil olun</button>
      <p className={styles.message} aria-live="polite">{message}</p>

      <div className={styles.register}>
        <span>Hələ də qeydiyyatdan keçməmisiniz?</span>
        <Link href="/register">Qeydiyyat</Link>
      </div>
    </form>
  );
}
