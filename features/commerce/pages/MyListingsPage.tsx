"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Arrow } from "../../../components/ui/Arrow";
import DashboardIcon from "../../dashboard/components/DashboardIcon";
import DashboardPageHeader from "../../dashboard/components/DashboardPageHeader";
import { userDraftsStorageKey, type UserDraft } from "../../dashboard/data/drafts";

const statuses = ["All listings", "Draft", "Pending review", "Active", "Sold"] as const;

export default function MyListingsPage() {
  const [status, setStatus] = useState<(typeof statuses)[number]>("All listings");
  const [drafts, setDrafts] = useState<UserDraft[]>([]);

  useEffect(() => {
    const saved = window.localStorage.getItem(userDraftsStorageKey);
    if (!saved) return;
    try { setDrafts((JSON.parse(saved) as UserDraft[]).filter((draft) => draft.type === "listing")); } catch { setDrafts([]); }
  }, []);

  const isDraftView = status === "Draft";
  return <div className="mx-auto max-w-[1180px] space-y-6 p-5 sm:p-8"><DashboardPageHeader kicker="MY LISTINGS" title="Manage what you have listed." description="Review your drafts, listings under review, active items and sold history from one workspace." action={<div className="flex flex-wrap gap-3"><Link className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#dfe4ed] px-4 text-xs font-extrabold text-[#1453bb]" href="/dashboard/marketplace">Browse marketplace <Arrow /></Link><Link className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#1453bb] px-4 text-xs font-extrabold text-white" href="/dashboard/listings/new">List an item <Arrow /></Link></div>} /><section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[["DRAFTS", String(drafts.length), "Continue before submitting", "box"], ["PENDING REVIEW", "0", "Awaiting Admin review", "clock"], ["ACTIVE", "0", "Published listings", "store"], ["SOLD", "0", "Completed sales", "shield"]].map(([label, value, note, icon]) => <article className="flex items-start gap-3 rounded-xl border border-[#dfe4ed] bg-white p-4 shadow-sm" key={label}><span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#edf4ff] text-[#1453bb] [&>svg]:h-4 [&>svg]:w-4"><DashboardIcon name={icon} /></span><div><small className="block text-[9px] font-extrabold tracking-[.12em] text-[#8b97a9]">{label}</small><strong className="mt-1 block font-[Manrope] text-xl font-extrabold text-[#0b1830]">{value}</strong><span className="mt-1 block text-[10px] text-[#8490a4]">{note}</span></div></article>)}</section><section className="rounded-xl border border-[#dfe4ed] bg-white p-5 shadow-sm"><div className="flex flex-wrap gap-2" role="tablist" aria-label="Listing status">{statuses.map((item) => <button className={`rounded-lg px-3 py-2 text-[10px] font-extrabold ${status === item ? "bg-[#edf4ff] text-[#1453bb]" : "text-[#8490a4] hover:bg-[#f8fafc]"}`} type="button" role="tab" aria-selected={status === item} onClick={() => setStatus(item)} key={item}>{item}</button>)}</div><div className="mt-5 grid place-items-center rounded-xl border border-dashed border-[#cbd5e1] bg-[#f8fafc] px-5 py-14 text-center"><span className="grid h-12 w-12 place-items-center rounded-full bg-white text-[#1453bb] shadow-sm [&>svg]:h-5 [&>svg]:w-5"><DashboardIcon name={isDraftView && drafts.length ? "box" : "store"} /></span><h3 className="mt-4 font-[Manrope] text-lg font-extrabold text-[#0b1830]">{isDraftView && drafts.length ? `${drafts.length} listing draft${drafts.length === 1 ? "" : "s"} saved` : `No ${status.toLowerCase()} yet`}</h3><p className="mt-2 max-w-md text-xs leading-5 text-[#8490a4]">{isDraftView && drafts.length ? "Draft metadata is saved locally for this UI preview. The listing service will persist full details when the API is connected." : "When you create activity in this workspace, its tracking code and current status will appear here."}</p><Link className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-[#1453bb] px-4 text-xs font-extrabold text-white" href="/dashboard/listings/new">Create listing <Arrow /></Link></div></section></div>;
}
