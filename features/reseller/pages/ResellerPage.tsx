"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Arrow } from "../../../components/ui/Arrow";
import DashboardPageHeader from "../../dashboard/components/DashboardPageHeader";
import DashboardSummaryCard from "../../dashboard/components/DashboardSummaryCard";
import DraftStatusNotice from "../../commerce/components/DraftStatusNotice";
import { createOrderReference, type OrderCopyDetails } from "../../commerce/components/OrderCopyActions";
import { getDraftValues, saveUserDraft } from "../../dashboard/data/drafts";
import ResellerOrderForm from "../components/ResellerOrderForm";
import ResellerOrderList from "../components/ResellerOrderList";
import ResellerOrderReceipt from "../components/ResellerOrderReceipt";
import ResellerProcessNote from "../components/ResellerProcessNote";
import {
  calculateResellerTotals,
  formatAmount,
  parseAmount,
  readResellerOrders,
  saveResellerOrder,
  type ResellerMarkupType,
  type ResellerOrder,
} from "../data/reseller";

function naira(value: number) {
  return `₦${Math.round(value).toLocaleString("en-NG")}`;
}

function dateLabel(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : new Intl.DateTimeFormat("en-NG", { dateStyle: "medium" }).format(date);
}

function formText(values: FormData, name: string) {
  const value = values.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export default function ResellerPage() {
  const [orders, setOrders] = useState<ResellerOrder[]>([]);
  const [editingOrder, setEditingOrder] = useState<ResellerOrder | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [reference, setReference] = useState("");
  const [draftSaved, setDraftSaved] = useState(false);
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState<OrderCopyDetails | null>(null);
  const [baseUnitPrice, setBaseUnitPrice] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [markupType, setMarkupType] = useState<ResellerMarkupType>("Fixed amount");
  const [markupValue, setMarkupValue] = useState("");

  useEffect(() => setOrders(readResellerOrders()), []);

  const totals = useMemo(
    () => calculateResellerTotals(
      parseAmount(baseUnitPrice),
      Number(quantity) || 1,
      markupType,
      parseAmount(markupValue),
    ),
    [baseUnitPrice, markupType, markupValue, quantity],
  );

  function buildOrder(form: HTMLFormElement): ResellerOrder {
    const values = new FormData(form);
    const nextReference = reference || createOrderReference("HWO");
    const nextQuantity = Math.max(1, Number(values.get("quantity")) || 1);
    const nextBaseUnitPrice = parseAmount(formText(values, "baseUnitPrice"));
    const nextMarkupType: ResellerMarkupType = values.get("markupType") === "Percentage"
      ? "Percentage"
      : "Fixed amount";
    const nextMarkupValue = parseAmount(formText(values, "markupValue"));

    setReference(nextReference);
    return {
      reference: nextReference,
      listingCode: formText(values, "listingCode"),
      itemName: formText(values, "itemName"),
      quantity: nextQuantity,
      baseUnitPrice: nextBaseUnitPrice,
      markupType: nextMarkupType,
      markupValue: nextMarkupValue,
      ...calculateResellerTotals(
        nextBaseUnitPrice,
        nextQuantity,
        nextMarkupType,
        nextMarkupValue,
      ),
      customerName: formText(values, "customerName"),
      customerEmail: formText(values, "customerEmail"),
      customerPhone: formText(values, "customerPhone"),
      alternatePhone: formText(values, "alternatePhone"),
      deliveryAddress: formText(values, "deliveryAddress"),
      notes: formText(values, "notes"),
      status: "Draft",
      createdAt: new Date().toISOString(),
    };
  }

  function persistDraft(form: HTMLFormElement) {
    try {
      const order = buildOrder(form);
      saveUserDraft("reseller order", {
        reference: order.reference,
        values: getDraftValues(form),
      });
      setOrders(saveResellerOrder(order));
      setEditingOrder(order);
      setDraftSaved(true);
      setError("");
    } catch {
      setError("This reseller order could not be saved. Please try again.");
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const order = buildOrder(event.currentTarget);
      saveUserDraft("reseller order", {
        reference: order.reference,
        values: getDraftValues(event.currentTarget),
      });
      setOrders(saveResellerOrder(order));
      setReceipt({
        title: "Reseller order",
        reference: order.reference,
        status: "DRAFT · LOCAL",
        createdAt: dateLabel(order.createdAt),
        fields: [
          {
            label: "Listing",
            value: `${order.itemName || "Item not named"} · ${order.listingCode || "No code"}`,
          },
          { label: "Customer", value: order.customerName || "Not provided" },
          { label: "Quantity", value: String(order.quantity) },
          { label: "Customer total", value: naira(order.customerTotal) },
          { label: "Reseller markup", value: naira(order.markupTotal) },
        ],
        note: "This reseller order is saved in this browser as a Draft until the reseller API is connected. Hollyway must confirm listing availability, markup terms, delivery, payment and the official HWO order before the customer pays. This does not open or fund Wallet & payouts.",
      });
      setError("");
    } catch {
      setError("This reseller order could not be saved. Please try again.");
    }
  }

  function continueOrder(order: ResellerOrder) {
    setEditingOrder(order);
    setReference(order.reference);
    setBaseUnitPrice(formatAmount(String(order.baseUnitPrice)));
    setQuantity(String(order.quantity));
    setMarkupType(order.markupType);
    setMarkupValue(
      order.markupType === "Percentage"
        ? String(order.markupValue)
        : formatAmount(String(order.markupValue)),
    );
    setDraftSaved(false);
    setError("");
    setFormKey((value) => value + 1);
  }

  function createAnother() {
    setEditingOrder(null);
    setReference("");
    setBaseUnitPrice("");
    setQuantity("1");
    setMarkupType("Fixed amount");
    setMarkupValue("");
    setDraftSaved(false);
    setError("");
    setFormKey((value) => value + 1);
    setReceipt(null);
  }

  if (receipt) {
    return <ResellerOrderReceipt copy={receipt} onCreateAnother={createAnother} />;
  }

  const drafts = orders.filter((order) => order.status === "Draft").length;

  return (
    <div className="w-full space-y-3 px-4 pb-16 pt-1 sm:px-6 lg:px-8">
      <DashboardPageHeader
        kicker="PARTNERSHIPS"
        title="Reseller workspace"
        description="Prepare customer orders and reseller markups separately from referral registrations. Wallet & payouts is a separate finance area."
        compact
        action={
          <Link
            className="inline-flex h-8 items-center gap-2 rounded-lg border border-[#e4e2da] bg-white px-3 text-[11px] font-bold text-[#14213d] hover:border-[#14213d]"
            href="/dashboard/referrals"
          >
            Back to referrals <Arrow />
          </Link>
        }
      />
      <DraftStatusNotice contentType="reseller order" saved={draftSaved} />
      <section className="grid gap-3 sm:grid-cols-3" aria-label="Reseller summary">
        <DashboardSummaryCard
          label="SAVED ORDERS"
          value={String(orders.length)}
          note="Saved in this browser"
          icon="box"
          tone="blue"
          compact
          micro
        />
        <DashboardSummaryCard
          label="DRAFTS"
          value={String(drafts)}
          note="Private local records"
          icon="list"
          tone="purple"
          compact
          micro
        />
        <DashboardSummaryCard
          label="API STATUS"
          value="LOCAL"
          note="Server workflow pending"
          icon="clock"
          tone="neutral"
          compact
          micro
        />
      </section>
      <ResellerProcessNote />
      <ResellerOrderForm
        formKey={formKey}
        editingOrder={editingOrder}
        baseUnitPrice={baseUnitPrice}
        quantity={quantity}
        markupType={markupType}
        markupValue={markupValue}
        totals={totals}
        error={error}
        onSubmit={submit}
        onSaveDraft={persistDraft}
        onBaseUnitPriceChange={(value) => setBaseUnitPrice(formatAmount(value))}
        onQuantityChange={setQuantity}
        onMarkupTypeChange={setMarkupType}
        onMarkupValueChange={(value) => setMarkupValue(
          markupType === "Percentage" ? value : formatAmount(value),
        )}
      />
      <ResellerOrderList orders={orders} onContinue={continueOrder} />
    </div>
  );
}
