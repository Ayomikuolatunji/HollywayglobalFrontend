"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ApiResponseError } from "../../../components/api/apiResponse";
import { Arrow } from "../../../components/ui/Arrow";
import DashboardEmptyState from "../../dashboard/components/DashboardEmptyState";
import DashboardPageHeader from "../../dashboard/components/DashboardPageHeader";
import { useDashboard } from "../../dashboard/components/DashboardShell";
import type { Listing } from "../data";
import { fetchAllSavedListings } from "../data/savedListingsApi";

export default function SavedListingsPage() {
  const { toggleSavedListing } = useDashboard();
  const [items, setItems] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetchAllSavedListings().then((next) => { if (active) setItems(next); }).catch((reason) => { if (active) setError(reason instanceof ApiResponseError ? reason.message : "Saved listings could not be loaded."); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  async function remove(code: string) {
    await toggleSavedListing(code);
    setItems((current) => current.filter((item) => item.code !== code));
  }

  return <div className="w-full space-y-4 p-4 sm:p-6"><DashboardPageHeader compact kicker="COMMERCE" title="Saved listings" description="Keep marketplace items you want to review or order later." action={<Link className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#1453bb] px-3 text-[10px] font-extrabold text-white" href="/dashboard/marketplace">Browse marketplace <Arrow /></Link>} />{error && <p className="rounded-lg border border-[#f3c4c4] bg-[#fff5f5] p-3 text-xs font-semibold text-[#a32929]">{error}</p>}{loading ? <div className="rounded-lg border border-[#dfe4ed] bg-white p-10 text-center text-xs font-semibold text-[#687895]">Loading saved listings…</div> : items.length ? <section className="divide-y divide-[#eef1f4] rounded-lg border border-[#dfe4ed] bg-white px-4 sm:px-5">{items.map((item) => <article className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between" key={item.code}><div className="min-w-0"><span className="text-[9px] font-extrabold uppercase tracking-[.12em] text-[#1453bb]">{item.market || "Marketplace"}</span><h2 className="mt-1 truncate text-sm font-extrabold text-[#0b1830]">{item.name}</h2><p className="mt-1 text-[10px] text-[#687895]">{item.code} · {item.location} · {item.condition}</p></div><div className="flex items-center gap-2"><strong className="text-sm font-extrabold text-[#0b1830]">₦{item.price.toLocaleString("en-NG")}</strong><Link className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#dfe4ed] px-3 text-[10px] font-extrabold text-[#1453bb]" href={`/dashboard/marketplace/${encodeURIComponent(item.code)}`}>View <Arrow /></Link><button className="h-8 rounded-lg border border-[#f1c8c3] px-3 text-[10px] font-extrabold text-[#a32929]" type="button" onClick={() => void remove(item.code)}>Remove</button></div></article>)}</section> : <DashboardEmptyState icon="heart" title="No saved listings yet" description="Use the heart button on a marketplace listing to keep it here." actionHref="/dashboard/marketplace" actionLabel="Browse marketplace" compact />}</div>;
}
