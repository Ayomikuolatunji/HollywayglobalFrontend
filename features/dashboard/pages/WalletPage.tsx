"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Arrow } from "../../../components/ui/Arrow";
import DashboardIcon from "../components/DashboardIcon";
import WalletFundingPanel from "../components/WalletFundingPanel";
import { readWalletFundingRequests, type WalletFundingRequest } from "../data/wallet";

export default function WalletPage() {
  const [fundingRequests, setFundingRequests] = useState<WalletFundingRequest[]>([]);
  useEffect(() => { setFundingRequests(readWalletFundingRequests()); }, []);
  const pendingTotal = useMemo(() => fundingRequests.reduce((total, request) => total + request.amount, 0), [fundingRequests]);

  const summaries = [
    ["AVAILABLE BALANCE", "₦0", "Ready for eligible services", "wallet", "border-t-[#1f7a5c]"],
    ["PENDING DEPOSITS", `₦${pendingTotal.toLocaleString("en-NG")}`, `${fundingRequests.length} awaiting payment`, "clock", "border-t-[#dd6b12]"],
    ["SERVICE PAYMENTS", "₦0", "No payments yet", "shield", "border-t-[#14213d]"],
    ["PENDING PAYOUTS", "₦0", "No payouts in progress", "list", "border-t-[#6b2545]"],
  ] as const;

  return <div className="w-full space-y-4 px-4 pb-16 pt-1 sm:px-6 lg:px-8">
    <section className="flex flex-col justify-between gap-3 rounded-[14px] border border-[#e4e2da] bg-white p-5 shadow-[0_1px_2px_rgba(18,20,28,.03)] sm:flex-row sm:items-end"><div><span className="text-[9px] font-bold uppercase tracking-[.12em] text-[#b8560d]">WALLET & PAYOUTS</span><h2 className="mt-1 font-[Manrope] text-xl font-semibold text-[#12141c]">Fund your wallet and pay for services</h2><p className="mt-1 max-w-2xl text-xs leading-5 text-[#5c5f6b]">Deposit money, track confirmed balance, pay eligible Hollyway service charges and review settlements from one place.</p></div><Link className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg border border-[#e4e2da] bg-white px-3 text-xs font-bold text-[#14213d] hover:border-[#14213d]" href="/dashboard/settings">Payout settings <Arrow /></Link></section>

    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Wallet summary">{summaries.map(([label, value, note, icon, accent]) => <article className={`flex items-center gap-3 rounded-xl border border-t-[3px] border-[#e4e2da] bg-white p-3.5 ${accent}`} key={label}><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#edeff5] text-[#14213d] [&>svg]:h-4 [&>svg]:w-4"><DashboardIcon name={icon} /></span><span className="min-w-0"><small className="block text-[9px] font-bold tracking-[.1em] text-[#9498a3]">{label}</small><strong className="mt-0.5 block font-[Manrope] text-base text-[#12141c]">{value}</strong><span className="block truncate text-[9px] text-[#5c5f6b]">{note}</span></span></article>)}</section>

    <section className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(280px,.65fr)]"><WalletFundingPanel onCreated={setFundingRequests} /><article className="rounded-[14px] border border-[#e4e2da] bg-[#14213d] p-5 text-white"><span className="text-[9px] font-bold uppercase tracking-[.12em] text-[#dd6b12]">PAY WITH WALLET</span><h3 className="mt-2 font-[Manrope] text-lg font-semibold">One balance for Hollyway services</h3><p className="mt-2 text-xs leading-5 text-[#c9d0e2]">After a deposit is confirmed, the available balance can be selected during an eligible service payment.</p><div className="mt-4 divide-y divide-white/[.09]">{[["Professional services", "tool"], ["Delivery and relocation", "truck"], ["Listing promotions", "grid"], ["Escrow and transaction fees", "shield"]].map(([label, icon]) => <div className="flex items-center gap-2.5 py-2.5 first:pt-0 last:pb-0" key={label}><span className="h-4 w-4 text-[#dd6b12] [&>svg]:h-full [&>svg]:w-full"><DashboardIcon name={icon} /></span><span className="text-[11px] font-medium text-[#c9d0e2]">{label}</span></div>)}</div></article></section>

    <section className="rounded-[14px] border border-[#e4e2da] bg-white p-4 sm:p-5"><div className="flex items-end justify-between gap-3 border-b border-[#e4e2da] pb-3"><div><span className="text-[9px] font-bold uppercase tracking-[.12em] text-[#9498a3]">WALLET ACTIVITY</span><h3 className="mt-1 font-[Manrope] text-lg font-semibold text-[#12141c]">Deposits and service payments</h3></div><span className="text-[10px] text-[#9498a3]">{fundingRequests.length ? `${fundingRequests.length} pending` : "No records"}</span></div>{fundingRequests.length ? <div className="divide-y divide-[#e4e2da]">{fundingRequests.map((request) => <article className="grid gap-2 py-3 text-[10px] sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-6" key={request.reference}><span><strong className="block text-xs text-[#12141c]">Wallet deposit</strong><span className="mt-0.5 block text-[#9498a3]">{request.reference} · {request.method}</span></span><strong className="font-[Manrope] text-xs text-[#12141c]">₦{request.amount.toLocaleString("en-NG")}</strong><span className="rounded-full bg-[#f6efdc] px-2 py-1 font-bold text-[#7a5c00]">{request.status}</span></article>)}</div> : <div className="flex min-h-28 items-center gap-3 rounded-xl bg-[#f8f7f3] p-4"><span className="grid h-9 w-9 place-items-center rounded-lg bg-white text-[#14213d] [&>svg]:h-4 [&>svg]:w-4"><DashboardIcon name="wallet" /></span><span><strong className="block text-xs text-[#12141c]">No wallet activity yet</strong><span className="mt-1 block text-[10px] text-[#5c5f6b]">Your deposit references and service payments will appear here.</span></span></div>}</section>

    <section className="flex flex-col gap-3 rounded-xl border border-[#f0c9a0] bg-[#fbe9da] px-4 py-3 sm:flex-row sm:items-center"><div className="min-w-0 flex-1"><strong className="block text-xs text-[#7a4a17]">KYC is required before withdrawals and payouts</strong><p className="mt-0.5 text-[10px] leading-4 text-[#7a4a17]">Funding requests can be prepared, but account verification and payment confirmation control access to financial activity.</p></div><Link className="shrink-0 text-[10px] font-bold text-[#b8560d] hover:underline" href="/dashboard/profile/kyc">Open KYC</Link></section>
  </div>;
}
