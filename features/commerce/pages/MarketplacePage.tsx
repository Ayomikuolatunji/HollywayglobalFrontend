"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Dropdown, { type DropdownOption } from "../../../components/forms/Dropdown";
import CommerceIcon from "../components/CommerceIcon";
import MarketListingCard from "../components/MarketListingCard";
import MarketplaceFilterDrawer from "../components/MarketplaceFilterDrawer";
import { categories, conditions, deliveryMethods, getMarketDisplayName, marketCategories } from "../data";
import { fetchMarketplaceListings, type MarketplacePage } from "../data/listingApi";

const sortOptions: DropdownOption[] = [
  { value: "newest", label: "Newest first" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
];
const marketRoutes: Record<string, string> = {
  "Declutter Market": "declutter", "Urgent Sale Market": "distress", "Relocation / Japa Market": "relocation",
  "Importer / Container Market": "importer", "Campus & NYSC Market": "campus", "Business Clearance Market": "commercial",
  "Full Home Clearance Market": "estate", "Repair, Refurbish & Resell Market": "repair", "Trade-in & Upgrade Market": "trade-in",
  "Agro & Crafts Market": "agro-crafts", "Other Sales Market": "other",
};

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
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState<MarketplacePage | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => { setMarket(initialMarket); }, [initialMarket]);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    const minimum = amount(minimumPrice);
    const maximum = amount(maximumPrice);
    void fetchMarketplaceListings({
      page: pageNumber,
      pageSize: 24,
      signal: controller.signal,
      query: search.trim() || undefined,
      location: location.trim() || undefined,
      route: market === "All markets" ? undefined : marketRoutes[market],
      category: category === "All categories" ? undefined : category,
      condition: condition === "All conditions" ? undefined : condition,
      deliveryMethod: deliveryMethod === "All delivery methods" ? undefined : deliveryMethod,
      minimumPriceMinor: minimum ? minimum * 100 : undefined,
      maximumPriceMinor: maximum ? maximum * 100 : undefined,
      featured: featuredOnly,
      sort: sort as "newest" | "price_asc" | "price_desc",
    }).then((next) => {
      setPage((current) => pageNumber === 1 ? next : current ? { ...next, items: [...current.items, ...next.items] } : next);
    }).catch((reason) => {
      if (reason instanceof DOMException && reason.name === "AbortError") return;
      setError(reason instanceof Error ? reason.message : "The marketplace could not be loaded.");
    }).finally(() => setLoading(false));
    return () => controller.abort();
  }, [category, condition, deliveryMethod, featuredOnly, initialMarket, location, market, maximumPrice, minimumPrice, pageNumber, search, sort]);

  const clearFilters = useCallback(() => {
    setCategory("All categories"); setCondition("All conditions"); setDeliveryMethod("All delivery methods");
    setMinimumPrice(""); setMaximumPrice(""); setFeaturedOnly(false); setPageNumber(1);
  }, []);
  const changeFilter = (setter: (value: string) => void) => (value: string) => { setter(value); setPageNumber(1); };
  const items = page?.items || [];
  const filterCount = [category !== "All categories", condition !== "All conditions", deliveryMethod !== "All delivery methods", Boolean(minimumPrice), Boolean(maximumPrice), featuredOnly].filter(Boolean).length;

  return (
    <div className="min-h-[calc(100vh-78px)] bg-[#f5f4f0] px-4 pb-16 pt-4 sm:px-6 lg:px-8">
      <div className="w-full">
        <div className="grid gap-2.5 sm:grid-cols-[minmax(0,1fr)_220px]">
          <label className="flex h-11 items-center gap-2.5 rounded-lg border border-[#e4e2da] bg-white px-3.5 text-[#9498a3]"><CommerceIcon name="search" className="h-[17px] w-[17px]" /><span className="sr-only">Search marketplace</span><input className="min-w-0 flex-1 bg-transparent text-sm text-[#12141c] outline-none placeholder:text-[#9498a3]" value={search} onChange={(event) => { setSearch(event.target.value); setPageNumber(1); }} placeholder="Search items, categories or listing codes" /></label>
          <label className="flex h-11 items-center gap-2.5 rounded-lg border border-[#e4e2da] bg-white px-3.5 text-[#9498a3]"><span className="sr-only">Location</span><input className="min-w-0 flex-1 bg-transparent text-xs text-[#12141c] outline-none placeholder:text-[#9498a3]" value={location} onChange={(event) => { setLocation(event.target.value); setPageNumber(1); }} placeholder="State, city or area" /></label>
        </div>

        <nav className="mt-3 flex gap-2 overflow-x-auto border-b border-[#e4e2da] pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Marketplace categories">
          {marketCategories.map((marketName) => { const active = market === marketName; return <button className={`flex shrink-0 items-center rounded-full border px-3 py-1.5 text-xs font-bold transition ${active ? "border-[#14213d] bg-[#14213d] text-white" : "border-[#e4e2da] bg-white text-[#5c5f6b] hover:border-[#14213d]"}`} type="button" onClick={() => { setMarket(marketName); setPageNumber(1); }} aria-pressed={active} key={marketName}>{shortMarketName(marketName)}</button>; })}
        </nav>

        <div className="my-3 flex items-center justify-between gap-3">
          <p className="text-xs text-[#5c5f6b]"><strong className="text-[#12141c]">{page?.total ?? 0}</strong> listing{page?.total === 1 ? "" : "s"} found</p>
          <div className="flex items-end gap-2"><button className={`inline-flex h-9 items-center gap-1.5 rounded-lg border bg-white px-3 text-xs font-bold ${filterCount ? "border-[#14213d] text-[#14213d]" : "border-[#e4e2da] text-[#5c5f6b]"}`} type="button" onClick={() => setFiltersOpen(true)}>Filters{filterCount > 0 && <span className="rounded-full bg-[#dd6b12] px-1.5 py-0.5 text-[9px] text-white">{filterCount}</span>}</button><div className="w-40 [&>div>span]:sr-only"><Dropdown compact showSelectedTip={false} required={false} label="Sort listings" options={sortOptions} value={sort} onChange={(value) => { setSort(value); setPageNumber(1); }} /></div><Link className="hidden h-9 items-center rounded-lg bg-[#dd6b12] px-3 text-xs font-bold text-white hover:bg-[#b8560d] sm:inline-flex" href="/dashboard/listings/new">List an item</Link></div>
        </div>

        {error && <p className="mb-3 rounded-lg border border-[#f1c8c3] bg-[#fff5f3] p-3 text-xs font-semibold text-[#a32929]">{error}</p>}
        {loading && !items.length ? <section className="grid min-h-56 place-items-center rounded-xl border border-[#e4e2da] bg-white text-xs font-semibold text-[#687895]">Loading published listings…</section> : items.length ? <><section className="grid grid-cols-2 gap-2.5 sm:gap-4 sm:[grid-template-columns:repeat(auto-fill,minmax(205px,1fr))]" aria-label="Marketplace listings">{items.map((listing) => <MarketListingCard listing={listing} detailsHref={`/dashboard/marketplace/${listing.code}`} key={listing.code} />)}</section>{page?.has_next && <div className="mt-6 flex justify-center"><button className="h-10 rounded-lg border border-[#e4e2da] bg-white px-5 text-xs font-bold text-[#14213d] hover:border-[#14213d]" type="button" disabled={loading} onClick={() => setPageNumber((current) => current + 1)}>{loading ? "Loading…" : "Load more listings"}</button></div>}</> : <section className="rounded-xl border border-dashed border-[#d8d5ca] bg-white p-10 text-center"><CommerceIcon name="search" className="mx-auto h-6 w-6 text-[#9498a3]" /><h2 className="mt-3 font-[Manrope] text-lg font-extrabold text-[#12141c]">No published listings match your search.</h2><p className="mt-1 text-xs text-[#5c5f6b]">Try another market, location, price range or item category.</p><button className="mt-4 text-xs font-extrabold text-[#b8560d]" type="button" onClick={() => { setSearch(""); setLocation(""); setMarket("All markets"); clearFilters(); }}>Clear all filters</button></section>}
      </div>
      <MarketplaceFilterDrawer open={filtersOpen} resultCount={page?.total || 0} category={category} condition={condition} deliveryMethod={deliveryMethod} minimumPrice={minimumPrice} maximumPrice={maximumPrice} featuredOnly={featuredOnly} categoryOptions={options(categories)} conditionOptions={options(conditions)} deliveryOptions={options(deliveryMethods)} onCategoryChange={changeFilter(setCategory)} onConditionChange={changeFilter(setCondition)} onDeliveryChange={changeFilter(setDeliveryMethod)} onMinimumPriceChange={changeFilter(setMinimumPrice)} onMaximumPriceChange={changeFilter(setMaximumPrice)} onFeaturedChange={(value) => { setFeaturedOnly(value); setPageNumber(1); }} onClear={clearFilters} onClose={() => setFiltersOpen(false)} />
    </div>
  );
}
