"use client";
import { useState } from "react";
import { Clock3, Crown, Gem, Tag, ThumbsUp, Zap } from "lucide-react";
import { feedTabs } from "@/features/listings/data";
const icons = { crown:Crown, gem:Gem, zap:Zap, tag:Tag, thumbs:ThumbsUp, clock:Clock3 };
export function FeedTabs() {
 const [active,setActive]=useState<(typeof feedTabs)[number]["id"]>("premium");
 return <nav className="feed-tabs" role="tablist" aria-label="Elan növü">{feedTabs.map(tab=>{const Icon=icons[tab.icon];return <button key={tab.id} type="button" role="tab" aria-selected={active===tab.id} className={active===tab.id?"feed-tab active":"feed-tab"} onClick={()=>setActive(tab.id)}><Icon size={17}/>{tab.label}</button>})}</nav>;
}
