"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Arrow } from "../../../components/ui/Arrow";
import CommerceIcon from "../components/CommerceIcon";
import ListingCard from "../components/ListingCard";
import { categories, conditions, listings } from "../data";

function matchesPrice(price: number, filter: string) {
  if (filter === "Under ₦200,000") return price < 200000;
  if (filter === "₦200,000–₦1,000,000") return price >= 200000 && price <= 1000000;
  if (filter === "Over ₦1,000,000") return price > 1000000;
  return true;
}

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All categories");
  const [condition, setCondition] = useState("All conditions");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("All prices");
  const [sort, setSort] = useState("Newest first");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);

  const visibleListings = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const filtered = listings.filter((listing) => {
      const searchable = `${listing.name} ${listing.category} ${listing.code}`.toLowerCase();
      return (!normalizedSearch || searchable.includes(normalizedSearch)) &&
        (category === "All categories" || listing.category === category) &&
        (condition === "All conditions" || listing.condition === condition) &&
        (!location || listing.location.toLowerCase().includes(location.toLowerCase())) &&
        matchesPrice(listing.price, price) && (!featuredOnly || listing.featured);
    });

    return [...filtered].sort((a, b) => {
      if (sort === "Price low-to-high") return a.price - b.price;
      if (sort === "Price high-to-low") return b.price - a.price;
      if (sort === "Most viewed") return b.views - a.views;
      return b.code.localeCompare(a.code);
    });
  }, [category, condition, featuredOnly, location, price, search, sort]);

  useEffect(() => {
    setVisibleCount(12);
  }, [category, condition, featuredOnly, location, price, search, sort]);

  const displayedListings = visibleListings.slice(0, visibleCount);
  const hasMoreListings = displayedListings.length < visibleListings.length;

  function clearFilters() {
    setSearch("");
    setCategory("All categories");
    setCondition("All conditions");
    setLocation("");
    setPrice("All prices");
    setFeaturedOnly(false);
  }

  return (
    <div className="w-full space-y-6 p-5 sm:p-8">
      <section className="flex flex-col justify-between gap-5 rounded-2xl bg-gradient-to-br from-[#061936] to-[#1453bb] p-7 text-white shadow-xl shadow-[#061936]/15 sm:p-9 lg:flex-row lg:items-end">
        <div>
          <span className="text-[10px] font-extrabold tracking-[.18em] text-[#ffb11b]">HOLLYWAY MARKETPLACE</span>
          <h2 className="mt-3 font-[Manrope] text-3xl font-extrabold tracking-[-.06em] sm:text-4xl">Find something <em className="not-italic text-[#ffb11b]">worth keeping.</em></h2>
          <p className="mt-3 text-sm text-[#c5d2e6]">Browse verified listings from sellers, importers and businesses across Nigeria.</p>
        </div>
        <Link className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#ff8a00] px-4 text-xs font-extrabold text-[#17223a]" href="/dashboard/listings/new">List an item <Arrow /></Link>
      </section>

      <section className="rounded-xl border border-[#dfe4ed] bg-white p-5 shadow-sm" aria-label="Marketplace search and filters">
        <label className="flex h-12 items-center gap-3 rounded-lg border border-[#dfe4ed] bg-[#f8fafc] px-3 text-[#71809a]">
          <CommerceIcon name="search" />
          <span className="sr-only">Search listings</span>
          <input className="min-w-0 flex-1 bg-transparent text-xs text-[#0b1830] outline-none placeholder:text-[#8995a8]" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search items, brands or listing codes" />
        </label>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="grid gap-1.5 text-[10px] font-extrabold text-[#596983]">Category<select className="h-10 rounded-lg border border-[#dfe4ed] bg-white px-2 text-xs font-medium text-[#0b1830] outline-none focus:border-[#1453bb]" value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((option) => <option key={option}>{option}</option>)}</select></label>
          <label className="grid gap-1.5 text-[10px] font-extrabold text-[#596983]">Condition<select className="h-10 rounded-lg border border-[#dfe4ed] bg-white px-2 text-xs font-medium text-[#0b1830] outline-none focus:border-[#1453bb]" value={condition} onChange={(event) => setCondition(event.target.value)}>{conditions.map((option) => <option key={option}>{option}</option>)}</select></label>
          <label className="grid gap-1.5 text-[10px] font-extrabold text-[#596983]">Price<select className="h-10 rounded-lg border border-[#dfe4ed] bg-white px-2 text-xs font-medium text-[#0b1830] outline-none focus:border-[#1453bb]" value={price} onChange={(event) => setPrice(event.target.value)}>{["All prices", "Under ₦200,000", "₦200,000–₦1,000,000", "Over ₦1,000,000"].map((option) => <option key={option}>{option}</option>)}</select></label>
          <label className="grid gap-1.5 text-[10px] font-extrabold text-[#596983]">Location<input className="h-10 rounded-lg border border-[#dfe4ed] bg-white px-2 text-xs font-medium text-[#0b1830] outline-none focus:border-[#1453bb]" value={location} onChange={(event) => setLocation(event.target.value)} placeholder="State or city" /></label>
        </div>
        <label className="mt-4 inline-flex items-center gap-2 text-[10px] font-extrabold text-[#596983]"><input className="accent-[#ff8a00]" type="checkbox" checked={featuredOnly} onChange={(event) => setFeaturedOnly(event.target.checked)} />Featured listings only</label>
      </section>

      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><span className="text-[10px] font-extrabold tracking-[.18em] text-[#8995a8]">LISTINGS</span><h3 className="mt-2 font-[Manrope] text-xl font-extrabold tracking-[-.04em] text-[#0b1830]">{visibleListings.length} items ready to explore</h3></div>
        <label className="flex items-center gap-2 text-[10px] font-extrabold text-[#596983]">Sort by<select className="h-9 rounded-lg border border-[#dfe4ed] bg-white px-2 text-xs text-[#0b1830]" value={sort} onChange={(event) => setSort(event.target.value)}><option>Newest first</option><option>Price low-to-high</option><option>Price high-to-low</option><option>Most viewed</option></select></label>
      </section>

      {visibleListings.length ? <><section className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr))]" aria-label="Marketplace listings">{displayedListings.map((listing) => <ListingCard listing={listing} detailsHref={`/dashboard/marketplace/${listing.code}`} key={listing.code} />)}</section>{hasMoreListings && <div className="flex justify-center pt-2"><button className="h-11 rounded-lg border border-[#1453bb] bg-white px-5 text-xs font-extrabold text-[#1453bb] hover:bg-[#edf4ff]" type="button" onClick={() => setVisibleCount((count) => count + 12)}>Load more listings</button></div>}</> : <section className="rounded-xl border border-[#dfe4ed] bg-white p-12 text-center"><CommerceIcon name="search" className="mx-auto h-6 w-6" /><h3 className="mt-4 font-[Manrope] text-lg font-extrabold text-[#0b1830]">No listings match these filters.</h3><p className="mt-2 text-xs text-[#687895]">Try a different search, category or location.</p><button className="mt-5 h-10 rounded-lg bg-[#ff8a00] px-4 text-xs font-extrabold text-[#17223a]" type="button" onClick={clearFilters}>Clear filters</button></section>}
    </div>
  );
}
