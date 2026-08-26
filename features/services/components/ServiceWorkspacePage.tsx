"use client";

import Link from "next/link";
import { useState } from "react";
import { Arrow } from "../../../components/ui/Arrow";
import DashboardIcon from "../../dashboard/components/DashboardIcon";
import DashboardPageHeader from "../../dashboard/components/DashboardPageHeader";
import DashboardSummaryCard from "../../dashboard/components/DashboardSummaryCard";

type Summary = { label: string; value: string; note: string; icon: string };

function summaryTab(label: string, tabs: readonly string[]) {
  const normalizedLabel = label.toLowerCase();
  return tabs.find((tab) => {
    const normalizedTab = tab.toLowerCase();
    return normalizedTab === normalizedLabel || normalizedTab === normalizedLabel.replace(/s$/, "") || normalizedLabel.startsWith(normalizedTab);
  }) || tabs[0];
}

export default function ServiceWorkspacePage({ kicker, title, description, actionHref, actionLabel, secondaryHref, secondaryLabel, tabs, summaries, emptyDescription, emptyIcon = "truck" }: { kicker: string; title: string; description: string; actionHref: string; actionLabel: string; secondaryHref?: string; secondaryLabel?: string; tabs: readonly string[]; summaries: readonly Summary[]; emptyDescription: string; emptyIcon?: string }) {
  const [tab, setTab] = useState(tabs[0]);
  const actions = <div className="flex flex-wrap gap-3"><Link className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#1453bb] px-4 text-xs font-extrabold text-white" href={actionHref}>{actionLabel} <Arrow /></Link>{secondaryHref && <Link className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#dfe4ed] px-4 text-xs font-extrabold text-[#1453bb]" href={secondaryHref}>{secondaryLabel} <Arrow /></Link>}</div>;
  return <div className="mx-auto max-w-[1180px] space-y-6 p-5 sm:p-8"><DashboardPageHeader kicker={kicker} title={title} description={description} action={actions} /><section className={`grid gap-3 sm:grid-cols-2 ${summaries.length > 3 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>{summaries.map((summary) => <DashboardSummaryCard key={summary.label} label={summary.label} value={summary.value} note={summary.note} icon={summary.icon} onClick={() => setTab(summaryTab(summary.label, tabs))} />)}</section><section className="rounded-xl border border-[#dfe4ed] bg-white p-5 shadow-sm"><div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label={`${kicker.toLowerCase()} filters`}>{tabs.map((item) => <button className={`shrink-0 rounded-lg px-3 py-2 text-[10px] font-extrabold ${tab === item ? "bg-[#edf4ff] text-[#1453bb]" : "text-[#8490a4] hover:bg-[#f8fafc]"}`} type="button" role="tab" aria-selected={tab === item} onClick={() => setTab(item)} key={item}>{item}</button>)}</div><div className="mt-5 grid place-items-center rounded-xl border border-dashed border-[#cbd5e1] bg-[#f8fafc] px-5 py-14 text-center"><span className="grid h-12 w-12 place-items-center rounded-full bg-white text-[#1453bb] shadow-sm [&>svg]:h-5 [&>svg]:w-5"><DashboardIcon name={emptyIcon} /></span><h3 className="mt-4 font-[Manrope] text-lg font-extrabold text-[#0b1830]">No {tab.toLowerCase()} yet</h3><p className="mt-2 max-w-md text-xs leading-5 text-[#8490a4]">{emptyDescription}</p><Link className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-[#1453bb] px-4 text-xs font-extrabold text-white" href={actionHref}>{actionLabel} <Arrow /></Link></div></section></div>;
}
