"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Arrow } from "../../../components/ui/Arrow";
import DashboardPageHeader from "../../dashboard/components/DashboardPageHeader";
import DashboardSummaryCard from "../../dashboard/components/DashboardSummaryCard";
import type { Listing } from "../../commerce/data";
import { fetchMarketplaceListing } from "../../commerce/data/listingApi";
import { type OrderCopyDetails } from "../../commerce/components/OrderCopyActions";
import ResellerOrderForm from "../components/ResellerOrderForm";
import ResellerOrderList from "../components/ResellerOrderList";
import ResellerOrderReceipt from "../components/ResellerOrderReceipt";
import ResellerProcessNote from "../components/ResellerProcessNote";
import { calculateResellerTotals, formatAmount, parseAmount, type ResellerMarkupType, type ResellerOrder } from "../data/reseller";
import { fetchAllResellerOrders, saveResellerOrder, type ResellerInput } from "../data/resellerApi";

function naira(value: number) { return `₦${Math.round(value).toLocaleString("en-NG")}`; }
function dateLabel(value: string) { const date = new Date(value); return Number.isNaN(date.getTime()) ? "Date unavailable" : new Intl.DateTimeFormat("en-NG", { dateStyle: "medium" }).format(date); }
function formText(values: FormData, name: string) { const value = values.get(name); return typeof value === "string" ? value.trim() : ""; }

export default function ResellerPage() {
  const [orders, setOrders] = useState<ResellerOrder[]>([]);
  const [editingOrder, setEditingOrder] = useState<ResellerOrder | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [listingCode, setListingCode] = useState("");
  const [listing, setListing] = useState<Listing | null>(null);
  const [listingLoading, setListingLoading] = useState(false);
  const [reference, setReference] = useState<string | undefined>();
  const [draftSaved, setDraftSaved] = useState(false);
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState<OrderCopyDetails | null>(null);
  const [quantity, setQuantity] = useState("1");
  const [markupType, setMarkupType] = useState<ResellerMarkupType>("Fixed amount");
  const [markupValue, setMarkupValue] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => { void fetchAllResellerOrders().then(setOrders).catch((reason) => setError(reason instanceof Error ? reason.message : "Reseller orders could not be loaded.")).finally(() => setLoading(false)); }, []);
  const totals = useMemo(() => calculateResellerTotals(listing?.price || 0, Number(quantity) || 1, markupType, parseAmount(markupValue)), [listing, markupType, markupValue, quantity]);

  async function findListing() {
    if (!listingCode.trim()) return;
    setListingLoading(true); setError("");
    try { const result = await fetchMarketplaceListing(listingCode.trim().toUpperCase()); setListing(result.card); }
    catch (reason) { setListing(null); setError(reason instanceof Error ? reason.message : "Published listing could not be found."); }
    finally { setListingLoading(false); }
  }

  function input(form: HTMLFormElement, action: "draft" | "submit"): ResellerInput { const values = new FormData(form); return { action, listingCode: formText(values, "listingCode"), quantity: formText(values, "quantity") || "1", markupType: values.get("markupType") === "Percentage" ? "Percentage" : "Fixed amount", markupValue: formText(values, "markupValue"), customerName: formText(values, "customerName"), customerEmail: formText(values, "customerEmail"), customerPhone: formText(values, "customerPhone"), alternatePhone: formText(values, "alternatePhone"), deliveryAddress: formText(values, "deliveryAddress"), notes: formText(values, "notes"), termsAccepted: values.get("termsAccepted") === "on" }; }

  async function persist(form: HTMLFormElement, action: "draft" | "submit") {
    setError("");
    try {
      const saved = await saveResellerOrder(input(form, action), reference);
      setOrders((current) => [saved, ...current.filter((item) => item.reference !== saved.reference)]);
      setReference(saved.reference); setEditingOrder(saved); setDraftSaved(action === "draft");
      if (action === "submit") setReceipt({ title: "Reseller order", reference: saved.reference, status: saved.statusLabel.toUpperCase(), createdAt: dateLabel(saved.createdAt), fields: [{ label: "Listing", value: `${saved.itemName} · ${saved.listingCode}` }, { label: "Customer", value: saved.customerName || "Not provided" }, { label: "Quantity", value: String(saved.quantity) }, { label: "Customer total", value: naira(saved.customerTotal) }, { label: "Reseller markup", value: naira(saved.markupTotal) }], note: saved.status === "Draft" ? "This order is saved as a server Draft because the account requirements are not complete. Complete KYC before Hollyway can review it." : "Hollyway will confirm listing availability, markup terms, delivery and payment before the customer pays." });
    } catch (reason) { setError(reason instanceof Error ? reason.message : "This reseller order could not be saved."); }
  }

  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); void persist(event.currentTarget, "submit"); }
  function saveDraft(form: HTMLFormElement) { void persist(form, "draft"); }
  function continueOrder(order: ResellerOrder) { setEditingOrder(order); setReference(order.reference); setListingCode(order.listingCode); setQuantity(String(order.quantity)); setMarkupType(order.markupType); setMarkupValue(order.markupType === "Percentage" ? String(order.markupValue) : formatAmount(String(order.markupValue))); setDraftSaved(false); setError(""); setFormKey((value) => value + 1); void loadListing(order.listingCode); }
  function createAnother() { setEditingOrder(null); setReference(undefined); setListingCode(""); setListing(null); setQuantity("1"); setMarkupType("Fixed amount"); setMarkupValue(""); setDraftSaved(false); setError(""); setFormKey((value) => value + 1); setReceipt(null); }
  async function loadListing(code: string) { try { setListing((await fetchMarketplaceListing(code)).card); } catch { setListing(null); } }

  if (loading) return <div className="grid min-h-[420px] place-items-center px-5 text-xs font-bold text-[#687895]">Loading reseller workspace…</div>;
  if (receipt) return <ResellerOrderReceipt copy={receipt} onCreateAnother={createAnother} />;
  const drafts = orders.filter((order) => order.status === "Draft").length;
  return <div className="w-full space-y-3 px-4 pb-16 pt-1 sm:px-6 lg:px-8"><DashboardPageHeader kicker="PARTNERSHIPS" title="Reseller workspace" description="Prepare customer orders and reseller markups separately from referral registrations. Wallet & payouts remains a separate finance area." compact action={<Link className="inline-flex h-8 items-center gap-2 rounded-lg border border-[#e4e2da] bg-white px-3 text-[11px] font-bold text-[#14213d]" href="/dashboard/referrals">Back to referrals <Arrow /></Link>} /><section className="grid gap-3 sm:grid-cols-3" aria-label="Reseller summary"><DashboardSummaryCard label="SAVED ORDERS" value={String(orders.length)} note="Server records" icon="box" tone="blue" compact micro /><DashboardSummaryCard label="DRAFTS" value={String(drafts)} note="Private server drafts" icon="list" tone="purple" compact micro /><DashboardSummaryCard label="WORKFLOW" value="SERVER" note="Listing and totals verified by Hollyway" icon="clock" tone="neutral" compact micro /></section><ResellerProcessNote /><ResellerOrderForm formKey={formKey} editingOrder={editingOrder} listingCode={listingCode} listing={listing} listingLoading={listingLoading} quantity={quantity} markupType={markupType} markupValue={markupValue} totals={totals} error={error} onSubmit={submit} onSaveDraft={saveDraft} onListingCodeChange={(value) => { setListingCode(value.toUpperCase()); setListing(null); }} onFindListing={() => void findListing()} onQuantityChange={setQuantity} onMarkupTypeChange={setMarkupType} onMarkupValueChange={(value) => setMarkupValue(markupType === "Percentage" ? value.replace(/[^0-9.]/g, "") : formatAmount(value))} /><ResellerOrderList orders={orders} onContinue={continueOrder} /></div>;
}
