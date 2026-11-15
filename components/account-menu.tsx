"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserRound, ChevronDown, ChevronRight, Megaphone, Store, Rss, LogOut } from "lucide-react";
import { logout, useSession } from "@/features/auth/session";
import { useRouter } from "next/navigation";

export function AccountMenu({ compact = false }: { compact?: boolean }) {
  const { customer } = useSession();
  const loggedIn = !!customer;
  const router = useRouter();
  const [error, setError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    function outside(event: PointerEvent) {
      if (!container.current?.contains(event.target as Node)) setOpen(false);
    }
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") { setOpen(false); trigger.current?.focus(); }
    }
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);
  if (!loggedIn) return <Link className={compact ? "compact-login" : "login-button"} href="/login">Daxil ol</Link>;
  return <div className="account-menu" ref={container}>
    <button ref={trigger} className="account-trigger" aria-label="Hesab menyusu" aria-expanded={open} onClick={() => setOpen(value => !value)}>
      <span className="account-avatar"><UserRound size={27}/></span><ChevronDown size={20} className={open ? "is-open" : ""}/>
    </button>
    {open && <div className="account-dropdown">
      <div className="account-identity"><span><UserRound size={29}/></span><div><strong>{customer?.full_name}</strong><small>{customer?.email}</small></div></div>
      <nav aria-label="Hesab keçidləri">
        {[{ title: "Məlumatlarım", href: "/account/profile", icon: UserRound }, { title: "Elanlarım", href: "/account/listings", icon: Megaphone }, { title: "Bizneslərim", href: "/account/businesses", icon: Store }, { title: "Bloqlarım", href: "/account/posts", icon: Rss }].map(({ title, href, icon: Icon }) => <Link key={href} href={href} onClick={() => setOpen(false)}><span><Icon size={22}/></span>{title}<ChevronRight size={19}/></Link>)}
      </nav>
      <button className="account-logout" disabled={loggingOut} onClick={async () => { setLoggingOut(true); setError(""); try { await logout(); setOpen(false); router.replace("/login"); router.refresh(); } catch { setError("Çıxış mümkün olmadı. Yenidən cəhd edin."); } finally { setLoggingOut(false); } }}><span><LogOut size={22}/></span>{loggingOut ? "Çıxış edilir..." : "Çıxış"}</button>{error && <p role="alert">{error}</p>}
    </div>}
  </div>;
}
