"use client";
export default function AccountError({ reset }: { reset: () => void }) {
  return <div className="page-shell empty-state" role="alert"><h2>Profil məlumatları yüklənmədi</h2><p>Bir az sonra yenidən cəhd edin.</p><button className="button-primary" type="button" onClick={reset}>Yenidən cəhd et</button></div>;
}
