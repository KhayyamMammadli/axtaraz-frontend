"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, MapPin, X } from "lucide-react";
import type { Map as LeafletMap } from "leaflet";
import type { Ownership } from "./api";
import "leaflet/dist/leaflet.css";
import styles from "./business-profile.module.css";

export function BusinessLocation({ business }: { business: Ownership }) {
  const [open, setOpen] = useState(false);
  const address = business.address?.trim();
  return <div className={styles.location}><MapPin size={21}/><span>{address || "Qeyd edilməyib"}</span>{address && <button type="button" onClick={() => setOpen(true)} aria-label="Ünvanı xəritədə göstər"><ExternalLink size={20}/></button>}{open && <LocationDialog business={business} address={address!} onClose={() => setOpen(false)}/>}</div>;
}
export function LocationDialog({ business, address, onClose }: { business: Ownership; address: string; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");
  const rawLat = business.latitude ?? business.lat;
  const rawLng = business.longitude ?? business.lng;
  const lat = rawLat === null || rawLat === undefined || rawLat === "" ? NaN : Number(rawLat);
  const lng = rawLng === null || rawLng === undefined || rawLng === "" ? NaN : Number(rawLng);
  const located = Number.isFinite(lat) && Math.abs(lat) <= 90 && Number.isFinite(lng) && Math.abs(lng) <= 180;
  const destination = `${located ? lat : 40.3725},${located ? lng : 49.8533}`;
  const googleMapsUrl = `https://www.google.com/maps/dir/?${new URLSearchParams({ api: "1", destination, travelmode: "driving" })}`;
  const wazeUrl = `https://www.waze.com/ul?${new URLSearchParams({ ll: destination, navigate: "yes", utm_source: "axtar.az" })}`;
  useEffect(() => {
    dialog.current?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let cancelled = false;
    let map: LeafletMap | undefined;
    async function initialize() {
      try {
        const L = await import("leaflet");
        if (cancelled || !container.current) return;
        map = L.map(container.current, { zoomControl: false }).setView(located ? [lat, lng] : [40.3725, 49.8533], located ? 16 : 13);
        L.control.zoom({ position: "topright" }).addTo(map);
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors' }).addTo(map);
        const markerIcon = L.divIcon({ className: styles.mapPin, html: '<span></span>', iconSize: [34, 44], iconAnchor: [17, 44] });
        L.marker(located ? [lat, lng] : [40.3725, 49.8533], { icon: markerIcon }).addTo(map);
        map.invalidateSize();
      } catch { if (!cancelled) setError("Xəritə yüklənmədi. Yenidən cəhd edin."); }
    }
    void initialize();
    return () => { cancelled = true; map?.remove(); document.body.style.overflow = previous; };
  }, [lat, lng, located]);
  return <dialog ref={dialog} className={styles.mapDialog} aria-labelledby="business-map-title" onCancel={onClose} onClick={event => { if (event.target === event.currentTarget) { const bounds = event.currentTarget.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose(); } }}><header><div><h2 id="business-map-title">{located ? business.title : "Bakı — nümunə məkan"}</h2><p>{located ? address : `${address}. Dəqiq koordinatlar qeyd edilməyib; xəritədə Bakı mərkəzi göstərilir.`}</p></div><button onClick={onClose} aria-label="Bağla"><X size={24}/></button></header><div ref={container} className={styles.locationMap}/>{error && <p role="alert">{error}</p>}<footer className={styles.mapDirections}><a href={googleMapsUrl} target="_blank" rel="noopener noreferrer"><img src="https://cdn.simpleicons.org/googlemaps/4285F4" alt="" width="23" height="23"/><span>Google Maps ilə get</span><ExternalLink size={15}/></a><a href={wazeUrl} target="_blank" rel="noopener noreferrer"><img src="https://cdn.simpleicons.org/waze/33B5E5" alt="" width="25" height="25"/><span>Waze ilə get</span><ExternalLink size={15}/></a></footer></dialog>;
}
