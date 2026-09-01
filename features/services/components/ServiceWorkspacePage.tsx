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

export default function ServiceWorkspacePage({ kicker, title, description, actionHref, actionLabel, secondaryHref, secondaryLabel, tabs, summaries, emptyDescription, emptyIcon = "truck", compact = false }: { kicker: string; title: string; description: string; actionHref: string; actionLabel: string; secondaryHref?: string; secondaryLabel?: string; tabs: readonly string[]; summaries: readonly Summary[]; emptyDescription: string; emptyIcon?: string; compact?: boolean }) {
  const [tab, setTab] = useState(tabs[0]);
  const actions = <div className="flex flex-wrap gap-2"><Link className={`inline-flex ${compact ? "h-9 px-3" : "h-11 px-4"} items-center gap-2 rounded-lg bg-[#1453bb] text-xs font-extrabold text-white`} href={actionHref}>{actionLabel} <Arrow /></Link>{secondaryHref && <Link className={`inline-flex ${compact ? "h-9 px-3" : "h-11 px-4"} items-center gap-2 rounded-lg border border-[#dfe4ed] text-xs font-extrabold text-[#1453bb]`} href={secondaryHref}>{secondaryLabel} <Arrow /></Link>}</div>;
  return <div className={`mx-auto max-w-[1180px] ${compact ? "space-y-3 p-3 sm:p-5" : "space-y-7 p-5 sm:p-8"}`}><DashboardPageHeader compact={compact} kicker={kicker} title={title} description={description} action={actions} /><section className={`grid gap-2 sm:grid-cols-2 ${summaries.length > 3 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>{summaries.map((summary) => <DashboardSummaryCard compact={compact} key={summary.label} label={summary.label} value={summary.value} note={summary.note} icon={summary.icon} onClick={() => setTab(summaryTab(summary.label, tabs))} />)}</section><section className={`rounded-lg border border-[#dfe4ed] bg-white ${compact ? "p-3" : "p-5"}`}><div className={`flex ${compact ? "gap-4" : "gap-6"} overflow-x-auto border-b border-[#eef1f4]`} role="tablist" aria-label={`${kicker.toLowerCase()} filters`}>{tabs.map((item) => <button className={`relative shrink-0 ${compact ? "py-1.5 text-[10px]" : "py-3 text-xs"} font-bold ${tab === item ? "text-[#1453bb] after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-[#1453bb]" : "text-[#8490a4] hover:text-[#31425e]"}`} type="button" role="tab" aria-selected={tab === item} onClick={() => setTab(item)} key={item}>{item}</button>)}</div><div className={`flex flex-col items-start ${compact ? "mt-3 gap-2 py-5" : "mt-5 gap-4 py-12"} border-t border-[#eef1f4] px-1 sm:flex-row sm:items-center`}><span className={`grid ${compact ? "h-8 w-8" : "h-11 w-11"} shrink-0 place-items-center rounded-md bg-[#edf4ff] text-[#1453bb] [&>svg]:h-5 [&>svg]:w-5`}><DashboardIcon name={emptyIcon} /></span><div className="min-w-0 flex-1"><h3 className={`font-[Manrope] ${compact ? "text-sm" : "text-lg"} font-extrabold text-[#0b1830]`}>No {tab.toLowerCase()} yet</h3><p className="mt-1 max-w-xl text-xs leading-5 text-[#8490a4]">{emptyDescription}</p></div><Link className={`inline-flex ${compact ? "h-8 px-3" : "h-10 px-4"} shrink-0 items-center gap-2 rounded-lg bg-[#1453bb] text-xs font-extrabold text-white`} href={actionHref}>{actionLabel} <Arrow /></Link></div></section></div>;
}
