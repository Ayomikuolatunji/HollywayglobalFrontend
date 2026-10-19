"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Arrow } from "../../../components/ui/Arrow";
import PaginationControls from "../../../components/ui/PaginationControls";
import DashboardEmptyState from "../../dashboard/components/DashboardEmptyState";
import DashboardPageHeader from "../../dashboard/components/DashboardPageHeader";
import DashboardStatusTabs from "../../dashboard/components/DashboardStatusTabs";
import { fetchOrders, type CustomerOrder, type Page } from "../data/commerceApi";

const statuses = ["All orders", "Draft", "Pending review", "Confirmed", "In transit", "Completed", "Cancelled"] as const;
const statusMap: Record<string, string | undefined> = { "All orders": undefined, Draft: "draft", "Pending review": "pending_review", Confirmed: "confirmed", "In transit": "in_transit", Completed: "completed", Cancelled: "cancelled" };
const money = (value: number) => `₦${(value / 100).toLocaleString("en-NG")}`;

export default function OrdersPage() {
  const [status, setStatus] = useState<(typeof statuses)[number]>("All orders");
  const [page, setPage] = useState<Page<CustomerOrder> | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [error, setError] = useState("");
  useEffect(() => { setError(""); void fetchOrders(pageNumber, 25, statusMap[status]).then(setPage).catch((reason) => setError(reason instanceof Error ? reason.message : "Orders could not be loaded.")); }, [pageNumber, status]);
  const items = page?.items || [];
  return <div className="w-full space-y-4 p-4 sm:p-6"><DashboardPageHeader compact kicker="MY ORDERS" title="Track every order in one place." description="Review the order request, payment instructions and fulfilment updates returned by Hollyway." action={<div className="flex flex-wrap gap-2"><Link className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#dfe4ed] px-3 text-xs font-extrabold text-[#1453bb]" href="/dashboard/marketplace">Browse marketplace <Arrow /></Link><Link className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1453bb] px-3 text-xs font-extrabold text-white" href="/dashboard/orders/interest">Start an order <Arrow /></Link></div>} />{error && <p className="rounded-lg border border-[#f1c8c3] bg-[#fff5f3] p-3 text-xs font-semibold text-[#a32929]">{error}</p>}<section className="rounded-lg border border-[#dfe4ed] bg-white p-4"><div className="mb-4 flex items-center justify-between gap-3"><div><span className="text-[10px] font-extrabold tracking-[.14em] text-[#1453bb]">ORDER RECORDS</span><h2 className="mt-1 text-lg font-extrabold text-[#0b1830]">{page?.total ?? 0} order{page?.total === 1 ? "" : "s"}</h2></div><span className="text-[10px] font-semibold text-[#687895]">Server records</span></div><DashboardStatusTabs compact items={statuses} active={status} onChange={(value) => { setStatus(value as (typeof statuses)[number]); setPageNumber(1); }} ariaLabel="Order status" />{items.length ? <div className="mt-4 divide-y divide-[#eef1f4]">{items.map((item) => <Link className="block py-4 first:pt-0 hover:bg-[#f8fafc]" href={`/dashboard/orders/${encodeURIComponent(item.reference)}`} key={item.reference}><div className="flex flex-wrap items-center justify-between gap-2"><strong className="text-sm text-[#0b1830]">{item.reference}</strong><span className="rounded-full bg-[#eef5ff] px-2 py-1 text-[10px] font-extrabold text-[#1453bb]">{item.status_label}</span></div><p className="mt-1 text-xs text-[#53627a]">{item.items.map((entry) => `${entry.quantity} × ${entry.item_name}`).join(", ") || "Draft order"}</p><p className="mt-1 text-[10px] text-[#8290a8]">{money(item.subtotal_minor)} · Updated {new Date(item.updated_at).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })}</p></Link>)}</div> : <DashboardEmptyState icon="box" title={`No ${status.toLowerCase()} yet`} description="Order requests submitted from the marketplace will appear here." actionHref="/dashboard/marketplace" actionLabel="Browse marketplace" compact />}{page && <PaginationControls page={page.page} totalPages={page.total_pages} hasPrevious={page.has_previous} hasNext={page.has_next} onPageChange={setPageNumber} />}</section></div>;
}
