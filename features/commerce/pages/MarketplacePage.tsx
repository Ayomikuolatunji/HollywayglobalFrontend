"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Arrow } from "../../../components/ui/Arrow";
import Dropdown from "../../../components/forms/Dropdown";
import CommerceIcon from "../components/CommerceIcon";
import CommercePageHeader from "../components/CommercePageHeader";
import ListingCard from "../components/ListingCard";
import MarketCard from "../components/MarketCard";
import OrderCartSummary from "../components/OrderCartSummary";
import { categories, conditions, deliveryMethods, getListingCategory, getListingDeliveryMethod, getListingMarket, getListingsForMarket, listings, marketCategories } from "../data";

function filterOptions(values: readonly string[], subject: string) {
  return values.map((value) => ({ value, label: value, tip: value.startsWith("All") ? `Show listings across all ${subject}.` : `Show listings in ${value.toLowerCase()} ${subject}.` }));
}

export default function MarketplacePage() {
  const searchParams = useSearchParams();
  const requestedMarket = searchParams.get("market");
  const initialMarket = requestedMarket && marketCategories.includes(requestedMarket) ? requestedMarket : "All markets";
  const [search, setSearch] = useState("");
  const [market, setMarket] = useState(initialMarket);
  const [category, setCategory] = useState("All categories");
  const [condition, setCondition] = useState("All conditions");
  const [deliveryMethod, setDeliveryMethod] = useState("All delivery methods");
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("Newest first");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    setMarket(initialMarket);
  }, [initialMarket]);

  const visibleListings = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const filtered = listings.filter((listing) => {
      const listingCategory = getListingCategory(listing);
      const listingMarket = getListingMarket(listing);
      const listingDeliveryMethod = getListingDeliveryMethod(listing);
      const searchable = `${listing.name} ${listingCategory} ${listingMarket} ${listing.location} ${listing.code}`.toLowerCase();
      return (!normalizedSearch || searchable.includes(normalizedSearch)) &&
        (market === "All markets" || listingMarket === market) &&
        (category === "All categories" || listingCategory === category) &&
        (condition === "All conditions" || listing.condition === condition) &&
        (deliveryMethod === "All delivery methods" || listingDeliveryMethod === deliveryMethod) &&
        (!location || listing.location.toLowerCase().includes(location.toLowerCase())) &&
        (!featuredOnly || listing.featured);
    });

    return [...filtered].sort((a, b) => {
      if (sort === "Most viewed") return b.views - a.views;
      if (sort === "Name A-Z") return a.name.localeCompare(b.name);
      return b.code.localeCompare(a.code);
    });
  }, [category, condition, deliveryMethod, featuredOnly, location, market, search, sort]);

  useEffect(() => {
    setVisibleCount(12);
  }, [category, condition, deliveryMethod, featuredOnly, location, market, search, sort]);

  const displayedListings = visibleListings.slice(0, visibleCount);
  const hasMoreListings = displayedListings.length < visibleListings.length;
  const hasActiveFilters = Boolean(search.trim() || market !== "All markets" || category !== "All categories" || condition !== "All conditions" || deliveryMethod !== "All delivery methods" || location.trim() || featuredOnly);

  function clearFilters() {
    setSearch("");
    setMarket("All markets");
    setCategory("All categories");
    setCondition("All conditions");
    setDeliveryMethod("All delivery methods");
    setLocation("");
    setFeaturedOnly(false);
  }

  return (
    <div className="w-full space-y-4 p-4 sm:p-6">
      <CommercePageHeader compact kicker="HOLLYWAY MARKETS" title="Explore by market." description="Find items through the kind of sale they belong to: urgent sales, NYSC clearances, relocation, business clearance and more." action={<div className="flex flex-wrap gap-2"><Link className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#dfe4ed] bg-white px-3 text-xs font-extrabold text-[#1453bb] hover:border-[#1453bb]" href="/dashboard/marketplace/markets">Browse markets</Link><Link className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#dfe4ed] bg-white px-3 text-xs font-extrabold text-[#1453bb] hover:border-[#1453bb]" href="/dashboard/cart">View cart</Link><Link className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#ff8a00] px-3 text-xs font-extrabold text-[#17223a]" href="/dashboard/listings/new">List an item <Arrow /></Link></div>} />

      <section className="rounded-lg border border-[#dfe4ed] bg-white p-4" aria-label="Marketplace search and filters">
        <label className="flex h-10 items-center gap-3 rounded-lg border border-[#dfe4ed] bg-[#f8fafc] px-3 text-[#71809a]">
          <CommerceIcon name="search" />
          <span className="sr-only">Search listings</span>
          <input className="min-w-0 flex-1 bg-transparent text-xs text-[#0b1830] outline-none placeholder:text-[#8995a8]" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search items, categories or listing codes" />
        </label>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <Dropdown label="Market" options={filterOptions(marketCategories, "markets")} value={market} onChange={setMarket} required={false} compact showSelectedTip={false} />
          <Dropdown label="Item type" options={filterOptions(categories, "item types")} value={category} onChange={setCategory} required={false} compact showSelectedTip={false} />
          <Dropdown label="Condition" options={filterOptions(conditions, "conditions")} value={condition} onChange={setCondition} required={false} compact showSelectedTip={false} />
          <Dropdown label="Delivery method" options={filterOptions(deliveryMethods, "delivery methods")} value={deliveryMethod} onChange={setDeliveryMethod} required={false} compact showSelectedTip={false} />
          <label className="grid gap-1.5 text-[10px] font-extrabold text-[#596983]">Location<input className="h-9 rounded-lg border border-[#dfe4ed] bg-white px-2 text-xs font-medium text-[#0b1830] outline-none focus:border-[#1453bb]" value={location} onChange={(event) => setLocation(event.target.value)} placeholder="State, city or area" /></label>
        </div>
        <label className="mt-3 inline-flex items-center gap-2 text-[10px] font-extrabold text-[#596983]"><input className="accent-[#ff8a00]" type="checkbox" checked={featuredOnly} onChange={(event) => setFeaturedOnly(event.target.checked)} />Featured listings only</label>
      </section>

      <OrderCartSummary />

      {hasActiveFilters ? (
        <>
          <section className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <span className="text-[10px] font-extrabold tracking-[.18em] text-[#8995a8]">LISTINGS</span>
              <h3 className="mt-1 font-[Manrope] text-lg font-extrabold tracking-[-.04em] text-[#0b1830]">{visibleListings.length} items ready to explore</h3>
            </div>
            <div className="w-full sm:w-48"><Dropdown label="Sort by" options={filterOptions(["Newest first", "Most viewed", "Name A-Z"], "sorting options")} value={sort} onChange={setSort} required={false} compact showSelectedTip={false} /></div>
          </section>
          {visibleListings.length ? (
            <>
              <section className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))]" aria-label="Marketplace listings">
                {displayedListings.map((listing) => <ListingCard listing={listing} detailsHref={`/dashboard/marketplace/${listing.code}`} key={listing.code} />)}
              </section>
              {hasMoreListings && (
                <div className="flex justify-center pt-2">
                  <button className="h-10 rounded-lg border border-[#1453bb] bg-white px-4 text-xs font-extrabold text-[#1453bb] hover:bg-[#edf4ff]" type="button" onClick={() => setVisibleCount((count) => count + 12)}>Load more listings</button>
                </div>
              )}
            </>
          ) : (
            <section className="rounded-xl border border-[#dfe4ed] bg-white p-12 text-center">
              <CommerceIcon name="search" className="mx-auto h-6 w-6" />
              <h3 className="mt-4 font-[Manrope] text-lg font-extrabold text-[#0b1830]">No listings match these filters.</h3>
              <p className="mt-2 text-xs text-[#687895]">Try a different search, market, item type, delivery method or location.</p>
              <button className="mt-5 h-10 rounded-lg bg-[#ff8a00] px-4 text-xs font-extrabold text-[#17223a]" type="button" onClick={clearFilters}>Clear filters</button>
            </section>
          )}
        </>
      ) : (
        <>
          <section className="flex flex-col justify-between gap-3 border-b border-[#dfe4ed] pb-4 sm:flex-row sm:items-end">
            <div>
              <span className="text-[10px] font-extrabold tracking-[.18em] text-[#8995a8]">MARKET CATEGORIES</span>
              <h3 className="mt-2 font-[Manrope] text-xl font-extrabold tracking-[-.04em] text-[#0b1830]">Choose where to browse</h3>
            </div>
            <Link className="inline-flex items-center gap-2 text-xs font-extrabold text-[#1453bb] hover:underline" href="/dashboard/marketplace/markets">View all markets <Arrow /></Link>
          </section>
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Hollyway market categories">
            {marketCategories.slice(1).map((marketName) => <MarketCard market={marketName} listings={getListingsForMarket(marketName)} key={marketName} />)}
          </section>
        </>
      )}
    </div>
  );
}
