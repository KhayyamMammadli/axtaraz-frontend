"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Search, X } from "lucide-react";
import styles from "./custom-select.module.css";

type Option = { value: string; label: string };
type Props = { id?: string; name?: string; label: string; value: string; onChange: (value: string) => void; options: Option[]; required?: boolean; placeholder?: string; disabled?: boolean };

export function CustomSelect({ id, name, label, value, onChange, options, required, placeholder = "Seçin", disabled = false }: Props) {
  const generatedId = useId();
  const controlId = id || generatedId;
  const listId = `${controlId}-options`;
  const trigger = useRef<HTMLButtonElement>(null);
  const popup = useRef<HTMLDivElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [invalid, setInvalid] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0, height: 320 });
  const visible = options.filter(option => option.label.toLocaleLowerCase("az").includes(query.trim().toLocaleLowerCase("az")));
  const selected = options.find(option => option.value === value);
  function close(restoreFocus = false) { setOpen(false); if (restoreFocus) trigger.current?.focus({ preventScroll: true }); }
  function choose(option: Option) { onChange(option.value); setInvalid(false); close(true); }
  function show() { setQuery(""); setActive(Math.max(0, options.findIndex(option => option.value === value))); setOpen(true); }
  useEffect(() => {
    if (!open) return;
    const update = () => {
      const bounds = trigger.current?.getBoundingClientRect();
      if (!bounds) return;
      const below = window.innerHeight - bounds.bottom - 16;
      const above = bounds.top - 16;
      const flip = below < 240 && above > below;
      const height = Math.max(100, Math.min(320, flip ? above : below));
      const width = Math.min(Math.max(bounds.width, 250), window.innerWidth - 24);
      setPosition({ top: flip ? bounds.top - height - 8 : bounds.bottom + 8, left: Math.max(12, Math.min(bounds.left, window.innerWidth - width - 12)), width, height });
    };
    update(); search.current?.focus({ preventScroll: true });
    const outside = (event: PointerEvent) => { if (!popup.current?.contains(event.target as Node) && !trigger.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("pointerdown", outside);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => { document.removeEventListener("pointerdown", outside); window.removeEventListener("resize", update); window.removeEventListener("scroll", update, true); };
  }, [open]);
  useEffect(() => { if (open) document.getElementById(`${listId}-${active}`)?.scrollIntoView({ block: "nearest" }); }, [active, open, listId]);
  function keys(event: KeyboardEvent) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") { event.preventDefault(); setActive(current => visible.length ? (current + (event.key === "ArrowDown" ? 1 : -1) + visible.length) % visible.length : 0); }
    else if (event.key === "Enter") { event.preventDefault(); if (visible[active]) choose(visible[active]); }
    else if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); close(true); }
    else if (event.key === "Tab") { event.preventDefault(); close(true); }
  }
  return <div className={styles.wrap}>
    <button disabled={disabled} id={controlId} ref={trigger} type="button" className={`${styles.trigger} ${open ? styles.open : ""} ${invalid ? styles.invalid : ""}`} aria-label={label} aria-haspopup="listbox" aria-expanded={open} aria-controls={open ? listId : undefined} aria-invalid={invalid || undefined} onClick={() => open ? close() : show()} onKeyDown={event => { if (["ArrowDown", "ArrowUp"].includes(event.key)) { event.preventDefault(); show(); } }}><span className={selected ? styles.value : styles.placeholder}>{selected?.label || placeholder}</span><ChevronDown size={17}/></button>
    <select disabled={disabled} name={name} required={required} value={value} tabIndex={-1} aria-hidden="true" onChange={event => { onChange(event.target.value); setInvalid(false); }} onInvalid={event => { event.preventDefault(); setInvalid(true); if (event.currentTarget.form?.querySelector(":invalid") === event.currentTarget) { trigger.current?.scrollIntoView({ block: "center" }); show(); } }} style={{ position: "absolute", width: 1, height: 1, minHeight: 0, padding: 0, margin: 0, border: 0, opacity: 0, pointerEvents: "none", clipPath: "inset(50%)" }}><option value=""/>{options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
    {open && createPortal(<div ref={popup} className={styles.popup} style={{ top: position.top, left: position.left, width: position.width, maxHeight: position.height }}>
      <div className={styles.search}><Search size={17}/><input ref={search} value={query} onChange={event => { setQuery(event.target.value); setActive(0); }} onKeyDown={keys} role="combobox" aria-expanded="true" aria-controls={listId} aria-autocomplete="list" aria-activedescendant={visible[active] ? `${listId}-${active}` : undefined} aria-label={`${label} axtar`} placeholder="Axtar..." autoComplete="off"/>{query && <button type="button" aria-label="Axtarışı təmizlə" onClick={() => { setQuery(""); setActive(0); search.current?.focus(); }}><X size={14}/></button>}</div>
      <div id={listId} className={styles.list} role="listbox" aria-label={label}>{visible.map((option, index) => <div key={option.value} id={`${listId}-${index}`} role="option" aria-selected={option.value === value} className={`${styles.option} ${index === active ? styles.active : ""} ${option.value === value ? styles.selected : ""}`} onPointerMove={() => setActive(index)} onPointerDown={event => { if (event.pointerType === "mouse") event.preventDefault(); }} onClick={() => choose(option)}><span>{option.label}</span>{option.value === value && <Check size={17}/>}</div>)}{!visible.length && <p className={styles.empty}>Uyğun nəticə tapılmadı</p>}</div>
      <div className={styles.footer}>{visible.length} seçim</div>
    </div>, document.body)}
  </div>;
}
