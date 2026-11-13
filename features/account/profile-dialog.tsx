"use client";

import { useEffect, useRef, useState } from "react";
import { Eye, EyeOff, X, UserRound, Camera, LockKeyhole } from "lucide-react";
import styles from "./account-cabinet.module.css";

export type ProfileDetails = { firstName: string; lastName: string; phone: string; email: string; avatar?: string };
export function ProfileDialog({ mode, profile, onClose, onSave, onPasswordSave }: {
  mode: "profile" | "password"; profile: ProfileDetails; onClose: () => void;
  onSave: (value: ProfileDetails) => void; onPasswordSave: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const [error, setError] = useState("");
  useEffect(() => {
    dialog.current?.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, []);
  return <dialog ref={dialog} className={styles.profileDialog} onCancel={onClose} onClick={event => { if (event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose(); } }} aria-labelledby="profile-dialog-title">
    <div className={styles.modalHeading}><span className={styles.modalSymbol}>{mode === "password" ? <LockKeyhole size={23}/> : <UserRound size={23}/>}</span><div><h2 id="profile-dialog-title">{mode === "password" ? "Şifrəni yenilə" : "Məlumatlarını yenilə"}</h2><p>{mode === "password" ? "Hesabınız üçün yeni şifrə təyin edin." : "Şəxsi məlumatlarınızı buradan dəyişin."}</p></div><button type="button" onClick={onClose} aria-label="Bağla"><X size={20}/></button></div>
    <form onSubmit={event => {
      event.preventDefault(); const data = new FormData(event.currentTarget);
      if (mode === "password") {
        const password = String(data.get("password"));
        if (password !== data.get("confirmation")) { setError("Yeni şifrə və şifrə təkrarı eyni olmalıdır."); return; }
        if (password === data.get("current")) { setError("Yeni şifrə hazırkı şifrədən fərqli olmalıdır."); return; }
        onPasswordSave();
      } else onSave({ firstName: String(data.get("firstName")).trim(), lastName: String(data.get("lastName")).trim(), phone: String(data.get("phone")).trim(), email: String(data.get("email")).trim(), avatar });
    }}>
      {mode === "profile" ? <>
        <div className={styles.modalAvatarRow}><span className={styles.modalAvatar}>{avatar ? <img src={avatar} alt="Profil şəkli"/> : <UserRound size={35}/>}</span><div><label className={styles.modalUpload}><Camera size={15}/> Şəkli dəyiş<input type="file" accept="image/*" onChange={event => { const file = event.target.files?.[0]; if (!file) return; if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) { setError("5 MB-dan kiçik şəkil seçin."); return; } const reader = new FileReader(); reader.onload = () => { setAvatar(String(reader.result)); setError(""); }; reader.readAsDataURL(file); }}/></label><small>JPG, PNG və ya WebP · maksimum 5 MB</small></div></div>
        <div className={styles.nameFields}><label>Adınız<input name="firstName" defaultValue={profile.firstName} autoComplete="given-name" required maxLength={60}/></label><label>Soyadınız<input name="lastName" defaultValue={profile.lastName} autoComplete="family-name" required maxLength={60}/></label></div>
        <label>Telefon nömrəsi<span className={styles.phoneField}><span>🇦🇿 +994</span><input name="phone" type="tel" autoComplete="tel-national" defaultValue={profile.phone} required/></span></label>
        <label>E-poçt ünvanı<input name="email" type="email" autoComplete="email" defaultValue={profile.email} required/></label>
      </> : <>{[{ name: "current", label: "Hazırkı şifrə", placeholder: "Cari şifrəniz" }, { name: "password", label: "Yeni şifrə", placeholder: "Ən azı 8 simvol" }, { name: "confirmation", label: "Şifrə təkrarı", placeholder: "Yeni şifrəni təkrar daxil edin" }].map(field => <label key={field.name}>{field.label}<span className={styles.passwordField}><input name={field.name} type={visible[field.name] ? "text" : "password"} placeholder={field.placeholder} autoComplete={field.name === "current" ? "current-password" : "new-password"} minLength={field.name === "current" ? 1 : 8} required/><button type="button" onClick={() => setVisible(previous => ({ ...previous, [field.name]: !previous[field.name] }))} aria-label={visible[field.name] ? "Şifrəni gizlət" : "Şifrəni göstər"} aria-pressed={!!visible[field.name]}>{visible[field.name] ? <EyeOff size={19}/> : <Eye size={19}/>}</button></span></label>)}<p className={styles.passwordHint}>Demo rejim: hazırkı şifrə serverdə yoxlanılmır və yeni şifrə saxlanılmır.</p></>}
      {error && <p className={styles.formError} role="alert">{error}</p>}
      <div className={styles.modalFooter}><button type="button" onClick={onClose}>İmtina et</button><button type="submit">Yadda saxla</button></div>
    </form>
  </dialog>;
}
