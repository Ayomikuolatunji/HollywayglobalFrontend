"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import Dropdown from "../../../components/forms/Dropdown";
import { Arrow } from "../../../components/ui/Arrow";
import ServiceField from "../components/ServiceField";
import ServicePageHeader from "../components/ServicePageHeader";
import { fetchLogisticsRequest, saveLogistics, type LogisticsOption, type LogisticsRequest, type LogisticsSaveInput, type SizeClass } from "../data/logistics";

const options = [
  { value: "same_day_intracity", label: "Same-day intra-city", tip: "For pickup and delivery within the same city, coordinated with an approved local carrier." },
  { value: "gbenga_minibus", label: "Mr. Gbenga minibus", tip: "For bulky appliances, furniture and larger loads around Lagos and nearby areas." },
  { value: "interstate_waybill", label: "Interstate waybill", tip: "For tracked terminal or doorstep delivery between states." },
  { value: "international_air_express", label: "International air express", tip: "For time-sensitive international cargo; Admin confirms carrier and current quotation." },
] as const;
const sizes = [
  { value: "small_parcel", label: "Small parcel", tip: "A compact parcel that can be handled by a dispatch rider." },
  { value: "medium_box", label: "Medium box", tip: "A boxed shipment larger than a small parcel." },
  { value: "heavy_furniture", label: "Heavy furniture", tip: "Furniture, appliances or items that need bulky-cargo handling." },
  { value: "bulk_sacks", label: "Bulk sacks", tip: "Multiple sacks or a heavier grouped shipment." },
] as const;

function localDateTime(value: string | null) { return value ? new Date(value).toISOString().slice(0, 16) : ""; }
function naira(value: number | null) { return value === null ? "" : String(value / 100); }
function money(value: string) { const digits = value.replace(/[^0-9]/g, ""); return digits ? Number(digits) * 100 : null; }

export default function LogisticsPage() {
  const [draftReference, setDraftReference] = useState("");
  const [draft, setDraft] = useState<LogisticsRequest | null>(null);
  const [loadingDraft, setLoadingDraft] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const reference = new URLSearchParams(window.location.search).get("reference") || "";
    setDraftReference(reference);
    if (!reference) { setLoadingDraft(false); return; }
    fetchLogisticsRequest(reference)
      .then(setDraft)
      .catch((reason) => setError(reason instanceof Error ? reason.message : "The logistics Draft could not be loaded."))
      .finally(() => setLoadingDraft(false));
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const action = String(form.get("action") || "draft") as "draft" | "submit";
    const pickup = String(form.get("pickup_at") || "");
    const input: LogisticsSaveInput = {
      action, senderName: String(form.get("sender_name") || ""), senderPhoneE164: String(form.get("sender_phone_e164") || ""),
      pickupAddress: String(form.get("pickup_address") || ""), receiverName: String(form.get("receiver_name") || ""),
      receiverPhoneE164: String(form.get("receiver_phone_e164") || ""), deliveryAddress: String(form.get("delivery_address") || ""),
      itemName: String(form.get("item_name") || ""), itemDescription: String(form.get("item_description") || ""),
      sizeClass: String(form.get("size_class") || "small_parcel") as SizeClass, fragile: form.get("fragile") === "Yes",
      declaredValueMinor: money(String(form.get("declared_value") || "")), logisticsOption: String(form.get("logistics_option") || "same_day_intracity") as LogisticsOption,
      transitInsurance: form.get("transit_insurance") === "Yes", pickupAt: pickup ? new Date(pickup).toISOString() : null,
      termsAccepted: form.get("terms") === "on",
    };
    setSaving(true); setError(""); setSaved("");
    try {
      const result = await saveLogistics(input, draftReference || undefined);
      setSaved(`${result.reference} · ${result.status_label}`);
      if (action === "submit" && !draftReference) event.currentTarget.reset();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "The logistics request could not be saved."); }
    finally { setSaving(false); }
  }

  return <div className="mx-auto max-w-[1180px] space-y-5 p-4 sm:p-7">
    <ServicePageHeader kicker="LOGISTICS & WAYBILL" title="Book a delivery with the details carriers need." description="Hollyway reviews your pickup, delivery and parcel information, then adds a current quotation. Shipping prices are dynamic; there is no fixed rate table." action={<Link className="inline-flex items-center gap-2 text-xs font-extrabold text-[#1453bb] hover:underline" href="/dashboard/logistics">My shipments <Arrow /></Link>} />
    {error && <p className="rounded-lg border border-[#f1c8c3] bg-[#fff5f3] p-3 text-xs font-semibold text-[#a32929]" role="alert">{error}</p>}
    {saved && <p className="rounded-lg border border-[#c8e6d0] bg-[#f4fcf6] p-3 text-xs font-semibold text-[#216b39]">{saved}. Open My shipments to follow the request.</p>}
    {loadingDraft ? <p className="rounded-lg border border-[#dfe4ed] bg-white p-4 text-xs font-semibold text-[#687895]">Loading Draft…</p> : <LogisticsForm draft={draft} saving={saving} onSubmit={submit} />}
  </div>;
}

function LogisticsForm({ draft, saving, onSubmit }: { draft: LogisticsRequest | null; saving: boolean; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return <form className="space-y-5 rounded-xl border border-[#dfe4ed] bg-white p-4 shadow-sm sm:p-6" onSubmit={onSubmit}>
    <div className="grid gap-5 lg:grid-cols-2"><section><SectionTitle title="Sender details" note="Who is handing the item to the carrier?" /><div className="mt-4 grid gap-4"><ServiceField label="Sender full name" name="sender_name" defaultValue={draft?.sender_name} placeholder="Full name" required={false} /><ServiceField label="Active phone number" name="sender_phone_e164" type="tel" defaultValue={draft?.sender_phone_e164} placeholder="Include country code, e.g. +234 801 234 5678" required={false} /><Area label="Exact pick-up address" name="pickup_address" defaultValue={draft?.pickup_address} placeholder="Street, area, city and state" /></div></section><section><SectionTitle title="Receiver details" note="Use the person who will receive the shipment." /><div className="mt-4 grid gap-4"><ServiceField label="Receiver full name" name="receiver_name" defaultValue={draft?.receiver_name} placeholder="Full name" required={false} /><ServiceField label="Active phone number" name="receiver_phone_e164" type="tel" defaultValue={draft?.receiver_phone_e164} placeholder="Include country code, e.g. +234 801 234 5678" required={false} /><Area label="Exact delivery address" name="delivery_address" defaultValue={draft?.delivery_address} placeholder="Street, area, city and state" /></div></section></div>
    <div className="border-t border-[#eef1f4] pt-5"><SectionTitle title="Parcel information" note="Give Hollyway enough information to compare current carrier quotations." /><div className="mt-4 grid gap-4 sm:grid-cols-2"><ServiceField label="Item name" name="item_name" defaultValue={draft?.item_name} placeholder="e.g. Office chair" required={false} /><Dropdown label="Approximate weight and size" name="size_class" options={sizes} defaultValue={draft?.size_class} required={false} hint="Choose the closest handling category." /><ServiceField label="Estimated value (₦)" name="declared_value" defaultValue={naira(draft?.declared_value_minor ?? null)} placeholder="e.g. 150000" required={false} /><Dropdown label="Fragile or glass?" name="fragile" options={[{ value: "Yes", label: "Yes", tip: "Tell us if the item needs fragile handling." }, { value: "No", label: "No", tip: "Use this when ordinary handling is suitable." }]} defaultValue={draft?.fragile ? "Yes" : "No"} required={false} /></div><Area label="Item description" name="item_description" defaultValue={draft?.item_description} placeholder="Describe the contents, quantity, packaging and handling requirements." /></div>
    <div className="grid gap-4 border-t border-[#eef1f4] pt-5 sm:grid-cols-2"><Dropdown label="Preferred logistics option" name="logistics_option" options={options} defaultValue={draft?.logistics_option} required={false} hint="Admin confirms the current carrier and quotation." /><Dropdown label="Hollyway Protect transit insurance" name="transit_insurance" options={[{ value: "Yes", label: "Yes", tip: "Request optional cargo protection against loss or damage during transit." }, { value: "No", label: "No", tip: "Continue without optional transit protection." }]} defaultValue={draft?.transit_insurance ? "Yes" : "No"} required={false} /><ServiceField label="Preferred pick-up date and time" name="pickup_at" type="datetime-local" defaultValue={localDateTime(draft?.pickup_at || null)} required={false} placeholder="Choose a future date and time" /></div>
    <label className="flex items-start gap-2 text-xs leading-5 text-[#53627a]"><input className="mt-1 accent-[#1453bb]" defaultChecked={Boolean(draft?.terms_accepted_at)} name="terms" type="checkbox" />I confirm these logistics details are accurate and agree to Hollyway terms and privacy notice.</label>
    <div className="flex flex-wrap gap-2 border-t border-[#eef1f4] pt-4"><button className="inline-flex h-10 items-center rounded-lg border border-[#dfe4ed] px-4 text-xs font-extrabold text-[#1453bb] disabled:opacity-50" disabled={saving} name="action" value="draft" type="submit">{saving ? "Saving…" : "Save as Draft"}</button><button className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1453bb] px-4 text-xs font-extrabold text-white hover:bg-[#0b3f91] disabled:opacity-50" disabled={saving} name="action" value="submit" type="submit">Submit logistics request <Arrow /></button></div>
  </form>;
}

function SectionTitle({ title, note }: { title: string; note: string }) { return <div><h2 className="font-[Manrope] text-base font-extrabold tracking-[-.03em] text-[#0b1830]">{title}</h2><p className="mt-1 text-[11px] leading-4 text-[#687895]">{note}</p></div>; }
function Area({ label, name, defaultValue, placeholder }: { label: string; name: string; defaultValue?: string; placeholder: string }) { return <label className="grid gap-2 text-[11px] font-extrabold text-[#31425e]"><span>{label}</span><small className="text-[10px] font-medium leading-4 text-[#8995a8]">{placeholder}</small><textarea className="min-h-20 rounded-lg border border-[#dfe4ed] bg-white px-3 py-3 text-xs font-medium text-[#0b1830] outline-none placeholder:text-[#9aa6b7] focus:border-[#1453bb] focus:ring-4 focus:ring-[#1453bb]/10" defaultValue={defaultValue} name={name} placeholder={placeholder} /></label>; }
