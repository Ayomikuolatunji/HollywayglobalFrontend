"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { Arrow } from "../../../components/ui/Arrow";
import Dropdown, { type DropdownOption } from "../../../components/forms/Dropdown";
import CommerceField from "../components/CommerceField";
import CommercePageHeader from "../components/CommercePageHeader";
import OrderItemsSummary from "../components/OrderItemsSummary";
import { clearOrderCart, refreshOrderCart, type OrderCartItem } from "../data/orderCart";
import { orderInput, saveOrder, type CustomerOrder } from "../data/commerceApi";
import { fetchMarketplaceListing } from "../data/listingApi";

const areaClass = "min-h-24 rounded-lg border border-[#dfe4ed] bg-white px-3 py-3 text-xs leading-5 text-[#0b1830] outline-none focus:border-[#1453bb] focus:ring-4 focus:ring-[#1453bb]/10";
const options = (values: string[]): DropdownOption[] => values.map((value) => ({ value, label: value }));
const money = (value: number) => `₦${(value / 100).toLocaleString("en-NG")}`;

export default function InterestPage({ listingCode = "", listingName = "", listingPrice = 0, orderItems = [] }: { listingCode?: string; listingName?: string; listingPrice?: number; orderItems?: OrderCartItem[] }) {
  const [remoteItems, setRemoteItems] = useState<OrderCartItem[]>([]);
  const [order, setOrder] = useState<CustomerOrder | null>(null);
  const [busy, setBusy] = useState<"draft" | "submit" | "">("");
  const [error, setError] = useState("");
  const [selectedListing, setSelectedListing] = useState<OrderCartItem | null>(
    listingCode ? { code: listingCode, name: listingName, price: listingPrice, quantity: 1 } : null,
  );
  const items = orderItems.length ? orderItems : selectedListing ? [selectedListing] : remoteItems;

  useEffect(() => {
    if (orderItems.length) return;
    if (listingCode) {
      void fetchMarketplaceListing(listingCode)
        .then(({ card }) => setSelectedListing({ code: card.code, name: card.name, price: card.price, quantity: 1 }))
        .catch((reason) => setError(reason instanceof Error ? reason.message : "The selected listing could not be loaded."));
      return;
    }
    void refreshOrderCart().then(setRemoteItems).catch((reason) => setError(reason instanceof Error ? reason.message : "Your cart could not be loaded."));
  }, [listingCode, orderItems.length]);

  async function persist(event: FormEvent<HTMLFormElement>, action: "draft" | "submit") {
    event.preventDefault(); setBusy(action); setError("");
    const data = new FormData(event.currentTarget);
    const values: Record<string, string> = {};
    data.forEach((value, key) => { values[key] = typeof value === "string" ? value : value.name; });
    try { const result = await saveOrder(orderInput(items, values, action)); setOrder(result); if (action === "submit") await clearOrderCart(); } catch (reason) { setError(reason instanceof Error ? reason.message : "Order could not be saved."); } finally { setBusy(""); }
  }

  if (order) return <div className="mx-auto max-w-[760px] p-5 sm:p-8"><section className="rounded-xl border border-[#bfe5d0] bg-[#f5fcf7] p-7 text-center"><span className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-[#20bd61] text-lg font-extrabold text-white">✓</span><p className="mt-4 text-[10px] font-extrabold tracking-[.16em] text-[#216b39]">{order.status_label.toUpperCase()}</p><h2 className="mt-2 font-[Manrope] text-2xl font-extrabold text-[#0b1830]">Order {order.reference}</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#53627a]">The order is stored in your Hollyway account. Wait for Admin to confirm availability, delivery fees, escrow terms and official payment instructions before paying.</p><p className="mt-4 font-[Manrope] text-lg font-extrabold text-[#1453bb]">Items subtotal {money(order.subtotal_minor)}</p><Link className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-[#1453bb] px-4 text-xs font-extrabold text-white" href="/dashboard/orders">View my orders <Arrow /></Link></section></div>;

  if (!items.length) return <div className="w-full space-y-4 p-4 sm:p-6"><CommercePageHeader compact kicker="ITEM ORDER" title="Add an item before ordering." description="Choose a marketplace listing or add items to your account cart first." action={<Link className="inline-flex items-center gap-2 text-xs font-extrabold text-[#1453bb] hover:underline" href="/dashboard/marketplace">Browse marketplace <Arrow /></Link>} />{error && <p className="rounded-lg border border-[#f1c8c3] bg-[#fff5f3] p-3 text-xs font-semibold text-[#a32929]" role="alert">{error}</p>}</div>;

  return <div className="w-full min-w-0 space-y-4 p-4 pb-24 sm:p-6 sm:pb-24"><CommercePageHeader compact kicker="ITEM ORDER" title="Review your order request." description="Your Hollyway account is the buyer record. Add delivery and inspection requirements; do not enter your name again." action={<Link className="inline-flex items-center gap-2 text-xs font-extrabold text-[#1453bb] hover:underline" href="/dashboard/orders">Back to orders <Arrow /></Link>} />{error && <p className="rounded-lg border border-[#f1c8c3] bg-[#fff5f3] p-3 text-xs font-semibold text-[#a32929]" role="alert">{error}</p>}<form className="min-w-0 space-y-4" onSubmit={(event) => void persist(event, "submit")}>{<OrderItemsSummary items={items} />}<section className="min-w-0 rounded-xl border border-[#dfe4ed] bg-white p-4 shadow-sm sm:p-5"><h2 className="text-sm font-extrabold text-[#0b1830]">Delivery details</h2><div className="mt-4 grid gap-4 sm:grid-cols-2"><CommerceField compact label="Primary phone number" name="primaryPhone" type="tel" placeholder="+234 801 234 5678" /><CommerceField compact label="Alternate phone number (optional)" name="backupPhone" type="tel" placeholder="Include country code" required={false} /></div><div className="mt-4"><label className="grid gap-1.5 text-[11px] font-extrabold text-[#31425e]"><span>Full delivery address</span><small className="text-[10px] font-medium text-[#8995a8]">Street, area, city and state</small><textarea className={areaClass} name="deliveryAddress" required placeholder="Where should Hollyway coordinate delivery?" /></label></div><div className="mt-4 grid gap-4 sm:grid-cols-2"><Dropdown compact label="Preferred delivery method" name="deliveryMethod" options={options(["Dispatch rider", "Interstate waybill", "Courier", "Bulk pickup", "Pickup"])} /><Dropdown compact label="Delivery and escrow fee terms" name="feeTerms" options={options(["Await Admin quotation", "Buyer pays", "Seller covers delivery", "50/50 shared"])} /></div></section><section className="min-w-0 rounded-xl border border-[#dfe4ed] bg-white p-4 shadow-sm sm:p-5"><h2 className="text-sm font-extrabold text-[#0b1830]">Inspection and confirmation</h2><label className="mt-4 flex items-start gap-2 text-xs leading-5 text-[#53627a]"><input className="mt-1 accent-[#1453bb]" type="checkbox" required />I have reviewed the listing details and agree that Hollyway will confirm availability and terms before payment.</label><label className="mt-4 grid gap-1.5 text-[11px] font-extrabold text-[#31425e]"><span>Questions or physical checks (optional)</span><small className="text-[10px] font-medium text-[#8995a8]">Tell Hollyway what should be checked before dispatch or release.</small><textarea className={areaClass} name="inspectionChecks" placeholder="List tests, condition checks or questions." /></label><input name="termsAccepted" type="hidden" value="true" /></section><div className="flex flex-wrap justify-end gap-3"><Link className="inline-flex h-10 items-center rounded-lg border border-[#dfe4ed] px-4 text-xs font-extrabold text-[#53627a]" href="/dashboard/orders">Cancel</Link><button className="inline-flex h-10 items-center rounded-lg border border-[#1453bb] px-4 text-xs font-extrabold text-[#1453bb] disabled:opacity-60" disabled={Boolean(busy)} type="button" onClick={(event) => { const form = event.currentTarget.form; if (form) void persist({ preventDefault: () => {}, currentTarget: form } as FormEvent<HTMLFormElement>, "draft"); }}>{busy === "draft" ? "Saving…" : "Save as draft"}</button><button className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1453bb] px-5 text-xs font-extrabold text-white disabled:opacity-60" disabled={Boolean(busy)} type="submit">{busy === "submit" ? "Submitting…" : "Submit order request"} <Arrow /></button></div></form></div>;
}
