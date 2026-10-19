"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ApiResponseError } from "../../../components/api/apiResponse";
import { Arrow } from "../../../components/ui/Arrow";
import PaginationControls from "../../../components/ui/PaginationControls";
import DashboardEmptyState from "../../dashboard/components/DashboardEmptyState";
import DashboardPageHeader from "../../dashboard/components/DashboardPageHeader";
import DashboardStatusTabs from "../../dashboard/components/DashboardStatusTabs";
import { fetchListings, formatListingMoney, type Listing, type ListingPage } from "../data/listingApi";

const statuses = ["All listings", "Draft", "Pending review", "Published", "Sold"] as const;
const statusQuery: Record<(typeof statuses)[number], string | undefined> = {
  "All listings": undefined, Draft: "draft", "Pending review": "pending_review", Published: "published", Sold: "sold",
};

export default function MyListingsPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<(typeof statuses)[number]>("All listings");
  const [page, setPage] = useState<ListingPage | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const requestedValue = searchParams.get("status");
    const requested = requestedValue === "Active" ? "Published" : requestedValue as (typeof statuses)[number] | null;
    if (requested && statuses.includes(requested)) setStatus(requested);
  }, [searchParams]);

  useEffect(() => {
    let active = true;
    setLoading(true); setError("");
    Promise.all([
      fetchListings(pageNumber, 25, statusQuery[status]),
      ...statuses.slice(1).map((item) => fetchListings(1, 1, statusQuery[item])),
    ]).then(([current, ...summary]) => {
      if (!active) return;
      setPage(current);
      setCounts(Object.fromEntries([["All listings", current.total], ...statuses.slice(1).map((item, index) => [item, (summary[index] as ListingPage).total])]));
    }).catch((reason) => {
      if (!active) return;
      setError(reason instanceof ApiResponseError ? reason.message : "Your listings could not be loaded.");
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [pageNumber, status]);

  function choose(next: string) { setStatus(next as (typeof statuses)[number]); setPageNumber(1); }

  return <div className="w-full space-y-4 p-4 sm:p-6"><DashboardPageHeader compact kicker="MY LISTINGS" title="Manage what you have listed." description="Review private drafts, listings under review, published items and sold history from one workspace." action={<div className="flex flex-wrap gap-3"><Link className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#dfe4ed] px-3 text-xs font-extrabold text-[#1453bb]" href="/dashboard/marketplace">Browse marketplace <Arrow /></Link><Link className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1453bb] px-3 text-xs font-extrabold text-white" href="/dashboard/listings/new">List an item <Arrow /></Link></div>} /><section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[["DRAFTS", counts.Draft ?? 0, "Continue before submitting"], ["PENDING REVIEW", counts["Pending review"] ?? 0, "Awaiting Hollyway review"], ["PUBLISHED", counts.Published ?? 0, "Visible in the marketplace"], ["SOLD", counts.Sold ?? 0, "Completed sales"]].map(([label, value, note]) => <article className="rounded-lg border border-[#dfe4ed] bg-white p-4" key={String(label)}><p className="text-[9px] font-extrabold tracking-[.14em] text-[#8995a8]">{label}</p><strong className="mt-2 block font-[Manrope] text-2xl font-extrabold text-[#0b1830]">{value}</strong><p className="mt-1 text-[10px] text-[#7d899d]">{note}</p></article>)}</section><section className="rounded-lg border border-[#dfe4ed] bg-white p-4"><DashboardStatusTabs compact items={statuses} active={status} onChange={choose} ariaLabel="Listing status" />{error && <p className="mt-4 rounded-lg border border-[#f3c4c4] bg-[#fff5f5] px-3 py-2 text-xs font-semibold text-[#a32929]" role="alert">{error}</p>}{loading ? <p className="py-12 text-center text-xs font-semibold text-[#7d899d]">Loading your listings…</p> : page?.items.length ? <div className="mt-4 divide-y divide-[#eef1f4]">{page.items.map((listing) => <ListingRow key={listing.reference} listing={listing} />)}</div> : <div className="mt-4"><DashboardEmptyState icon={status === "Draft" ? "box" : "store"} title={`No ${status.toLowerCase()} yet`} description="When you create a listing, its server-generated code and current status will appear here." actionHref="/dashboard/listings/new" actionLabel="Create listing" compact /></div>}{page && <PaginationControls page={page.page} totalPages={page.total_pages} hasPrevious={page.has_previous} hasNext={page.has_next} onPageChange={setPageNumber} />}</section></div>;
}

function ListingRow({ listing }: { listing: Listing }) {
  const editable = listing.status === "draft" || listing.status === "rejected";
  return <article className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="text-[10px] font-extrabold tracking-[.12em] text-[#1453bb]">{listing.reference}</span><span className="rounded-full bg-[#f4f8ff] px-2 py-1 text-[9px] font-extrabold text-[#1453bb]">{listing.status_label}</span></div><h2 className="mt-1 truncate text-sm font-extrabold text-[#0b1830]">{listing.item_name || "Untitled listing"}</h2><p className="mt-1 text-[10px] text-[#7d899d]">{listing.category || "Category not selected"} · {[listing.area, listing.city, listing.state].filter(Boolean).join(", ") || "Location not provided"}</p></div><div className="flex items-center justify-between gap-4 sm:justify-end"><strong className="text-sm font-extrabold text-[#0b1830]">{formatListingMoney(listing.unit_price_minor)}</strong>{editable && <Link className="inline-flex h-9 items-center gap-1 rounded-lg bg-[#1453bb] px-3 text-[10px] font-extrabold text-white" href={`/dashboard/listings/new?reference=${encodeURIComponent(listing.reference)}`}>Continue <Arrow /></Link>}<Link className="inline-flex h-9 items-center gap-1 rounded-lg border border-[#cbd5e1] px-3 text-[10px] font-extrabold text-[#1453bb]" href={`/dashboard/listings/${encodeURIComponent(listing.reference)}`}>View <Arrow /></Link></div></article>;
}
