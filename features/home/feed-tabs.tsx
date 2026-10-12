"use client";

import { useState } from "react";
import { Clock3, Crown, Gem, Heart, Tag, ThumbsUp, Zap } from "lucide-react";
import { feedTabs, listings } from "@/features/listings/data";
import { ListingCard } from "@/features/listings/listing-card";

const icons = { crown: Crown, gem: Gem, zap: Zap, tag: Tag, thumbs: ThumbsUp, clock: Clock3 };

export function FeedTabs() {
  const [active, setActive] = useState<(typeof feedTabs)[number]["id"]>("premium");
  const activeListings = listings.filter((listing) => listing.kind === active);
  return (
    <section className="feed-section" aria-labelledby="feed-heading">
      <h2 id="feed-heading" className="sr-only">Elan lentləri</h2>
      <div className="feed-tabs" role="tablist" aria-label="Elan növü">
        {feedTabs.map((tab) => {
          const Icon = icons[tab.icon];
          return <button key={tab.id} type="button" role="tab" aria-selected={active === tab.id} className={active === tab.id ? "feed-tab active" : "feed-tab"} onClick={() => setActive(tab.id)}><Icon size={17} />{tab.label}</button>;
        })}
      </div>
      <div className="listing-grid">
        {activeListings.map((listing) => <ListingCard key={listing.id} listing={listing} />)}
      </div>
      <a className="all-listings-link" href={`/full-search?tab=${active}`}>Bütün elanlara bax <span>→</span></a>
    </section>
  );
}
