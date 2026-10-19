"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Arrow } from "../../../components/ui/Arrow";
import DashboardPageHeader from "../../dashboard/components/DashboardPageHeader";
import { fetchSale, type SellerOrder } from "../data/salesApi";

const money = (value: number) => `₦${(value / 100).toLocaleString("en-NG")}`;

export default function SalesDetailsPage({ reference }: { reference: string }) {
  const [sale, setSale] = useState<SellerOrder | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { void fetchSale(reference).then(setSale).catch((reason) => setError(reason instanceof Error ? reason.message : "The sale could not be loaded.")); }, [reference]);
  if (error) return <div className="p-6"><p className="rounded-lg border border-[#f1c8c3] bg-[#fff5f3] p-4 text-xs font-semibold text-[#a32929]">{error}</p><Link className="mt-4 inline-flex items-center gap-2 text-xs font-extrabold text-[#1453bb]" href="/dashboard/sales">Back to sales <Arrow /></Link></div>;
  if (!sale) return <div className="grid min-h-56 place-items-center p-6 text-xs font-semibold text-[#687895]">Loading sale…</div>;
  return <div className="w-full space-y-4 p-4 sm:p-6">
    <DashboardPageHeader compact kicker="SALE DETAILS" title={sale.reference} description={sale.status_label} action={<Link className="inline-flex items-center gap-2 text-xs font-extrabold text-[#1453bb]" href="/dashboard/sales">Back to sales <Arrow /></Link>} />
    <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
      <section className="rounded-xl border border-[#dfe4ed] bg-white p-5"><h2 className="text-sm font-extrabold text-[#0b1830]">Your listing items</h2><div className="mt-3 divide-y divide-[#eef1f4]">{sale.items.map((item) => <div className="flex items-center justify-between gap-3 py-3 first:pt-0" key={item.id}><span><strong className="block text-xs text-[#0b1830]">{item.item_name}</strong><small className="text-[10px] text-[#687895]">{item.listing_code} · {item.quantity} × {money(item.unit_price_minor)}</small></span><strong className="text-xs text-[#1453bb]">{money(item.subtotal_minor)}</strong></div>)}</div><dl className="mt-4 grid gap-3 border-t border-[#eef1f4] pt-4 sm:grid-cols-2"><div><dt className="text-[9px] font-extrabold text-[#8995a8]">BUYER</dt><dd className="mt-1 text-xs font-semibold text-[#31425e]">{sale.buyer?.name || "Name not provided"}<br />{sale.buyer?.email || "Email not provided"}</dd></div><div><dt className="text-[9px] font-extrabold text-[#8995a8]">BUYER PHONE</dt><dd className="mt-1 text-xs font-semibold text-[#31425e]">{sale.buyer?.phone || "Not provided"}</dd></div><div><dt className="text-[9px] font-extrabold text-[#8995a8]">DELIVERY ADDRESS</dt><dd className="mt-1 text-xs font-semibold text-[#31425e]">{sale.delivery_address || "To be confirmed"}</dd></div><div><dt className="text-[9px] font-extrabold text-[#8995a8]">DELIVERY METHOD</dt><dd className="mt-1 text-xs font-semibold text-[#31425e]">{sale.delivery_method || "To be confirmed"}</dd></div><div><dt className="text-[9px] font-extrabold text-[#8995a8]">INSPECTION TERMS</dt><dd className="mt-1 text-xs font-semibold text-[#31425e]">{sale.inspection_checks || "Not supplied"}</dd></div></dl></section>
      <aside className="rounded-xl border border-[#dfe4ed] bg-white p-5"><span className="rounded-full bg-[#eef5ff] px-3 py-1 text-[10px] font-extrabold text-[#1453bb]">{sale.status_label}</span><p className="mt-5 text-[10px] font-extrabold tracking-[.14em] text-[#8995a8]">YOUR ITEM VALUE</p><strong className="mt-1 block text-xl font-extrabold text-[#0b1830]">{money(sale.subtotal_minor)}</strong><h2 className="mt-5 text-sm font-extrabold text-[#0b1830]">Activity</h2><div className="mt-3 space-y-3">{sale.status_events.map((event) => <div className="border-l-2 border-[#cfe0f7] pl-3" key={event.id}><p className="text-xs font-extrabold text-[#0b1830]">{event.to_status_label}</p><p className="mt-1 text-[10px] text-[#687895]">{event.reason || "Workflow update"} · {new Date(event.created_at).toLocaleString("en-NG")}</p></div>)}</div></aside>
    </section>
  </div>;
}
