"use client";
export default function ProductError({ reset }: { reset: () => void }) {
  return <div className="page-shell empty-state" role="alert"><h2>Elan məlumatları yüklənmədi</h2><p>Bir az sonra yenidən cəhd edin.</p><button type="button" className="button-primary" onClick={reset}>Yenidən cəhd et</button></div>;
}
