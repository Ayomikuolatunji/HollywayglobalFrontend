"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Arrow } from "../../../components/ui/Arrow";
import CommercePageHeader from "../components/CommercePageHeader";
import MarketCard from "../components/MarketCard";
import { getListingsForMarket, marketCategories } from "../data";
import { fetchAllMarketplaceListings } from "../data/listingApi";

const marketDescriptions: Record<string, string> = {
  "Declutter Market": "Everyday home, office and personal items being released for a new owner.",
  "Urgent Sale Market": "Items that need a faster, clearly explained sale route.",
  "Relocation / Japa Market": "Items available because a seller is moving locally or abroad.",
  "Importer / Container Market": "Imported goods, container stock and excess inventory.",
  "Campus & NYSC Market": "Student, graduate and service-year items being cleared.",
  "Business Clearance Market": "Equipment, stock and furniture from business clearances.",
  "Full Home Clearance Market": "Household items grouped for a full home clearance.",
  "Repair, Refurbish & Resell Market": "Repaired, restored and refurbished items ready for resale.",
  "Trade-in & Upgrade Market": "Items connected to a trade-in, replacement or upgrade.",
  "Agro & Crafts Market": "Farm produce, processed goods and handmade products.",
  "Other Sales Market": "Listings that need a different sales route.",
};

export default function MarketsPage() {
  const [items, setItems] = useState<Awaited<ReturnType<typeof fetchAllMarketplaceListings>>>([]);
  const [error, setError] = useState("");
  useEffect(() => { void fetchAllMarketplaceListings().then(setItems).catch((reason) => setError(reason instanceof Error ? reason.message : "Markets could not be loaded.")); }, []);
  return <div className="w-full space-y-6 p-5 sm:p-8"><CommercePageHeader kicker="HOLLYWAY MARKETS" title="Choose a market." description="Start with the reason or sale route that matches the item. Open a market to review its published listings." action={<Link className="inline-flex items-center gap-2 text-xs font-extrabold text-[#1453bb] hover:underline" href="/dashboard/marketplace">Back to marketplace <Arrow /></Link>} />{error && <p className="rounded-lg border border-[#f1c8c3] bg-[#fff5f3] p-3 text-xs font-semibold text-[#a32929]">{error}</p>}<section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-label="Hollyway markets">{marketCategories.slice(1).map((market) => { const marketItems = getListingsForMarket(items, market); return <div key={market}><MarketCard market={market} listings={marketItems} /><p className="px-1 pt-2 text-[10px] leading-4 text-[#687895]">{marketDescriptions[market]}</p></div>; })}</section></div>;
}
