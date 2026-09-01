import Link from "next/link";
import { Arrow } from "../../../components/ui/Arrow";
import CommercePageHeader from "../components/CommercePageHeader";
import MarketCard from "../components/MarketCard";
import { getListingsForMarket, marketCategories } from "../data";

const marketDescriptions: Record<string, string> = {
  "Declutter Market": "Everyday home, office and personal items being released for a new owner.",
  "Urgent Sale Market": "Items that need a faster, clearly explained sale route.",
  "Relocation / Japa Market": "Items available because a seller is moving locally or abroad.",
  "Importer / Container Market": "Imported goods, container stock and excess inventory.",
  "Campus & NYSC Market": "Student, graduate and service-year items being cleared.",
  "Business Clearance Market": "Equipment, stock and furniture from business clearances.",
  "Estate Clearance Market": "Household items grouped from an estate or property clearance.",
  "Repair, Refurbish & Resell Market": "Repaired, restored and refurbished items ready for resale.",
  "Trade-in & Upgrade Market": "Items connected to a trade-in, replacement or upgrade.",
  "Agro & Crafts Market": "Farm produce, processed goods and handmade products.",
  "Other Sales Market": "Listings that need a different sales route.",
};

export default function MarketsPage() {
  return <div className="mx-auto max-w-[1180px] space-y-6 p-5 sm:p-8"><CommercePageHeader kicker="HOLLYWAY MARKETS" title="Choose a market." description="Start with the reason or sale route that matches the item. Open a market to review its listings and send an interest request." action={<Link className="inline-flex items-center gap-2 text-xs font-extrabold text-[#1453bb] hover:underline" href="/dashboard/marketplace">Back to marketplace <Arrow /></Link>} /><section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Hollyway markets">{marketCategories.slice(1).map((market) => <div key={market}><MarketCard market={market} listings={getListingsForMarket(market)} /><p className="px-1 pt-2 text-[10px] leading-4 text-[#687895]">{marketDescriptions[market]}</p></div>)}</section></div>;
}
