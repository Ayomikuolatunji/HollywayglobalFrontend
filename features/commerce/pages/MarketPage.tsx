import Link from "next/link";
import { Arrow } from "../../../components/ui/Arrow";
import CommercePageHeader from "../components/CommercePageHeader";
import MarketListingCard from "../components/MarketListingCard";
import { getListingsForMarket, getMarketFromSlug } from "../data";

export default function MarketPage({ slug }: { slug: string }) {
  const market = getMarketFromSlug(slug);
  if (!market || market === "All markets") return <div className="mx-auto max-w-[760px] p-5 sm:p-8"><section className="rounded-xl border border-[#dfe4ed] bg-white p-8 text-center shadow-sm"><h2 className="font-[Manrope] text-2xl font-extrabold text-[#0b1830]">Market not found</h2><p className="mt-2 text-sm text-[#53627a]">This Hollyway market is not available.</p><Link className="mt-6 inline-flex items-center gap-2 text-xs font-extrabold text-[#1453bb]" href="/dashboard/marketplace/markets">View all markets <Arrow /></Link></section></div>;

  const marketListings = getListingsForMarket(market);
  return <div className="mx-auto max-w-[1180px] space-y-6 p-5 sm:p-8"><CommercePageHeader kicker="HOLLYWAY MARKET" title={market} description="Browse the published items in this sale route. Each item has its own listing code, price, details and order actions." action={<Link className="inline-flex items-center gap-2 text-xs font-extrabold text-[#1453bb] hover:underline" href="/dashboard/marketplace/markets">All markets <Arrow /></Link>} />{marketListings.length ? <section className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr))]" aria-label={`${market} listings`}>{marketListings.map((listing) => <MarketListingCard listing={listing} detailsHref={`/dashboard/marketplace/${listing.code}`} key={listing.code} />)}</section> : <section className="rounded-xl border border-dashed border-[#cbd5e1] bg-[#f8fafc] p-12 text-center"><h2 className="font-[Manrope] text-xl font-extrabold text-[#0b1830]">No items in this market yet.</h2><p className="mt-2 text-xs leading-5 text-[#687895]">New listings will appear here after they are reviewed and published.</p><Link className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#1453bb] px-4 py-3 text-xs font-extrabold text-white" href="/dashboard/listings/new">List an item <Arrow /></Link></section>}</div>;
}
