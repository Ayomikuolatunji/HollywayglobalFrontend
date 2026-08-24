"use client";

import Link from "next/link";
import { useState } from "react";
import { Arrow } from "../../../components/ui/Arrow";
import DashboardIcon from "../../dashboard/components/DashboardIcon";
import DashboardPageHeader from "../../dashboard/components/DashboardPageHeader";

const statuses = ["All orders", "Pending", "Confirmed", "Delivered", "Completed"] as const;

export default function OrdersPage() {
  const [status, setStatus] = useState<(typeof statuses)[number]>("All orders");

  return <div className="mx-auto max-w-[1180px] space-y-6 p-5 sm:p-8">
    <DashboardPageHeader kicker="MY ORDERS" title="Track every order in one place." description="Follow order confirmation, inspection, delivery and completion from your Hollyway workspace." action={<div className="flex flex-wrap gap-3"><Link className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#dfe4ed] px-4 text-xs font-extrabold text-[#1453bb]" href="/dashboard/marketplace">Browse marketplace <Arrow /></Link><Link className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#1453bb] px-4 text-xs font-extrabold text-white" href="/dashboard/orders/interest">Express interest <Arrow /></Link></div>} />
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {[["PENDING", "0", "Awaiting confirmation", "clock"], ["CONFIRMED", "0", "Ready for fulfilment", "shield"], ["DELIVERED", "0", "Awaiting completion", "truck"], ["COMPLETED", "0", "Finished orders", "box"]].map(([label, value, note, icon]) => <article className="flex items-start gap-3 rounded-xl border border-[#dfe4ed] bg-white p-4 shadow-sm" key={label}><span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#edf4ff] text-[#1453bb] [&>svg]:h-4 [&>svg]:w-4"><DashboardIcon name={icon} /></span><div><small className="block text-[9px] font-extrabold tracking-[.12em] text-[#8b97a9]">{label}</small><strong className="mt-1 block font-[Manrope] text-xl font-extrabold text-[#0b1830]">{value}</strong><span className="mt-1 block text-[10px] text-[#8490a4]">{note}</span></div></article>)}
    </section>
    <section className="rounded-xl border border-[#dfe4ed] bg-white p-5 shadow-sm">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Order status">{statuses.map((item) => <button className={`rounded-lg px-3 py-2 text-[10px] font-extrabold ${status === item ? "bg-[#edf4ff] text-[#1453bb]" : "text-[#8490a4] hover:bg-[#f8fafc]"}`} type="button" role="tab" aria-selected={status === item} onClick={() => setStatus(item)} key={item}>{item}</button>)}</div>
      <div className="mt-5 grid place-items-center rounded-xl border border-dashed border-[#cbd5e1] bg-[#f8fafc] px-5 py-14 text-center"><span className="grid h-12 w-12 place-items-center rounded-full bg-white text-[#1453bb] shadow-sm [&>svg]:h-5 [&>svg]:w-5"><DashboardIcon name="box" /></span><h3 className="mt-4 font-[Manrope] text-lg font-extrabold text-[#0b1830]">No {status.toLowerCase()} yet</h3><p className="mt-2 max-w-md text-xs leading-5 text-[#8490a4]">Your Hollyway reference, order status, inspection updates and delivery tracking will appear here when activity is available.</p><Link className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-[#1453bb] px-4 text-xs font-extrabold text-white" href="/dashboard/orders/interest">Start an order request <Arrow /></Link></div>
    </section>
  </div>;
}
