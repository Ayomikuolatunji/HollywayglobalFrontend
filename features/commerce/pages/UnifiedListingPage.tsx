"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type ComponentProps, type FormEvent, type ReactNode } from "react";
import { ApiResponseError } from "../../../components/api/apiResponse";
import Dropdown from "../../../components/forms/Dropdown";
import { Arrow } from "../../../components/ui/Arrow";
import CommerceField from "../components/CommerceField";
import CommercePageHeader from "../components/CommercePageHeader";
import BulkListingItems, { type BulkListingItem } from "../components/BulkListingItems";
import DraftStatusNotice from "../components/DraftStatusNotice";
import OrderCopyActions, { type OrderCopyDetails } from "../components/OrderCopyActions";
import FeaturedPostSelector, { type FeaturedPostPackage } from "../components/FeaturedPostSelector";
import { isFeaturedPackageId } from "../../fees/data/publicFeesApi";
import WalletPromotionPaymentButton from "../components/WalletPromotionPaymentButton";
import { fetchListing, formatListingMoney, saveListing, type Listing, type ListingFormValues } from "../data/listingApi";

const routes = [
  ["declutter", "Home & office decluttering"], ["distress", "Urgent distress sale"],
  ["relocation", "Relocation / Japa clearance"], ["importer", "Importer / container clearance"],
  ["campus", "Campus & NYSC clearance"], ["commercial", "Commercial business clearance"],
  ["estate", "Full home clearance"], ["repair", "Repair, refurbish & resell"],
  ["trade-in", "Smart trade-in & upgrade"], ["agro-crafts", "Agro products or handmade crafts"],
  ["other", "Other item for sale"],
] as const;

function routeId(value: string, fallback: string) {
  return routes.find(([id, label]) => id === value || label === value)?.[0] || fallback;
}

const categories = [
  "Vehicles & machinery", "Home & kitchen appliances", "Household essentials & utensils",
  "Living room & electronics", "Gadgets & computing", "Furniture & interior decor",
  "Fashion, toys & personal items", "Imported clearance & excess stock", "Agro products",
  "Handmade crafts", "Commercial equipment", "Other",
];
const tips: Record<string, string> = {
  "Home & office decluttering": "Household, office or personal items you no longer need.",
  "Urgent distress sale": "An item that needs a faster sale because of an urgent need.",
  "Relocation / Japa clearance": "Items being sold because you are moving locally or abroad.",
  "Importer / container clearance": "Imported goods, container stock or clearance goods.",
  "Campus & NYSC clearance": "Student, graduate or service-year items being cleared out.",
  "Commercial business clearance": "Stock, equipment or furniture from a business clearance.",
  "Full home clearance": "Several household items being sold together during a full clearance.",
  "Repair, refurbish & resell": "An item repaired or restored before being offered for sale.",
  "Smart trade-in & upgrade": "A sale connected to replacing or upgrading an existing item.",
  "Agro products or handmade crafts": "Farm produce, processed goods or handmade products.",
  "Other item for sale": "Use only when another route does not accurately describe the item.",
  "Vehicles & machinery": "Cars, motorcycles, generators, equipment and other machines.",
  "Home & kitchen appliances": "Refrigerators, freezers, cookers and similar appliances.",
  "Household essentials & utensils": "Kitchenware, tools, storage and everyday essentials.",
  "Living room & electronics": "Televisions, sound systems and living-room electronics.",
  "Gadgets & computing": "Phones, laptops, tablets, computers and accessories.",
  "Furniture & interior decor": "Sofas, beds, desks, chairs, dining sets and decor.",
  "Fashion, toys & personal items": "Clothing, footwear, toys, bags and personal items.",
  "Imported clearance & excess stock": "Imported products, excess inventory or clearance lots.",
  "Agro products": "Crops, food produce and processed farm goods.",
  "Handmade crafts": "Locally made artwork, baskets, fashion and artisan products.",
  "Commercial equipment": "Office, restaurant, hotel, salon, shop and business equipment.",
  "Brand New": "Unused and not previously operated or owned by a customer.",
  "Open Box": "Opened packaging, but unused or lightly handled.",
  "Clean Fairly Used": "Used, clean, functional and accurately described.",
  "No": "The item has not been repaired or modified.",
  "Yes": "The item was repaired or modified; describe the work below.",
  "Pickup": "The buyer or an approved representative collects the item.",
  "Dispatch rider": "For smaller items that can be handled by a rider.",
  "Interstate waybill": "For sending items between states through a waybill service.",
  "Logistics company": "For larger, fragile or managed deliveries.",
  "Buyer-arranged logistics": "The buyer arranges delivery after Admin confirmation.",
  "Seller pays": "The seller covers the agreed delivery or escrow charge.",
  "Buyer pays": "The buyer covers the agreed delivery or escrow charge.",
  "50/50 shared": "The agreed charge is split equally between buyer and seller.",
};

type SelectProps = Omit<ComponentProps<typeof Dropdown>, "options"> & { options: string[] | readonly string[] };

function SelectField({ options, ...props }: SelectProps) {
  const routeField = props.name === "selling_route";
  const dropdownOptions = routeField ? routes.map(([value, label]) => ({ value, label })) : options.map((label) => ({ value: label, label }));
  const selectedValue = routeField ? routes.find(([id, label]) => id === props.value || label === props.value)?.[0] || props.value : props.value;
  const handleChange = routeField ? (value: string) => props.onChange?.(routes.find(([id]) => id === value)?.[1] || value) : props.onChange;
  return <Dropdown {...props} options={dropdownOptions} value={selectedValue} onChange={handleChange} tips={tips} compact />;
}

function Section({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return <section className="rounded-xl border border-[#dfe4ed] bg-white p-4 shadow-sm sm:p-5"><div className="border-b border-[#eef1f4] pb-3"><h2 className="font-[Manrope] text-base font-extrabold tracking-[-.04em] text-[#0b1830]">{title}</h2>{note && <p className="mt-1 text-[10px] leading-5 text-[#7d899d]">{note}</p>}</div><div className="mt-4">{children}</div></section>;
}

function MediaPicker({ label, name, accept, file, onChange, hint }: { label: string; name: string; accept: string; file: File | null; onChange: (file: File | null) => void; hint: string }) {
  return <label className="flex min-h-28 cursor-pointer flex-col justify-center rounded-lg border border-dashed border-[#b9c8dd] bg-[#f8fafc] px-4 py-4 hover:border-[#1453bb]"><span className="text-xs font-extrabold text-[#1453bb]">{label}</span><small className="mt-1 text-[10px] leading-4 text-[#8490a4]">{file ? file.name : hint}</small><input className="sr-only" name={name} type="file" accept={accept} onChange={(event) => onChange(event.currentTarget.files?.[0] || null)} /></label>;
}

function collectValues(form: HTMLFormElement, action: "draft" | "submit", photo: File | null, video: File | null, additionalItems: BulkListingItem[]): ListingFormValues {
  const values: ListingFormValues = { action };
  new FormData(form).forEach((value, key) => {
    if (typeof value === "string") values[key] = value;
    else if (value.size > 0) values[key] = value;
  });
  if (photo) values.photo = photo;
  if (video) values.video = video;
  values.additional_items = JSON.stringify(additionalItems.map(({ name, category, quantity, price }) => ({ item_name: name, category, quantity, unit_price: price })));
  return values;
}

function receiptFor(listing: Listing): OrderCopyDetails {
  return {
    title: "Hollyway listing receipt", reference: listing.reference, status: listing.status_label,
    createdAt: new Date(listing.created_at).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" }),
    fields: [
      { label: "Listing code", value: listing.reference }, { label: "Selling route", value: listing.selling_route },
      { label: "Item", value: listing.item_name || "Not provided" }, { label: "Category", value: listing.category || "Not provided" },
      { label: "Additional items", value: listing.additional_items.length ? listing.additional_items.map((item) => `${item.item_name} × ${item.quantity}`).join(", ") : "None" },
      { label: "Location", value: [listing.area, listing.city, listing.state].filter(Boolean).join(", ") || "Not provided" },
      { label: "Selling price", value: formatListingMoney(listing.unit_price_minor) },
    ],
    note: listing.status === "draft" ? "This listing is private and remains a Draft until the account requirements are complete. Hollyway has not published it or requested payment." : "This listing has been submitted for Hollyway review. Keep the reference for support; do not pay anyone outside official Hollyway instructions.",
  };
}

function hydrateListingForm(form: HTMLFormElement, listing: Listing) {
  const values: Record<string, string> = {
    item_name: listing.item_name,
    brand: listing.brand,
    model_specifications: listing.model_specifications,
    year: listing.year ? String(listing.year) : "",
    quantity: String(listing.quantity || 1),
    unit: listing.unit,
    unit_price: listing.unit_price_minor === null ? "" : String(listing.unit_price_minor / 100),
    bulk_price: listing.bulk_price_minor === null ? "" : String(listing.bulk_price_minor / 100),
    area: listing.area,
    city: listing.city,
    state: listing.state,
    item_source: listing.item_source,
    repair_details: listing.repair_details,
    ownership_reason: listing.ownership_reason,
    proof_type: listing.proof_type,
    description: listing.description,
  };
  Object.entries(values).forEach(([name, value]) => {
    const field = form.elements.namedItem(name);
    if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) field.value = value;
  });
  const sellingRoute = routes.find(([id, label]) => id === listing.selling_route || label === listing.selling_route);
  const dropdowns: Record<string, string> = {
    selling_route: sellingRoute?.[0] || listing.selling_route,
    category: listing.category,
    condition: listing.condition,
    repaired_before: listing.repaired_before,
    proof_available: listing.proof_available,
    preferred_delivery_method: listing.preferred_delivery_method,
    delivery_fee_coverage: listing.delivery_fee_coverage,
    escrow_fee_coverage: listing.escrow_fee_coverage,
  };
  const labels: Record<string, string> = {
    selling_route: sellingRoute?.[1] || listing.selling_route,
    category: listing.category,
    condition: listing.condition,
    repaired_before: listing.repaired_before,
    proof_available: listing.proof_available,
    preferred_delivery_method: listing.preferred_delivery_method,
    delivery_fee_coverage: listing.delivery_fee_coverage,
    escrow_fee_coverage: listing.escrow_fee_coverage,
  };
  Object.entries(dropdowns).forEach(([name, value]) => {
    const field = form.elements.namedItem(name);
    if (!(field instanceof HTMLInputElement)) return;
    field.value = value;
    const label = field.parentElement?.querySelector("button > span");
    if (label) label.textContent = labels[name] || "Select an option";
  });
  const terms = form.elements.namedItem("terms_accepted");
  if (terms instanceof HTMLInputElement) terms.checked = Boolean(listing.terms_accepted_at);
}

export default function UnifiedListingPage() {
  const searchParams = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);
  const requestedRoute = searchParams.get("listingType") || "declutter";
  const initialRoute = routes.some(([id]) => id === requestedRoute) ? requestedRoute : "declutter";
  const [route, setRoute] = useState(initialRoute);
  const [category, setCategory] = useState("");
  const [featuredPackage, setFeaturedPackage] = useState<FeaturedPostPackage>("none");
  const [photo, setPhoto] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [additionalItems, setAdditionalItems] = useState<BulkListingItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [draftSaved, setDraftSaved] = useState(false);
  const [saved, setSaved] = useState<Listing | null>(null);
  const [savedAction, setSavedAction] = useState<"draft" | "submit">("draft");
  const editingReference = searchParams.get("reference")?.trim() || "";
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [editingLoading, setEditingLoading] = useState(Boolean(editingReference));

  useEffect(() => { setRoute(initialRoute); }, [initialRoute]);

  useEffect(() => {
    if (!editingReference) { setEditingListing(null); setEditingLoading(false); return; }
    let active = true;
    setEditingLoading(true);
    fetchListing(editingReference).then((listing) => {
      if (!active) return;
      setEditingListing(listing);
      setRoute(routeId(listing.selling_route, initialRoute));
      setCategory(listing.category);
      setAdditionalItems(listing.additional_items.map((item) => ({ id: item.id, name: item.item_name, category: item.category, quantity: String(item.quantity), price: item.unit_price_minor === null ? "" : String(item.unit_price_minor / 100) })));
      setFeaturedPackage(isFeaturedPackageId(listing.visibility_package) ? listing.visibility_package : "none");
      setEditingLoading(false);
    }).catch((reason) => {
      if (!active) return;
      setError(reason instanceof ApiResponseError ? reason.message : "This listing could not be loaded for editing.");
      setEditingLoading(false);
    });
    return () => { active = false; };
  }, [editingReference, initialRoute]);

  useEffect(() => {
    if (!editingListing) return;
    const frame = window.requestAnimationFrame(() => {
      if (formRef.current) hydrateListingForm(formRef.current, editingListing);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [editingListing]);

  async function persist(action: "draft" | "submit") {
    const form = formRef.current;
    if (!form) return;
    setBusy(true); setError("");
    try {
      const listing = await saveListing(collectValues(form, action, photo, video, additionalItems));
      setSaved(listing); setSavedAction(action); setDraftSaved(action === "draft");
    } catch (reason) {
      setError(reason instanceof ApiResponseError ? reason.message : "The listing could not be saved. Please try again.");
    } finally { setBusy(false); }
  }

  if (editingLoading) return <div className="grid min-h-56 place-items-center p-6 text-xs font-semibold text-[#687895]">Loading your Draft…</div>;

  if (saved) {
    const draft = saved.status === "draft";
    return <div className="mx-auto max-w-[760px] space-y-4 p-4 sm:p-8"><section className="rounded-xl border border-[#bfe5d0] bg-[#f5fcf7] p-6 text-center shadow-sm"><span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-[#20bd61] text-lg font-extrabold text-white">✓</span><h1 className="mt-4 font-[Manrope] text-xl font-extrabold tracking-[-.05em] text-[#0b1830]">{draft ? "Listing saved as Draft" : "Listing submitted for review"}</h1><p className="mt-2 text-xs font-extrabold tracking-[.12em] text-[#1453bb]">LISTING CODE: {saved.reference}</p><p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#53627a]">{draft ? (savedAction === "submit" ? "Your listing is private because identity verification is not complete. You can return to finish it later." : "Your listing is private and can be continued from My listings.") : "Hollyway received your listing. Admin review is required before it is published."}</p><OrderCopyActions copy={receiptFor(saved)} /><WalletPromotionPaymentButton targetType="listing" reference={saved.reference} packageId={saved.visibility_package} paymentStatus={saved.featured_payment_status} onPaid={() => setSaved({ ...saved, featured_payment_status: "paid" })} /><div className="mt-6 flex flex-wrap justify-center gap-3"><Link className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1453bb] px-4 text-xs font-extrabold text-white" href="/dashboard/listings">View my listings <Arrow /></Link><Link className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#cbd5e1] px-4 text-xs font-extrabold text-[#1453bb]" href="/dashboard/marketplace">Browse marketplace <Arrow /></Link></div></section></div>;
  }

  return <div className="w-full space-y-4 p-4 sm:p-6"><CommercePageHeader compact kicker="SELL AN ITEM / POST INVENTORY" title="List an item" description="Use one listing form for decluttering, urgent sales, relocation clearance, imported stock, business clearance, agro products and crafts." action={<Link className="inline-flex items-center gap-2 text-xs font-extrabold text-[#1453bb] hover:underline" href="/dashboard/listings">Back to my listings <Arrow /></Link>} /><DraftStatusNotice contentType="listing" saved={draftSaved} />{error && <p className="rounded-lg border border-[#f3c4c4] bg-[#fff5f5] px-4 py-3 text-xs font-semibold text-[#a32929]" role="alert">{error}</p>}<form ref={formRef} className="space-y-4" onSubmit={(event: FormEvent<HTMLFormElement>) => { event.preventDefault(); void persist("submit"); }}><Section title="Selling route and category" note="Choose the route and category that best explain what you are selling. The seller account is taken from your Hollyway account."><div className="grid gap-4 sm:grid-cols-2"><SelectField label="Selling route" name="selling_route" options={routes.map(([, label]) => label)} value={routes.find(([id]) => id === route)?.[1]} onChange={(value) => setRoute(routes.find(([, label]) => label === value)?.[0] || "other")} /><SelectField label="Item category" name="category" options={categories} value={category} onChange={setCategory} /></div></Section><Section title="Item details" note="Add the information a buyer needs to understand the item. Brand, model and year are optional when they do not apply."><div className="grid gap-4 sm:grid-cols-2"><CommerceField compact label="Item name" name="item_name" placeholder="Item name or description" /><CommerceField compact label="Brand (optional)" name="brand" placeholder="Brand name" required={false} /><CommerceField compact label="Model or specifications (optional)" name="model_specifications" placeholder="Model, size, type or key specification" required={false} /><CommerceField compact label="Year (optional)" name="year" placeholder="Year" required={false} inputMode="numeric" /><CommerceField compact label="Available quantity" name="quantity" type="number" placeholder="1" /><CommerceField compact label="Unit of sale (optional)" name="unit" placeholder="piece, bag, tonne or lot" required={false} /><CommerceField compact label="Selling price per unit (₦)" name="unit_price" type="number" placeholder="0" /><CommerceField compact label="Bulk price (₦, if applicable)" name="bulk_price" type="number" placeholder="Optional" required={false} /></div></Section><BulkListingItems items={additionalItems} onChange={setAdditionalItems} /><Section title="Location, condition and ownership" note="Use the small helper text under each choice to select the option that matches this item."><div className="grid gap-4 sm:grid-cols-3"><CommerceField compact label="Area" name="area" placeholder="Neighbourhood or area" /><CommerceField compact label="City" name="city" placeholder="City" /><CommerceField compact label="State" name="state" placeholder="State" /><SelectField label="Condition" name="condition" options={["Brand New", "Open Box", "Clean Fairly Used"]} /><CommerceField compact label="Item source (optional)" name="item_source" placeholder="Where the item came from" required={false} /><SelectField label="Repaired before?" name="repaired_before" options={["No", "Yes"]} required={false} /></div><div className="mt-4 grid gap-4 sm:grid-cols-2"><CommerceField compact label="Repair history and details (optional)" name="repair_details" placeholder="State whether it was repaired and describe the work." required={false} /><CommerceField compact label="Ownership status and reason for selling (optional)" name="ownership_reason" placeholder="Explain ownership and why you are selling." required={false} /></div></Section><Section title="Proof, delivery and transaction terms" note="These choices help Hollyway coordinate the next step. Delivery and escrow charges are confirmed before payment."><div className="grid gap-4 sm:grid-cols-2"><SelectField label="Proof of purchase available?" name="proof_available" options={["Yes", "No"]} required={false} /><CommerceField compact label="Type of proof (optional)" name="proof_type" placeholder="Receipt, invoice, waybill or other" required={false} /><SelectField label="Preferred delivery method (optional)" name="preferred_delivery_method" options={["Pickup", "Dispatch rider", "Interstate waybill", "Logistics company", "Buyer-arranged logistics"]} required={false} /><SelectField label="Delivery fee coverage (optional)" name="delivery_fee_coverage" options={["Seller pays", "Buyer pays", "50/50 shared"]} required={false} /><SelectField label="Escrow fee coverage (optional)" name="escrow_fee_coverage" options={["Seller pays", "Buyer pays", "50/50 shared"]} required={false} /></div></Section><Section title="Description and live media" note="A clear live photo and working product video are required when you publish for review. Drafts can be saved before media is ready."><label className="grid gap-1.5 text-[11px] font-extrabold text-[#31425e]"><span>Description</span><small className="text-[10px] font-medium leading-4 text-[#8995a8]">Describe what is included, the condition and any important buyer notes.</small><textarea className="min-h-28 rounded-lg border border-[#dfe4ed] bg-white px-3 py-3 text-xs font-medium text-[#0b1830] outline-none placeholder:text-[#9aa6b7] focus:border-[#1453bb] focus:ring-4 focus:ring-[#1453bb]/10" name="description" placeholder="Add the details a buyer should know." /></label><div className="mt-4 grid gap-3 sm:grid-cols-2"><MediaPicker label="Add one product photo" name="photo" accept="image/jpeg,image/png,image/webp" file={photo} onChange={setPhoto} hint="JPG, PNG or WEBP · maximum 10 MB" /><MediaPicker label="Add one working product video" name="video" accept="video/mp4,video/quicktime,video/webm" file={video} onChange={setVideo} hint="MP4, MOV or WEBM · maximum 50 MB" /></div></Section><FeaturedPostSelector contentType="listing" value={featuredPackage} onChange={(event) => setFeaturedPackage(event.currentTarget.value as FeaturedPostPackage)} /><label className="flex items-start gap-2 rounded-lg border border-[#dfe4ed] bg-white p-4 text-xs leading-5 text-[#53627a]"><input className="mt-1 accent-[#1453bb]" name="terms_accepted" type="checkbox" value="true" required />I confirm these listing details are accurate and agree to Hollyway terms and privacy notice.</label><input name="visibility_package" type="hidden" value={featuredPackage} /><div className="flex flex-wrap justify-end gap-3"><Link className="inline-flex h-10 items-center rounded-lg border border-[#dfe4ed] px-4 text-xs font-extrabold text-[#53627a]" href="/dashboard/listings">Cancel</Link><button className="inline-flex h-10 items-center rounded-lg border border-[#1453bb] px-4 text-xs font-extrabold text-[#1453bb] disabled:cursor-wait disabled:opacity-60" disabled={busy} type="button" onClick={() => void persist("draft")}>{busy ? "Saving…" : "Save as draft"}</button><button className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1453bb] px-5 text-xs font-extrabold text-white disabled:cursor-wait disabled:opacity-60" disabled={busy} type="submit">{busy ? "Sending…" : "Publish & get receipt"} <Arrow /></button></div></form></div>;
}
