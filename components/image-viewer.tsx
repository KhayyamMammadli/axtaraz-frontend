"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { ChevronLeft, ChevronRight, Minus, Plus, RotateCcw, X } from "lucide-react";
import styles from "./image-viewer.module.css";

export type ViewerImage = { src: string; alt?: string };
type ImageViewerProps = { images: ViewerImage[]; title?: string; initialIndex?: number; onClose: () => void };
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/** Mount while open. Shared by business, listing and blog galleries. */
export function ImageViewer({ images, title = "Qalereya", initialIndex = 0, onClose }: ImageViewerProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(clamp(initialIndex, 0, Math.max(0, images.length - 1)));
  const [view, setView] = useState({ scale: 1, x: 0, y: 0 });
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const swipeAllowed = useRef(true);
  const gesture = useRef({ x: 0, y: 0, startX: 0, startY: 0, distance: 0, scale: 1, pinching: false });
  const reset = useCallback(() => setView({ scale: 1, x: 0, y: 0 }), []);
  const select = useCallback((next: number) => { setIndex((next + images.length) % images.length); reset(); }, [images.length, reset]);
  const move = useCallback((direction: number) => { setIndex(previous => (previous + direction + images.length) % images.length); reset(); }, [images.length, reset]);
  const zoom = (factor: number) => setView(previous => { const scale = clamp(previous.scale * factor, 1, 5); return scale === 1 ? { scale, x: 0, y: 0 } : { ...previous, scale }; });
  useEffect(() => {
    dialog.current?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const key = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
      if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
      if (event.key === "0") reset();
    };
    document.addEventListener("keydown", key);
    return () => { document.body.style.overflow = overflow; document.removeEventListener("keydown", key); };
  }, [move, reset]);
  useEffect(() => { dialog.current?.querySelector<HTMLButtonElement>(`[data-thumbnail="${index}"]`)?.scrollIntoView({ block: "nearest", inline: "nearest" }); }, [index]);
  function pointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const points = [...pointers.current.values()];
    if (points.length === 1) { swipeAllowed.current = true; gesture.current = { x: view.x, y: view.y, startX: event.clientX, startY: event.clientY, distance: 0, scale: view.scale, pinching: false }; }
    if (points.length === 2) { swipeAllowed.current = false; gesture.current.pinching = true; gesture.current.scale = view.scale; gesture.current.distance = Math.hypot(points[1].x - points[0].x, points[1].y - points[0].y); }
  }
  function pointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!pointers.current.has(event.pointerId)) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const points = [...pointers.current.values()];
    if (points.length === 2 && gesture.current.distance > 0) {
      const scale = clamp(gesture.current.scale * Math.hypot(points[1].x - points[0].x, points[1].y - points[0].y) / gesture.current.distance, 1, 5);
      setView(previous => scale === 1 ? { scale: 1, x: 0, y: 0 } : { ...previous, scale });
    } else if (points.length === 1 && view.scale > 1 && !gesture.current.pinching) {
      const bounds = event.currentTarget.getBoundingClientRect();
      setView(previous => ({ ...previous, x: clamp(gesture.current.x + event.clientX - gesture.current.startX, -bounds.width * (view.scale - 1) / 2, bounds.width * (view.scale - 1) / 2), y: clamp(gesture.current.y + event.clientY - gesture.current.startY, -bounds.height * (view.scale - 1) / 2, bounds.height * (view.scale - 1) / 2) }));
    }
  }
  function pointerEnd(event: PointerEvent<HTMLDivElement>, cancelled = false) {
    if (!pointers.current.has(event.pointerId)) return;
    if (!cancelled && swipeAllowed.current && !gesture.current.pinching && view.scale === 1 && pointers.current.size === 1) {
      const dx = event.clientX - gesture.current.startX, dy = event.clientY - gesture.current.startY;
      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.3 && images.length > 1) move(dx < 0 ? 1 : -1);
    }
    pointers.current.delete(event.pointerId);
    if (pointers.current.size === 1) {
      // Continue dragging smoothly when one finger is lifted after a pinch.
      const remaining = [...pointers.current.values()][0];
      gesture.current = { x: view.x, y: view.y, startX: remaining.x, startY: remaining.y, distance: 0, scale: view.scale, pinching: false };
      swipeAllowed.current = false;
    }
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }
  if (!images.length) return null;
  const image = images[index] ?? images[0];
  return <dialog ref={dialog} className={styles.viewer} onCancel={onClose} aria-label={`${title} — şəkil baxışı`}>
    <header className={styles.header}><div><h2>{title}</h2><span aria-live="polite">{index + 1} <i>/ {images.length}</i></span></div><div className={styles.controls}><button onClick={() => zoom(1 / 1.25)} disabled={view.scale <= 1} aria-label="Kiçilt"><Minus size={21}/></button><button onClick={reset} aria-label="Ölçünü sıfırla" title="Ölçünü sıfırla"><RotateCcw size={17}/><span>{Math.round(view.scale * 100)}%</span></button><button onClick={() => zoom(1.25)} disabled={view.scale >= 5} aria-label="Böyüt"><Plus size={21}/></button><button className={styles.close} onClick={onClose} aria-label="Bağla" autoFocus><X size={25}/></button></div></header>
    <div className={styles.stage}>
      {images.length > 1 && <button className={`${styles.arrow} ${styles.previous}`} onClick={() => move(-1)} aria-label="Əvvəlki şəkil"><ChevronLeft size={27}/></button>}
      <div className={styles.canvas} style={{ cursor: view.scale > 1 ? "grab" : "default" }} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={event => pointerEnd(event)} onPointerCancel={event => pointerEnd(event, true)} onDoubleClick={() => view.scale > 1 ? reset() : zoom(2)} onWheel={event => zoom(event.deltaY < 0 ? 1.1 : 1 / 1.1)}><img src={image.src} alt={image.alt || title} draggable={false} style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})` }}/></div>
      {images.length > 1 && <button className={`${styles.arrow} ${styles.next}`} onClick={() => move(1)} aria-label="Növbəti şəkil"><ChevronRight size={27}/></button>}
    </div>
    <footer className={styles.footer}><div className={styles.thumbnails}>{images.map((item, position) => <button key={`${item.src}-${position}`} data-thumbnail={position} className={position === index ? styles.selected : ""} onClick={() => select(position)} aria-label={`${position + 1}-ci şəkli göstər`} aria-pressed={position === index}><img src={item.src} alt="" draggable={false}/></button>)}</div><p>Şəkli dəyişmək üçün sürüşdürün · Böyütmək üçün iki barmaqdan istifadə edin</p></footer>
  </dialog>;
}
