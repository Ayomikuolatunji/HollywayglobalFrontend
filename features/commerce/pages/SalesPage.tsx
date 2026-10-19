"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Arrow } from "../../../components/ui/Arrow";
import DashboardEmptyState from "../../dashboard/components/DashboardEmptyState";
import DashboardPageHeader from "../../dashboard/components/DashboardPageHeader";
import DashboardStatusTabs from "../../dashboard/components/DashboardStatusTabs";
import { fetchSales, type SellerOrder } from "../data/salesApi";
import type { Page } from "../data/commerceApi";

const statuses = ["All sales", "Pending review", "Confirmed", "In transit", "Delivered", "Completed", "Cancelled"] as const;
const statusMap: Record<string, string | undefined> = { "All sales": undefined, "Pending review": "pending_review", Confirmed: "confirmed", "In transit": "in_transit", Delivered: "delivered", Completed: "completed", Cancelled: "cancelled" };
const money = (value: number) => `₦${(value / 100).toLocaleString("en-NG")}`;

export default function SalesPage() {
  const [status, setStatus] = useState<(typeof statuses)[number]>("All sales");
  const [pageNumber, setPageNumber] = useState(1);
  const [page, setPage] = useState<Page<SellerOrder> | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    setError("");
    void fetchSales(pageNumber, 25, statusMap[status]).then(setPage).catch((reason) => setError(reason instanceof Error ? reason.message : "Sales could not be loaded."));
  }, [pageNumber, status]);
  const changeStatus = (value: string) => { setStatus(value as (typeof statuses)[number]); setPageNumber(1); };
  const items = page?.items || [];
  return <div className="w-full space-y-4 p-4 sm:p-6">
    <DashboardPageHeader compact kicker="MY SALES" title="Orders for your listings." description="See the customers, items and fulfilment status for marketplace orders that include your listings." action={<Link className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#dfe4ed] px-3 text-xs font-extrabold text-[#1453bb]" href="/dashboard/listings">Manage listings <Arrow /></Link>} />
    {error && <p className="rounded-lg border border-[#f1c8c3] bg-[#fff5f3] p-3 text-xs font-semibold text-[#a32929]">{error}</p>}
    <section className="rounded-lg border border-[#dfe4ed] bg-white p-4">
      <div className="mb-4 flex items-center justify-between gap-3"><div><span className="text-[10px] font-extrabold tracking-[.14em] text-[#1453bb]">SELLER ORDER QUEUE</span><h2 className="mt-1 text-lg font-extrabold text-[#0b1830]">{page?.total ?? 0} sale{page?.total === 1 ? "" : "s"}</h2></div><span className="text-[10px] font-semibold text-[#687895]">Server records</span></div>
      <DashboardStatusTabs compact items={statuses} active={status} onChange={changeStatus} ariaLabel="Sales status" />
      {items.length ? <div className="mt-4 divide-y divide-[#eef1f4]">{items.map((item) => <Link className="block py-4 first:pt-0 hover:bg-[#f8fafc]" href={`/dashboard/sales/${encodeURIComponent(item.reference)}`} key={item.reference}><div className="flex flex-wrap items-center justify-between gap-2"><strong className="text-sm text-[#0b1830]">{item.reference}</strong><span className="rounded-full bg-[#eef5ff] px-2 py-1 text-[10px] font-extrabold text-[#1453bb]">{item.status_label}</span></div><p className="mt-1 text-xs text-[#53627a]">{item.items.map((entry) => `${entry.quantity} × ${entry.item_name}`).join(", ")}</p><p className="mt-1 text-[10px] text-[#8290a8]">{money(item.subtotal_minor)} · {item.buyer?.name || item.buyer?.email || "Customer"} · Updated {new Date(item.updated_at).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })}</p></Link>)}</div> : <DashboardEmptyState icon="box" title={`No ${status.toLowerCase()} yet`} description="Orders containing one of your published listings will appear here." actionHref="/dashboard/listings" actionLabel="Manage listings" compact />}
      {page && page.total_pages > 1 && <div className="mt-4 flex items-center justify-between border-t border-[#eef1f4] pt-3"><button className="text-[10px] font-extrabold text-[#1453bb] disabled:text-[#b2bdcc]" type="button" disabled={!page.has_previous} onClick={() => setPageNumber((current) => current - 1)}>Previous</button><span className="text-[10px] font-semibold text-[#687895]">Page {page.page} of {page.total_pages}</span><button className="text-[10px] font-extrabold text-[#1453bb] disabled:text-[#b2bdcc]" type="button" disabled={!page.has_next} onClick={() => setPageNumber((current) => current + 1)}>Next</button></div>}
    </section>
  </div>;
}
