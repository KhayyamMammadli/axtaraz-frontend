"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Eye } from "lucide-react";
import styles from "./editor-preview.module.css";

export function EditorPreview({ children, className, formId, title, submitLabel }: { children: ReactNode; className?: string; formId: string; title: string; submitLabel: string }) {
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const back = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const scroll = useRef(0);
  const id = useId();
  useEffect(() => {
    const media = window.matchMedia("(max-width: 760px)");
    const update = () => { setMobile(media.matches); if (!media.matches) setOpen(false); };
    update(); media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  function close() { setOpen(false); window.scrollTo(0, scroll.current); trigger.current?.focus({ preventScroll: true }); }
  useEffect(() => {
    if (!open || !mobile) return;
    const overflow = document.body.style.overflow;
    const form = document.getElementById(formId) as HTMLFormElement | null;
    const wasInert = form?.inert ?? false;
    if (form) form.inert = true;
    document.body.style.overflow = "hidden";
    body.current?.scrollTo(0, 0);
    back.current?.focus({ preventScroll: true });
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); close(); }
      if (event.key === "Tab") {
        const elements = panel.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), [tabindex="0"]');
        const first = elements?.[0], last = elements?.[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener("keydown", key);
    return () => { document.body.style.overflow = overflow; if (form) form.inert = wasInert; document.removeEventListener("keydown", key); };
  }, [open, mobile, formId]);
  function publish() {
    close();
    requestAnimationFrame(() => { const form = document.getElementById(formId) as HTMLFormElement | null; if (form) { form.inert = false; form.requestSubmit(); } });
  }
  return <>
    <button ref={trigger} type="button" className={styles.eye} aria-label="Önbaxışı aç" aria-expanded={open} aria-controls={id} onClick={() => { scroll.current = window.scrollY; setOpen(true); }}><Eye size={25}/></button>
    <div className={styles.publish} inert={open}><button type="submit" form={formId}>{submitLabel}<ArrowRight size={18}/></button></div>
    <aside ref={panel} id={id} className={`${className || ""} ${styles.shell} ${open ? styles.open : ""}`} role={mobile ? "dialog" : undefined} aria-modal={mobile && open ? true : undefined} aria-label={title} inert={mobile && !open}>
      <header className={styles.header}><button ref={back} type="button" onClick={close} aria-label="Redaktəyə qayıt"><ArrowLeft size={20}/></button><strong>{title}</strong></header>
      <div ref={body} className={styles.body}>{children}</div>
      <footer className={styles.footer}><button type="button" onClick={close}>Redaktəyə qayıt</button><button type="button" onClick={publish}>{submitLabel}<ArrowRight size={17}/></button></footer>
    </aside>
  </>;
}
