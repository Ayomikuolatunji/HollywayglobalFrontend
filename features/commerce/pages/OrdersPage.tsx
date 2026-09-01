"use client";

import Link from "next/link";
import { useState } from "react";
import { Arrow } from "../../../components/ui/Arrow";
import DashboardEmptyState from "../../dashboard/components/DashboardEmptyState";
import DashboardPageHeader from "../../dashboard/components/DashboardPageHeader";
import DashboardStatusTabs from "../../dashboard/components/DashboardStatusTabs";
import DashboardSummaryCard from "../../dashboard/components/DashboardSummaryCard";

const statuses = ["All orders", "Pending", "Confirmed", "Delivered", "Completed"] as const;

export default function OrdersPage() {
  const [status, setStatus] = useState<(typeof statuses)[number]>("All orders");

  return <div className="mx-auto max-w-[1180px] space-y-4 p-4 sm:p-6">
    <DashboardPageHeader compact kicker="MY ORDERS" title="Track every order in one place." description="Follow order confirmation, inspection, delivery and completion from your Hollyway workspace." action={<div className="flex flex-wrap gap-3"><Link className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#dfe4ed] px-3 text-xs font-extrabold text-[#1453bb]" href="/dashboard/marketplace">Browse marketplace <Arrow /></Link><Link className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1453bb] px-3 text-xs font-extrabold text-white" href="/dashboard/orders/interest">Express interest <Arrow /></Link></div>} />
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {[["PENDING", "0", "Awaiting confirmation", "clock"], ["CONFIRMED", "0", "Ready for fulfilment", "shield"], ["DELIVERED", "0", "Awaiting completion", "truck"], ["COMPLETED", "0", "Finished orders", "box"]].map(([label, value, note, icon]) => <DashboardSummaryCard key={label} label={label} value={value} note={note} icon={icon} compact />)}
    </section>
    <section className="rounded-lg border border-[#dfe4ed] bg-white p-4">
      <DashboardStatusTabs compact items={statuses} active={status} onChange={(value) => setStatus(value as (typeof statuses)[number])} ariaLabel="Order status" />
      <DashboardEmptyState icon="box" title={`No ${status.toLowerCase()} yet`} description="Your Hollyway reference, order status, inspection updates and delivery tracking will appear here when activity is available." actionHref="/dashboard/orders/interest" actionLabel="Start an order request" compact />
    </section>
  </div>;
}
