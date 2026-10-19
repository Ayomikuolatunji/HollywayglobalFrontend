"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Arrow } from "../../../components/ui/Arrow";
import CommercePageHeader from "../components/CommercePageHeader";
import MarketListingCard from "../components/MarketListingCard";
import { getMarketDisplayName, getMarketFromSlug, getMarketRoute } from "../data";
import { fetchMarketplaceListings, type MarketplacePage } from "../data/listingApi";

export default function MarketPage({ slug }: { slug: string }) {
  const market = getMarketFromSlug(slug);
  const [page, setPage] = useState<MarketplacePage | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!market || market === "All markets") return;
    const controller = new AbortController();
    setLoading(true);
    setError("");
    void fetchMarketplaceListings({ route: getMarketRoute(market), page: pageNumber, pageSize: 24, signal: controller.signal }).then((next) => {
      setPage((current) => pageNumber === 1 ? next : current ? { ...next, items: [...current.items, ...next.items] } : next);
    }).catch((reason) => {
      if (reason instanceof DOMException && reason.name === "AbortError") return;
      setError(reason instanceof Error ? reason.message : "This market could not be loaded.");
    }).finally(() => setLoading(false));
    return () => controller.abort();
  }, [market, pageNumber]);
  const items = page?.items || [];
  if (!market || market === "All markets") return <div className="mx-auto max-w-[760px] p-5 sm:p-8"><section className="rounded-xl border border-[#dfe4ed] bg-white p-8 text-center shadow-sm"><h2 className="font-[Manrope] text-2xl font-extrabold text-[#0b1830]">Market not found</h2><p className="mt-2 text-sm text-[#53627a]">This Hollyway market is not available.</p><Link className="mt-6 inline-flex items-center gap-2 text-xs font-extrabold text-[#1453bb]" href="/dashboard/marketplace/markets">View all markets <Arrow /></Link></section></div>;
  return <div className="w-full space-y-6 p-5 sm:p-8"><CommercePageHeader kicker="HOLLYWAY MARKET" title={getMarketDisplayName(market)} description="Browse published items in this sale route. Each item has its own listing code, price, details and order actions." action={<Link className="inline-flex items-center gap-2 text-xs font-extrabold text-[#1453bb] hover:underline" href="/dashboard/marketplace/markets">All markets <Arrow /></Link>} />{error && <p className="rounded-lg border border-[#f1c8c3] bg-[#fff5f3] p-3 text-xs font-semibold text-[#a32929]">{error}</p>}{loading && !items.length ? <section className="grid min-h-56 place-items-center rounded-xl border border-[#dfe4ed] bg-white text-xs font-semibold text-[#687895]">Loading published items…</section> : items.length ? <><section className="grid grid-cols-2 gap-2.5 sm:gap-4 sm:[grid-template-columns:repeat(auto-fill,minmax(205px,1fr))]" aria-label={`${getMarketDisplayName(market)} listings`}>{items.map((listing) => <MarketListingCard listing={listing} detailsHref={`/dashboard/marketplace/${listing.code}`} key={listing.code} />)}</section>{page?.has_next && <div className="flex justify-center"><button className="h-10 rounded-lg border border-[#dfe4ed] bg-white px-5 text-xs font-extrabold text-[#0b1830] disabled:opacity-50" disabled={loading} onClick={() => setPageNumber((current) => current + 1)} type="button">{loading ? "Loading…" : "Load more listings"}</button></div>}</> : <section className="rounded-xl border border-dashed border-[#cbd5e1] bg-[#f8fafc] p-12 text-center"><h2 className="font-[Manrope] text-xl font-extrabold text-[#0b1830]">No published items in this market yet.</h2><p className="mt-2 text-xs leading-5 text-[#687895]">New listings will appear here after review and publication.</p><Link className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#1453bb] px-4 py-3 text-xs font-extrabold text-white" href="/dashboard/listings/new">List an item <Arrow /></Link></section>}</div>;
}
