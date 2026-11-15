"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "./session";
import { formatMobileNumber, mobileNumberPattern } from "./phone";
import { Eye, EyeOff, LockKeyhole, Phone } from "lucide-react";
import styles from "./login.module.css";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [phone, setPhone] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const data = new FormData(event.currentTarget);
    setPending(true); setError("");
    try {
      await login(formatMobileNumber(String(data.get("phone") || "")), String(data.get("password") || ""), data.get("remember") === "on");
      router.replace("/account/listings"); router.refresh();
    } catch (error) { setError(error instanceof Error ? error.message : "Giriş mümkün olmadı."); }
    finally { setPending(false); }
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
            placeholder="(050) 000-00-00"
            inputMode="tel"
            value={phone}
            pattern={mobileNumberPattern.source}
            title="Nömrəni (050) 000-00-00 formatında daxil edin"
            onChange={event => {
              const input = event.currentTarget;
              const raw = input.value;
              const cursor = input.selectionStart ?? raw.length;
              const formatted = formatMobileNumber(raw);
              setPhone(formatted);
              if (cursor < raw.length) {
                const count = raw.slice(0, cursor).replace(/\D/g, "").length;
                let position = 0, seen = 0;
                while (position < formatted.length && seen < count) { if (/\d/.test(formatted[position])) seen++; position++; }
                requestAnimationFrame(() => input.setSelectionRange(position, position));
              }
            }}
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

      <div className={styles.options}>
        <label className={styles.remember}>
          <input type="checkbox" name="remember" />
          <span>Məni yadda saxla</span>
        </label>
        <Link href="/forgot-password" className={styles.forgot}>
          Şifrəni unutmusunuz?
        </Link>
      </div>

      <button className={styles.submit} type="submit" disabled={pending} aria-busy={pending}>{pending ? "Giriş edilir..." : "Daxil olun"}</button>
      {error && <p className={styles.message} role="alert">{error}</p>}

      <div className={styles.register}>
        <span>Hələ də qeydiyyatdan keçməmisiniz?</span>
        <Link href="/register">Qeydiyyat</Link>
      </div>
    </form>
  );
}
