"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Arrow } from "../../../components/ui/Arrow";
import DashboardEmptyState from "../../dashboard/components/DashboardEmptyState";
import DashboardPageHeader from "../../dashboard/components/DashboardPageHeader";
import DashboardSummaryCard from "../../dashboard/components/DashboardSummaryCard";
import DashboardStatusTabs from "../../dashboard/components/DashboardStatusTabs";
import { userDraftsStorageKey, type UserDraft } from "../../dashboard/data/drafts";
import { useSearchParams } from "next/navigation";

const statuses = ["All listings", "Draft", "Pending review", "Active", "Sold"] as const;

export default function MyListingsPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<(typeof statuses)[number]>("All listings");
  const [drafts, setDrafts] = useState<UserDraft[]>([]);

  useEffect(() => {
    const requestedStatus = searchParams.get("status") as (typeof statuses)[number] | null;
    if (requestedStatus && statuses.includes(requestedStatus)) setStatus(requestedStatus);
  }, [searchParams]);

  useEffect(() => {
    const saved = window.localStorage.getItem(userDraftsStorageKey);
    if (!saved) return;
    try { setDrafts((JSON.parse(saved) as UserDraft[]).filter((draft) => draft.type === "listing")); } catch { setDrafts([]); }
  }, []);

  const isDraftView = status === "Draft";
  return <div className="mx-auto max-w-[1180px] space-y-4 p-4 sm:p-6"><DashboardPageHeader compact kicker="MY LISTINGS" title="Manage what you have listed." description="Review your drafts, listings under review, active items and sold history from one workspace." action={<div className="flex flex-wrap gap-3"><Link className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#dfe4ed] px-3 text-xs font-extrabold text-[#1453bb]" href="/dashboard/marketplace">Browse marketplace <Arrow /></Link><Link className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1453bb] px-3 text-xs font-extrabold text-white" href="/dashboard/listings/new">List an item <Arrow /></Link></div>} /><section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[["DRAFTS", String(drafts.length), "Continue before submitting", "box", "/dashboard/listings?status=Draft"], ["PENDING REVIEW", "0", "Awaiting Admin review", "clock", "/dashboard/listings?status=Pending%20review"], ["ACTIVE", "0", "Published listings", "store", "/dashboard/listings?status=Active"], ["SOLD", "0", "Completed sales", "shield", "/dashboard/listings?status=Sold"]].map(([label, value, note, icon, href]) => <DashboardSummaryCard key={label} label={label} value={value} note={note} icon={icon} href={href} compact />)}</section><section className="rounded-lg border border-[#dfe4ed] bg-white p-4"><DashboardStatusTabs compact items={statuses} active={status} onChange={(value) => setStatus(value as (typeof statuses)[number])} ariaLabel="Listing status" /><DashboardEmptyState icon={isDraftView && drafts.length ? "box" : "store"} title={isDraftView && drafts.length ? `${drafts.length} listing draft${drafts.length === 1 ? "" : "s"} saved` : `No ${status.toLowerCase()} yet`} description={isDraftView && drafts.length ? "Draft metadata is saved locally for this UI preview. The listing service will persist full details when the API is connected." : "When you create activity in this workspace, its tracking code and current status will appear here."} actionHref="/dashboard/listings/new" actionLabel="Create listing" compact /></section></div>;
}
