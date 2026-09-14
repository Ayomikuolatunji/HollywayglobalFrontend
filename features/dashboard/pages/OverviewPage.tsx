"use client";

import Link from "next/link";
import { Arrow } from "../../../components/ui/Arrow";
import DashboardIcon from "../components/DashboardIcon";
import KycStatusSummary from "../components/KycStatusSummary";
import { useDashboard } from "../components/DashboardShell";

const stats = [
  ["ACTIVE LISTINGS", "0", "No listings yet", "box", "/dashboard/listings?status=Active", "border-t-[#14213d]"],
  ["OPEN REQUESTS", "0", "Nothing to track", "search", "/dashboard/requests?status=Active", "border-t-[#dd6b12]"],
  ["ORDERS", "0", "No active orders", "shield", "/dashboard/orders", "border-t-[#1f7a5c]"],
] as const;

const services = [
  ["Professional services", "Verified help for repairs and specialist work.", "tool", "/dashboard/services"],
  ["Events", "Planning, vendors and event coordination.", "tool", "/dashboard/events"],
  ["Deliveries", "Dispatch, waybill and transit support.", "truck", "/dashboard/logistics"],
  ["Relocations", "Moves, crews, vehicles and storage.", "truck", "/dashboard/relocation"],
  ["Escrow", "Protected transactions and release steps.", "shield", "/dashboard/escrow"],
  ["Referrals", "Invite new customers with your HWP link.", "users", "/dashboard/referrals"],
  ["Reseller", "Prepare customer orders and markups.", "store", "/dashboard/reseller"],
  ["Ads & promotions", "Promote listings, stock and business offers.", "grid", "/dashboard/advertising"],
  ["Wallet & payouts", "Settlement balances and payout activity.", "wallet", "/dashboard/wallet"],
] as const;

const quickActions = [
  ["Sell an item", "Create a listing", "box", "/dashboard/listings/new"],
  ["Request an item", "Tell Hollyway what you need", "search", "/dashboard/requests/new"],
  ["Start escrow", "Protect a transaction", "shield", "/dashboard/escrow/new"],
  ["Arrange delivery", "Move an item safely", "truck", "/dashboard/logistics/new"],
] as const;

export default function OverviewPage() {
  const { accountName } = useDashboard();

  return (
    <div className="w-full space-y-4 px-4 pb-16 pt-1 sm:px-6 lg:px-8">
      <section className="grid overflow-hidden rounded-[14px] border border-[#e4e2da] bg-white shadow-[0_1px_2px_rgba(18,20,28,.04)] lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="p-5 sm:p-6"><span className="text-[10px] font-bold uppercase tracking-[.12em] text-[#b8560d]">Welcome back, {accountName}</span><h2 className="mt-2 max-w-xl font-[Manrope] text-2xl font-semibold tracking-[-.04em] text-[#12141c]">What would you like Hollyway to help you complete today?</h2><p className="mt-2 max-w-2xl text-xs leading-5 text-[#5c5f6b]">Sell an item, find something you need, arrange a service or manage an active transaction from one workspace.</p></div>
        <div className="flex items-center gap-2 border-t border-[#e4e2da] bg-[#f8f7f3] p-5 lg:border-l lg:border-t-0"><Link className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#dd6b12] px-4 text-xs font-bold text-white hover:bg-[#b8560d]" href="/dashboard/listings/new">List an item <Arrow /></Link><Link className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#d8d5ca] bg-white px-4 text-xs font-bold text-[#14213d] hover:border-[#14213d]" href="/dashboard/requests/new">Make a request</Link></div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Account summary">
        {stats.map(([label, value, note, icon, href, accent]) => <Link className={`flex items-center gap-3 rounded-xl border border-t-[3px] border-[#e4e2da] bg-white p-3.5 shadow-[0_1px_2px_rgba(18,20,28,.03)] transition hover:-translate-y-0.5 hover:shadow-md ${accent}`} href={href} key={label}><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#edeff5] text-[#14213d] [&>svg]:h-4 [&>svg]:w-4"><DashboardIcon name={icon} /></span><span className="min-w-0 flex-1"><small className="block text-[9px] font-bold tracking-[.1em] text-[#9498a3]">{label}</small><span className="mt-0.5 flex items-baseline gap-2"><strong className="font-[Manrope] text-lg font-bold text-[#12141c]">{value}</strong><span className="truncate text-[10px] text-[#5c5f6b]">{note}</span></span></span><Arrow /></Link>)}
        <KycStatusSummary compact overviewStyle />
      </section>

      <section className="rounded-[14px] border border-[#e4e2da] bg-white p-4 shadow-[0_1px_2px_rgba(18,20,28,.03)] sm:p-5">
        <div className="flex items-end justify-between gap-4"><div><span className="text-[9px] font-bold uppercase tracking-[.12em] text-[#9498a3]">SERVICES</span><h3 className="mt-1 font-[Manrope] text-lg font-semibold text-[#12141c]">Hollyway services</h3><p className="mt-1 text-xs text-[#5c5f6b]">Open any service pathway directly from your workspace.</p></div><span className="hidden text-[10px] text-[#9498a3] sm:block">Scroll to explore</span></div>
        <div className="mt-4 flex snap-x snap-mandatory gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Hollyway service pathways">{services.map(([title, description, icon, href]) => <Link className="group flex w-[205px] min-w-[205px] snap-start items-start gap-3 rounded-xl border border-[#e4e2da] bg-[#f8f7f3] p-3 transition hover:border-[#14213d] hover:bg-white" href={href} key={title}><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white text-[#14213d] shadow-sm [&>svg]:h-4 [&>svg]:w-4"><DashboardIcon name={icon} /></span><span className="min-w-0"><strong className="block text-xs font-semibold text-[#12141c]">{title}</strong><span className="mt-1 line-clamp-2 block text-[10px] leading-4 text-[#5c5f6b]">{description}</span></span></Link>)}</div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,.65fr)]">
        <article className="rounded-[14px] border border-[#e4e2da] bg-white p-4 shadow-[0_1px_2px_rgba(18,20,28,.03)] sm:p-5"><div><span className="text-[9px] font-bold uppercase tracking-[.12em] text-[#9498a3]">YOUR ACTIVITY</span><h3 className="mt-1 font-[Manrope] text-lg font-semibold text-[#12141c]">Recent activity</h3></div><div className="mt-4 flex min-h-28 items-center gap-4 rounded-xl border border-dashed border-[#d8d5ca] bg-[#f8f7f3] p-4"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-[#14213d] shadow-sm [&>svg]:h-4 [&>svg]:w-4"><DashboardIcon name="grid" /></span><div className="min-w-0 flex-1"><strong className="block text-xs font-semibold text-[#12141c]">No activity yet</strong><p className="mt-1 text-[10px] leading-4 text-[#5c5f6b]">Listings, requests, orders and service updates will appear here.</p></div><Link className="shrink-0 text-[10px] font-bold text-[#b8560d] hover:underline" href="/dashboard/listings/new">Get started</Link></div></article>
        <article className="rounded-[14px] border border-[#e4e2da] bg-white p-4 shadow-[0_1px_2px_rgba(18,20,28,.03)] sm:p-5"><span className="text-[9px] font-bold uppercase tracking-[.12em] text-[#9498a3]">QUICK ACTIONS</span><h3 className="mt-1 font-[Manrope] text-lg font-semibold text-[#12141c]">Start something</h3><div className="mt-3 grid grid-cols-2 gap-2">{quickActions.map(([title, text, icon, href]) => <Link className="group rounded-lg border border-[#e4e2da] p-2.5 hover:border-[#14213d]" href={href} key={title}><span className="flex items-center gap-2"><span className="h-4 w-4 text-[#b8560d] [&>svg]:h-full [&>svg]:w-full"><DashboardIcon name={icon} /></span><strong className="text-[10px] font-semibold text-[#12141c]">{title}</strong></span><small className="mt-1.5 block text-[9px] leading-4 text-[#9498a3]">{text}</small></Link>)}</div></article>
      </section>

      <section className="flex flex-col gap-3 rounded-xl border border-[#d7e2dc] bg-[#e4f2ec] px-4 py-3 sm:flex-row sm:items-center"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-[#1f7a5c] [&>svg]:h-4 [&>svg]:w-4"><DashboardIcon name="shield" /></span><div className="min-w-0 flex-1"><strong className="block text-xs font-semibold text-[#174f3d]">Use Hollyway references for every transaction.</strong><p className="mt-0.5 text-[10px] leading-4 text-[#376957]">Wait for official confirmation before paying, releasing an item or completing delivery.</p></div><Link className="shrink-0 text-[10px] font-bold text-[#1f7a5c] hover:underline" href="/dashboard/escrow">Open escrow</Link></section>
    </div>
  );
}
