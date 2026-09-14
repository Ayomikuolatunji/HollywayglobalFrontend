"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Dropdown, { type DropdownOption } from "../../../components/forms/Dropdown";
import CommerceIcon from "../components/CommerceIcon";
import MarketListingCard from "../components/MarketListingCard";
import MarketplaceFilterDrawer from "../components/MarketplaceFilterDrawer";
import { categories, conditions, deliveryMethods, getListingCategory, getListingDeliveryMethod, getListingMarket, getMarketDisplayName, listings, marketCategories } from "../data";

const marketDotColors = ["bg-[#dd6b12]", "bg-[#14213d]", "bg-[#b8560d]", "bg-[#1f7a5c]", "bg-[#3b4b6b]", "bg-[#7a5c00]", "bg-[#6b2545]"];
const sortOptions: DropdownOption[] = [
  { value: "Newest first", label: "Newest first" },
  { value: "Price: low to high", label: "Price: low to high" },
  { value: "Price: high to low", label: "Price: high to low" },
  { value: "Most viewed", label: "Most viewed" },
  { value: "Featured", label: "Featured first" },
];

function options(values: readonly string[]): DropdownOption[] { return values.map((value) => ({ value, label: value })); }
function amount(value: string) { return Number(value.replace(/,/g, "")) || 0; }
function shortMarketName(value: string) { return getMarketDisplayName(value).replace(/ Market$/, ""); }

export default function MarketplacePage() {
  const searchParams = useSearchParams();
  const requestedMarket = searchParams.get("market");
  const initialMarket = requestedMarket && marketCategories.includes(requestedMarket) ? requestedMarket : "All markets";
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [market, setMarket] = useState(initialMarket);
  const [category, setCategory] = useState("All categories");
  const [condition, setCondition] = useState("All conditions");
  const [deliveryMethod, setDeliveryMethod] = useState("All delivery methods");
  const [minimumPrice, setMinimumPrice] = useState("");
  const [maximumPrice, setMaximumPrice] = useState("");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sort, setSort] = useState("Newest first");
  const [visibleCount, setVisibleCount] = useState(12);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => { setMarket(initialMarket); }, [initialMarket]);

  const visibleListings = useMemo(() => {
    const query = search.trim().toLowerCase();
    const place = location.trim().toLowerCase();
    const minimum = amount(minimumPrice);
    const maximum = amount(maximumPrice);
    const filtered = listings.filter((listing) => {
      const listingCategory = getListingCategory(listing);
      const listingMarket = getListingMarket(listing);
      const searchable = `${listing.name} ${listingCategory} ${listingMarket} ${listing.location} ${listing.code}`.toLowerCase();
      return (!query || searchable.includes(query)) &&
        (!place || listing.location.toLowerCase().includes(place)) &&
        (market === "All markets" || listingMarket === market) &&
        (category === "All categories" || listingCategory === category) &&
        (condition === "All conditions" || listing.condition === condition) &&
        (deliveryMethod === "All delivery methods" || getListingDeliveryMethod(listing) === deliveryMethod) &&
        (!minimum || listing.price >= minimum) && (!maximum || listing.price <= maximum) &&
        (!featuredOnly || listing.featured);
    });
    return [...filtered].sort((a, b) => {
      if (sort === "Price: low to high") return a.price - b.price;
      if (sort === "Price: high to low") return b.price - a.price;
      if (sort === "Most viewed") return b.views - a.views;
      if (sort === "Featured") return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
      return b.code.localeCompare(a.code);
    });
  }, [category, condition, deliveryMethod, featuredOnly, location, market, maximumPrice, minimumPrice, search, sort]);

  useEffect(() => { setVisibleCount(12); }, [category, condition, deliveryMethod, featuredOnly, location, market, maximumPrice, minimumPrice, search, sort]);

  const filterCount = [category !== "All categories", condition !== "All conditions", deliveryMethod !== "All delivery methods", Boolean(minimumPrice), Boolean(maximumPrice), featuredOnly].filter(Boolean).length;
  const clearFilters = useCallback(() => { setCategory("All categories"); setCondition("All conditions"); setDeliveryMethod("All delivery methods"); setMinimumPrice(""); setMaximumPrice(""); setFeaturedOnly(false); }, []);

  return (
    <div className="min-h-[calc(100vh-78px)] bg-[#f5f4f0] px-4 pb-16 pt-4 sm:px-6 lg:px-8">
      <div className="w-full">
        <div className="grid gap-2.5 sm:grid-cols-[minmax(0,1fr)_220px]">
          <label className="flex h-11 items-center gap-2.5 rounded-lg border border-[#e4e2da] bg-white px-3.5 text-[#9498a3]"><CommerceIcon name="search" className="h-[17px] w-[17px]" /><span className="sr-only">Search marketplace</span><input className="min-w-0 flex-1 bg-transparent text-sm text-[#12141c] outline-none placeholder:text-[#9498a3]" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search items, categories or listing codes" /></label>
          <label className="flex h-11 items-center gap-2.5 rounded-lg border border-[#e4e2da] bg-white px-3.5 text-[#9498a3]"><svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-6.6 7-11.5a7 7 0 0 0-14 0C5 14.4 12 21 12 21Z" fill="none" stroke="currentColor" strokeWidth="1.8" /><circle cx="12" cy="9.5" r="2.3" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg><span className="sr-only">Location</span><input className="min-w-0 flex-1 bg-transparent text-xs text-[#12141c] outline-none placeholder:text-[#9498a3]" value={location} onChange={(event) => setLocation(event.target.value)} placeholder="State, city or area" /></label>
        </div>

        <nav className="mt-3 flex gap-2 overflow-x-auto border-b border-[#e4e2da] pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Marketplace categories">
          {marketCategories.map((marketName, index) => { const active = market === marketName; const count = marketName === "All markets" ? listings.length : listings.filter((listing) => getListingMarket(listing) === marketName).length; return <button className={`flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold transition ${active ? "border-[#14213d] bg-[#14213d] text-white" : "border-[#e4e2da] bg-white text-[#5c5f6b] hover:border-[#14213d]"}`} type="button" onClick={() => setMarket(marketName)} aria-pressed={active} key={marketName}><span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-white" : marketDotColors[index % marketDotColors.length]}`} />{shortMarketName(marketName)} <span className={active ? "text-white/65" : "text-[#9498a3]"}>{count}</span></button>; })}
        </nav>

        <div className="my-3 flex items-center justify-between gap-3">
          <p className="text-xs text-[#5c5f6b]"><strong className="text-[#12141c]">{visibleListings.length}</strong> listing{visibleListings.length === 1 ? "" : "s"} found</p>
          <div className="flex items-end gap-2">
            <button className={`inline-flex h-9 items-center gap-1.5 rounded-lg border bg-white px-3 text-xs font-bold ${filterCount ? "border-[#14213d] text-[#14213d]" : "border-[#e4e2da] text-[#5c5f6b]"}`} type="button" onClick={() => setFiltersOpen(true)}><svg className="h-3.5 w-3.5" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M7 12h10M10 18h4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>Filters{filterCount > 0 && <span className="rounded-full bg-[#dd6b12] px-1.5 py-0.5 text-[9px] text-white">{filterCount}</span>}</button>
            <div className="w-40 [&>div>span]:sr-only"><Dropdown compact showSelectedTip={false} required={false} label="Sort listings" options={sortOptions} value={sort} onChange={setSort} /></div>
            <Link className="hidden h-9 items-center rounded-lg bg-[#dd6b12] px-3 text-xs font-bold text-white hover:bg-[#b8560d] sm:inline-flex" href="/dashboard/listings/new">List an item</Link>
          </div>
        </div>

        {visibleListings.length ? <><section className="grid grid-cols-2 gap-2.5 sm:gap-4 sm:[grid-template-columns:repeat(auto-fill,minmax(205px,1fr))]" aria-label="Marketplace listings">{visibleListings.slice(0, visibleCount).map((listing) => <MarketListingCard listing={listing} detailsHref={`/dashboard/marketplace/${listing.code}`} key={listing.code} />)}</section>{visibleCount < visibleListings.length && <div className="mt-6 flex justify-center"><button className="h-10 rounded-lg border border-[#e4e2da] bg-white px-5 text-xs font-bold text-[#14213d] hover:border-[#14213d]" type="button" onClick={() => setVisibleCount((count) => count + 12)}>Load more listings</button></div>}</> : <section className="rounded-xl border border-dashed border-[#d8d5ca] bg-white p-10 text-center"><CommerceIcon name="search" className="mx-auto h-6 w-6 text-[#9498a3]" /><h2 className="mt-3 font-[Manrope] text-lg font-extrabold text-[#12141c]">No listings match your search.</h2><p className="mt-1 text-xs text-[#5c5f6b]">Try another market, location, price range or item category.</p><button className="mt-4 text-xs font-extrabold text-[#b8560d]" type="button" onClick={() => { setSearch(""); setLocation(""); setMarket("All markets"); clearFilters(); }}>Clear all filters</button></section>}
      </div>

      <MarketplaceFilterDrawer open={filtersOpen} resultCount={visibleListings.length} category={category} condition={condition} deliveryMethod={deliveryMethod} minimumPrice={minimumPrice} maximumPrice={maximumPrice} featuredOnly={featuredOnly} categoryOptions={options(categories)} conditionOptions={options(conditions)} deliveryOptions={options(deliveryMethods)} onCategoryChange={setCategory} onConditionChange={setCondition} onDeliveryChange={setDeliveryMethod} onMinimumPriceChange={setMinimumPrice} onMaximumPriceChange={setMaximumPrice} onFeaturedChange={setFeaturedOnly} onClear={clearFilters} onClose={() => setFiltersOpen(false)} />
    </div>
  );
}
