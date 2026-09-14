"use client";

import Link from "next/link";
import { type FormEvent } from "react";
import Dropdown from "../../../components/forms/Dropdown";
import { Arrow } from "../../../components/ui/Arrow";
import ResellerField, { ResellerTextArea } from "./ResellerField";
import type { ResellerMarkupType, ResellerOrder } from "../data/reseller";

const markupOptions = [
  {
    value: "Fixed amount",
    label: "Fixed amount per unit",
    tip: "Add a naira markup to each unit in this reseller order.",
  },
  {
    value: "Percentage",
    label: "Percentage",
    tip: "Add a percentage markup to the full item subtotal.",
  },
] as const;

type ResellerOrderFormProps = {
  formKey: number;
  editingOrder: ResellerOrder | null;
  baseUnitPrice: string;
  quantity: string;
  markupType: ResellerMarkupType;
  markupValue: string;
  totals: { subtotal: number; markupTotal: number; customerTotal: number };
  error: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onSaveDraft: (form: HTMLFormElement) => void;
  onBaseUnitPriceChange: (value: string) => void;
  onQuantityChange: (value: string) => void;
  onMarkupTypeChange: (value: ResellerMarkupType) => void;
  onMarkupValueChange: (value: string) => void;
};

function naira(value: number) {
  return `₦${Math.round(value).toLocaleString("en-NG")}`;
}

export default function ResellerOrderForm({
  formKey,
  editingOrder,
  baseUnitPrice,
  quantity,
  markupType,
  markupValue,
  totals,
  error,
  onSubmit,
  onSaveDraft,
  onBaseUnitPriceChange,
  onQuantityChange,
  onMarkupTypeChange,
  onMarkupValueChange,
}: ResellerOrderFormProps) {
  return (
    <form className="space-y-3" key={formKey} onSubmit={onSubmit}>
      <section className="rounded-xl border border-[#e4e2da] bg-white p-4 shadow-[0_1px_2px_rgba(18,20,28,.03)] sm:p-5">
        <div className="border-b border-[#e4e2da] pb-3">
          <span className="text-[9px] font-bold uppercase tracking-[.14em] text-[#9498a3]">
            1 · ITEM AND MARKUP
          </span>
          <h2 className="mt-1 font-[Manrope] text-lg font-semibold text-[#12141c]">
            Build the customer order
          </h2>
          <p className="mt-1 text-[10px] leading-4 text-[#5c5f6b]">
            The reseller markup is a proposed customer-facing amount. It is not a wallet balance
            or an approved payout.
          </p>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <ResellerField
            label="Published listing code"
            name="listingCode"
            placeholder="e.g. HWG-0102"
            defaultValue={editingOrder?.listingCode}
          />
          <ResellerField
            label="Item name"
            name="itemName"
            placeholder="Name shown to your customer"
            defaultValue={editingOrder?.itemName}
          />
          <ResellerField
            label="Base item price per unit (₦)"
            name="baseUnitPrice"
            placeholder="0"
            inputMode="numeric"
            value={baseUnitPrice}
            onChange={onBaseUnitPriceChange}
          />
          <ResellerField
            label="Quantity"
            name="quantity"
            type="number"
            placeholder="1"
            inputMode="numeric"
            value={quantity}
            onChange={(value) => onQuantityChange(value.replace(/\D/g, "") || "1")}
          />
          <Dropdown
            label="Markup method"
            name="markupType"
            options={markupOptions}
            value={markupType}
            onChange={(value) => onMarkupTypeChange(value as ResellerMarkupType)}
          />
          <ResellerField
            label={markupType === "Percentage" ? "Markup percentage (%)" : "Markup amount per unit (₦)"}
            name="markupValue"
            placeholder="0"
            inputMode="decimal"
            value={markupValue}
            onChange={(value) => onMarkupValueChange(
              markupType === "Percentage"
                ? value.replace(/[^0-9.]/g, "")
                : value,
            )}
          />
        </div>
        <div className="mt-4 grid gap-2 rounded-lg border border-[#e4e2da] bg-[#f8f7f3] p-3 text-xs sm:grid-cols-3">
          <span>
            <small className="block text-[9px] font-bold uppercase tracking-[.1em] text-[#9498a3]">
              ITEM SUBTOTAL
            </small>
            <strong className="mt-1 block text-sm text-[#12141c]">{naira(totals.subtotal)}</strong>
          </span>
          <span>
            <small className="block text-[9px] font-bold uppercase tracking-[.1em] text-[#9498a3]">
              RESELLER MARKUP
            </small>
            <strong className="mt-1 block text-sm text-[#b8560d]">{naira(totals.markupTotal)}</strong>
          </span>
          <span>
            <small className="block text-[9px] font-bold uppercase tracking-[.1em] text-[#9498a3]">
              PROPOSED CUSTOMER TOTAL
            </small>
            <strong className="mt-1 block text-sm text-[#14213d]">{naira(totals.customerTotal)}</strong>
          </span>
        </div>
      </section>

      <section className="rounded-xl border border-[#e4e2da] bg-white p-4 shadow-[0_1px_2px_rgba(18,20,28,.03)] sm:p-5">
        <div className="border-b border-[#e4e2da] pb-3">
          <span className="text-[9px] font-bold uppercase tracking-[.14em] text-[#9498a3]">
            2 · CUSTOMER AND DELIVERY
          </span>
          <h2 className="mt-1 font-[Manrope] text-lg font-semibold text-[#12141c]">
            Who is this order for?
          </h2>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <ResellerField
            label="Customer full name"
            name="customerName"
            placeholder="Full name"
            defaultValue={editingOrder?.customerName}
          />
          <ResellerField
            label="Customer email address"
            name="customerEmail"
            type="email"
            placeholder="customer@example.com"
            inputMode="email"
            defaultValue={editingOrder?.customerEmail}
          />
          <ResellerField
            label="Primary phone number"
            name="customerPhone"
            type="tel"
            placeholder="Include country code"
            inputMode="tel"
            defaultValue={editingOrder?.customerPhone}
          />
          <ResellerField
            label="Alternate phone number (optional)"
            name="alternatePhone"
            type="tel"
            placeholder="Include country code"
            inputMode="tel"
            required={false}
            defaultValue={editingOrder?.alternatePhone}
          />
          <div className="sm:col-span-2">
            <ResellerTextArea
              label="Full delivery address"
              name="deliveryAddress"
              placeholder="Street, area, city and state"
              required
              defaultValue={editingOrder?.deliveryAddress}
            />
          </div>
          <div className="sm:col-span-2">
            <ResellerTextArea
              label="Notes for Hollyway (optional)"
              name="notes"
              placeholder="Inspection, delivery or customer instructions."
              defaultValue={editingOrder?.notes}
            />
          </div>
        </div>
      </section>

      {error && (
        <p className="rounded-lg border border-[#f3caca] bg-[#fff5f5] px-3 py-2 text-xs font-semibold text-[#a32929]" role="alert">
          {error}
        </p>
      )}

      <label className="flex items-start gap-2 px-1 text-[10px] leading-4 text-[#5c5f6b]">
        <input className="mt-0.5 accent-[#1453bb]" type="checkbox" required />
        I understand that Hollyway must confirm the listing, markup, fees, payment and delivery
        before the customer pays.
      </label>

      <div className="flex flex-wrap justify-end gap-2">
        <Link
          className="inline-flex h-10 items-center rounded-lg border border-[#e4e2da] px-3 text-[11px] font-bold text-[#5c5f6b]"
          href="/dashboard/referrals"
        >
          Cancel
        </Link>
        <button
          className="inline-flex h-10 items-center rounded-lg border border-[#1453bb] px-3 text-[11px] font-bold text-[#1453bb]"
          type="button"
          onClick={(event) => {
            if (event.currentTarget.form) onSaveDraft(event.currentTarget.form);
          }}
        >
          Save as draft
        </button>
        <button
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1453bb] px-4 text-[11px] font-bold text-white hover:bg-[#0b3f91]"
          type="submit"
        >
          Save order &amp; get receipt <Arrow />
        </button>
      </div>
    </form>
  );
}
