"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, type ComponentProps, type FormEvent, type ReactNode } from "react";
import { Arrow } from "../../../components/ui/Arrow";
import CommerceFieldBase from "../components/CommerceField";
import CommercePageHeader from "../components/CommercePageHeader";
import DraftStatusNotice from "../components/DraftStatusNotice";
import FeaturedPostSelector, { getFeaturedPostPackage, type FeaturedPostPackage } from "../components/FeaturedPostSelector";
import OrderCopyActions, { createOrderReference, type OrderCopyDetails } from "../components/OrderCopyActions";
import { getDraftValues, saveUserDraft } from "../../dashboard/data/drafts";

const inputClass = "h-11 rounded-lg border border-[#dfe4ed] bg-white px-3 text-xs font-medium text-[#0b1830] outline-none focus:border-[#1453bb] focus:ring-4 focus:ring-[#1453bb]/10";
const labelClass = "grid gap-2 text-[11px] font-extrabold text-[#31425e]";

const sellingRoutes = [
  ["declutter", "Home & office decluttering"],
  ["distress", "Urgent distress sale"],
  ["relocation", "Relocation / Japa clearance"],
  ["importer", "Importer / container clearance"],
  ["campus", "Campus & NYSC clearance"],
  ["commercial", "Commercial business clearance"],
  ["estate", "Estate buyout"],
  ["repair", "Repair, refurbish & resell"],
  ["trade-in", "Smart trade-in & upgrade"],
  ["agro-crafts", "Agro products or handmade crafts"],
  ["other", "Other item for sale"],
] as const;

const itemCategories = [
  "Vehicles & machinery",
  "Home & kitchen appliances",
  "Household essentials & utensils",
  "Living room & electronics",
  "Gadgets & computing",
  "Furniture & interior decor",
  "Fashion, toys & personal items",
  "Imported clearance & excess stock",
  "Agro products",
  "Handmade crafts",
  "Commercial equipment",
  "Other",
];

function SelectField({ label, name, children, value, onChange, required = true }: { label: string; name: string; children: ReactNode; value?: string; onChange?: (value: string) => void; required?: boolean }) {
  return <label className={labelClass}><span>{label}</span><select className={inputClass} name={name} value={value} onChange={onChange ? (event) => onChange(event.target.value) : undefined} defaultValue={value ? undefined : ""} required={required}><option value="" disabled>Select an option</option>{children}</select></label>;
}

function TextAreaField({ label, name, placeholder, required = true }: { label: string; name: string; placeholder: string; required?: boolean }) {
  return <label className={labelClass}><span>{label}</span><textarea className="min-h-24 rounded-lg border border-[#dfe4ed] bg-white px-3 py-3 text-xs font-medium text-[#0b1830] outline-none placeholder:text-[#9aa6b7] focus:border-[#1453bb] focus:ring-4 focus:ring-[#1453bb]/10" name={name} placeholder={placeholder} required={required} /></label>;
}

function CommerceField(props: ComponentProps<typeof CommerceFieldBase>) {
  return <CommerceFieldBase {...props} compact />;
}

function MediaField({ label, name, accept, hint, multiple = false }: { label: string; name: string; accept: string; hint: string; multiple?: boolean }) {
  return <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#b9c8dd] bg-[#f8fafc] p-5 text-center hover:border-[#1453bb]"><span className="text-sm font-extrabold text-[#1453bb]">{label}</span><small className="mt-2 text-[10px] text-[#8490a4]">{hint}</small><input className="sr-only" name={name} type="file" accept={accept} multiple={multiple} required /></label>;
}

export default function UnifiedListingPage() {
  const searchParams = useSearchParams();
  const requestedRoute = searchParams.get("listingType");
  const initialRoute = sellingRoutes.some(([id]) => id === requestedRoute) ? requestedRoute! : "declutter";
  const [listingType, setListingType] = useState(initialRoute);
  const [featuredPackage, setFeaturedPackage] = useState<FeaturedPostPackage>("none");
  const [submitted, setSubmitted] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [draftReference, setDraftReference] = useState("");
  const [orderCopy, setOrderCopy] = useState<OrderCopyDetails | null>(null);
  const selectedPackage = getFeaturedPostPackage(featuredPackage);
  const routeLabel = sellingRoutes.find(([id]) => id === listingType)?.[1] || "Item for sale";
  const needsClearanceDetails = ["commercial", "estate"].includes(listingType);
  const needsAgroDetails = listingType === "agro-crafts";
  const needsTradeInDetails = listingType === "trade-in";

  function getReference() {
    const reference = draftReference || createOrderReference("HWG");
    if (!draftReference) setDraftReference(reference);
    return reference;
  }

  function saveDraft(form: HTMLFormElement) {
    saveUserDraft("listing", { reference: getReference(), values: getDraftValues(form), featuredPostPackage: selectedPackage.id, featuredPostAmount: selectedPackage.amount });
    setDraftSaved(true);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const reference = getReference();
    const createdAt = new Date().toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" });
    const value = (name: string) => String(values.get(name) || "Not provided");
    saveUserDraft("listing", { reference, values: getDraftValues(form), featuredPostPackage: selectedPackage.id, featuredPostAmount: selectedPackage.amount });
    setOrderCopy({ title: "Listing submission", reference, status: "DRAFT", createdAt, fields: [{ label: "Selling route", value: routeLabel }, { label: "Item", value: value("itemName") }, { label: "Category", value: value("itemCategory") }, { label: "Seller", value: value("sellerName") }, { label: "Location", value: `${value("area")}, ${value("city")}, ${value("state")}` }, { label: "Selling price", value: `₦${value("unitPrice")}` }, { label: "Featured post", value: selectedPackage.amount ? `${selectedPackage.name} · ₦${selectedPackage.amount.toLocaleString("en-NG")}` : "No paid promotion" }], note: "This listing is saved as a Draft. Complete KYC and wait for Hollyway Admin review before publication. Any selected feature fee remains pending until the official payment step is provided." });
    setSubmitted(true);
  }

  if (submitted && orderCopy) return <div className="mx-auto max-w-[760px] p-5 sm:p-8"><section className="rounded-2xl border border-[#bfe5d0] bg-[#f5fcf7] p-8 text-center shadow-sm"><span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#20bd61] text-xl font-extrabold text-white">✓</span><h2 className="mt-5 font-[Manrope] text-2xl font-extrabold tracking-[-.05em] text-[#0b1830]">Listing saved as Draft</h2><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#53627a]">Your {routeLabel.toLowerCase()} details, product photo and working video are saved locally. {selectedPackage.amount ? `Your ${selectedPackage.name.toLowerCase()} request (₦${selectedPackage.amount.toLocaleString("en-NG")}) is recorded with the draft.` : "No paid feature was selected."} Complete KYC before Hollyway Admin can review and publish it.</p><OrderCopyActions copy={orderCopy} /><div className="mt-7 flex flex-wrap justify-center gap-3"><Link className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#1453bb] px-4 text-xs font-extrabold text-white" href="/dashboard/listings">View my listings <Arrow /></Link><Link className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#cbd5e1] px-4 text-xs font-extrabold text-[#1453bb]" href="/dashboard/marketplace">Browse marketplace <Arrow /></Link></div></section></div>;

  return <div className="mx-auto max-w-[1100px] space-y-6 p-5 sm:p-8"><CommercePageHeader kicker="SELL AN ITEM / POST INVENTORY" title="List anything you want to sell." description="Choose the selling route and item category that fit your situation. The same listing form supports decluttering, distress sales, relocation, imports, business clearance, agro products and crafts." action={<Link className="inline-flex h-11 items-center gap-2 text-xs font-extrabold text-[#1453bb] hover:underline" href="/dashboard/listings">Back to my listings <Arrow /></Link>} /><DraftStatusNotice contentType="listing" saved={draftSaved} /><div className="grid gap-3 rounded-xl border border-[#dfe4ed] bg-white p-4 text-[10px] font-extrabold text-[#53627a] sm:grid-cols-4"><span className="text-[#1453bb]">01 · Selling route</span><span>02 · Item details</span><span>03 · Terms &amp; location</span><span>04 · Media &amp; review</span></div><form className="space-y-6" onSubmit={submit}><section className="rounded-xl border border-[#dfe4ed] bg-white p-6 shadow-sm"><h3 className="font-[Manrope] text-lg font-extrabold tracking-[-.04em] text-[#0b1830]">Seller or importer details</h3><div className="mt-5 grid gap-4 sm:grid-cols-2"><CommerceField label="Seller or importer full name / business name" name="sellerName" placeholder="Your name or registered business" /><CommerceField label="Email address" name="email" type="email" placeholder="you@example.com" /><CommerceField label="Primary phone number" name="phone" type="tel" placeholder="International number" /><CommerceField label="Referral partner code (optional)" name="referralCode" placeholder="HWP-001" required={false} /></div></section><section className="rounded-xl border border-[#dfe4ed] bg-white p-6 shadow-sm"><h3 className="font-[Manrope] text-lg font-extrabold tracking-[-.04em] text-[#0b1830]">What are you listing?</h3><div className="mt-5 grid gap-4 sm:grid-cols-2"><SelectField label="Selling route" name="listingType" value={listingType} onChange={setListingType}>{sellingRoutes.map(([id, label]) => <option key={id} value={id}>{label}</option>)}</SelectField><SelectField label="Item category" name="itemCategory"><>{itemCategories.map((category) => <option key={category}>{category}</option>)}</></SelectField></div><p className="mt-4 rounded-lg bg-[#f4f8ff] p-3 text-xs leading-5 text-[#53627a]">Selected route: <strong className="text-[#1453bb]">{routeLabel}</strong>. Your listing remains a Draft until KYC and Hollyway Admin review are complete.</p></section><section className="rounded-xl border border-[#dfe4ed] bg-white p-6 shadow-sm"><h3 className="font-[Manrope] text-lg font-extrabold tracking-[-.04em] text-[#0b1830]">Item details</h3><div className="mt-5 grid gap-4 sm:grid-cols-2"><CommerceField label="Item name" name="itemName" placeholder="e.g. Samsung 55-inch Smart TV, bags of rice or sofa set" /><CommerceField label="Brand (optional)" name="brand" placeholder="Brand name" required={false} /><CommerceField label="Model or specifications (optional)" name="model" placeholder="Model, size, type or key specification" required={false} /><CommerceField label="Year (optional)" name="year" type="number" placeholder="e.g. 2022" required={false} /><SelectField label="Available quantity" name="quantityType"><option>Single item</option><option>Bulk commercial lot</option></SelectField><CommerceField label="Quantity available" name="quantity" type="number" placeholder="1" /><CommerceField label="Unit of sale (optional)" name="unit" placeholder="e.g. piece, bag, tonne, lot" required={false} /><CommerceField label="Selling price per unit (₦)" name="unitPrice" type="number" placeholder="0" /><CommerceField label="Bulk price (₦, if applicable)" name="bulkPrice" type="number" placeholder="Optional" required={false} /></div>{needsAgroDetails && <div className="mt-5 grid gap-4 border-t border-[#eef1f4] pt-5 sm:grid-cols-2"><CommerceField label="Farm, depot or workshop address" name="loadingAddress" placeholder="Full loading or collection address" /><SelectField label="Waybill or loading point option" name="loadingOption"><option>Pickup from farm</option><option>Pickup from depot</option><option>Pickup from workshop</option><option>Nationwide waybill</option><option>Buyer-arranged logistics</option></SelectField><TextAreaField label="Product or craft details" name="agroCraftDetails" placeholder="Describe the produce, materials, finish, quantity or artisan details." /></div>}{needsTradeInDetails && <div className="mt-5 border-t border-[#eef1f4] pt-5"><TextAreaField label="Desired upgrade or trade-in details" name="tradeInDetails" placeholder="Tell Hollyway what model, item or upgrade you want to move toward." /></div>}</section><section className="rounded-xl border border-[#dfe4ed] bg-white p-6 shadow-sm"><h3 className="font-[Manrope] text-lg font-extrabold tracking-[-.04em] text-[#0b1830]">Location, condition and ownership</h3><div className="mt-5 grid gap-4 sm:grid-cols-2"><CommerceField label="Area" name="area" placeholder="Neighbourhood or area" /><CommerceField label="City" name="city" placeholder="e.g. Ikeja" /><CommerceField label="State" name="state" placeholder="e.g. Lagos" /><SelectField label="Condition" name="condition"><option>Brand New</option><option>Open Box</option><option>Clean Fairly Used</option></SelectField><CommerceField label="Item source" name="source" placeholder="Where the item came from" required={false} /><SelectField label="Repaired before?" name="repaired"><option>No</option><option>Yes</option></SelectField></div><div className="mt-4 grid gap-4 sm:grid-cols-2"><TextAreaField label="Repair history and details" name="repairDetails" placeholder="State whether it was repaired and describe the work." required={false} /><TextAreaField label="Ownership status and reason for selling" name="ownershipReason" placeholder="Explain ownership and why you are selling." /></div>{needsClearanceDetails && <div className="mt-4 grid gap-4 border-t border-[#eef1f4] pt-4 sm:grid-cols-2"><SelectField label="Clearance category" name="clearanceCategory"><option>Complete estate</option><option>Restaurant</option><option>Office</option><option>Supermarket</option><option>Hotel</option><option>Gym</option><option>Salon</option></SelectField><CommerceField label="Desired vacate deadline" name="vacateDeadline" type="date" /><CommerceField label="Estimated minimum lump-sum value (₦)" name="lumpSumValue" type="number" placeholder="0" /><TextAreaField label="Reason for clearance" name="clearanceReason" placeholder="Relocation abroad, business closure, facility upgrade or another reason." /></div>}</section><section className="rounded-xl border border-[#dfe4ed] bg-white p-6 shadow-sm"><h3 className="font-[Manrope] text-lg font-extrabold tracking-[-.04em] text-[#0b1830]">Proof, delivery and escrow terms</h3><div className="mt-5 grid gap-4 sm:grid-cols-2"><SelectField label="Proof of purchase available?" name="proofAvailable"><option>Yes</option><option>No</option></SelectField><CommerceField label="Type of proof (if available)" name="proofType" placeholder="Receipt, invoice, waybill or other" required={false} /><SelectField label="Preferred delivery method" name="deliveryMethod"><option>Dispatch rider</option><option>Interstate waybill</option><option>Logistics company</option><option>Bulk minibus</option><option>Pickup</option></SelectField><SelectField label="Delivery fee coverage" name="deliveryFee"><option>Seller pays</option><option>Buyer pays</option><option>50/50 shared</option></SelectField><SelectField label="Escrow fee coverage" name="escrowFee"><option>Seller pays</option><option>Buyer pays</option><option>50/50 shared</option></SelectField></div><div className="mt-4 grid gap-4 sm:grid-cols-3"><CommerceField label="Settlement bank" name="bankName" placeholder="Bank name" /><CommerceField label="Account number" name="accountNumber" inputMode="numeric" placeholder="Account number" /><CommerceField label="Account name" name="accountName" placeholder="Name on account" /></div></section><section className="rounded-xl border border-[#dfe4ed] bg-white p-6 shadow-sm"><h3 className="font-[Manrope] text-lg font-extrabold tracking-[-.04em] text-[#0b1830]">Listing description and media</h3><TextAreaField label="Description" name="description" placeholder="Describe the item, what is included, condition and any important buyer notes." /><p className="mt-4 text-xs leading-5 text-[#53627a]">Attach one clear live product photo and one clear live working product video for Admin review.</p><div className="mt-4 grid gap-4 sm:grid-cols-2"><MediaField label="Add one live product photo" name="photo" accept="image/*" hint="JPG, PNG or WEBP" /><MediaField label="Add one working product video" name="video" accept="video/mp4,video/quicktime,video/webm" hint="MP4, MOV or WEBM" /></div></section><FeaturedPostSelector contentType="listing" value={featuredPackage} onChange={(event) => setFeaturedPackage(event.target.value as FeaturedPostPackage)} /><label className="flex items-start gap-2 text-xs leading-5 text-[#53627a]"><input className="mt-1 accent-[#1453bb]" type="checkbox" required />I confirm these listing details are accurate and agree to Hollyway terms and privacy notice.</label><div className="flex flex-wrap justify-end gap-3"><Link className="inline-flex h-11 items-center rounded-lg border border-[#dfe4ed] px-4 text-xs font-extrabold text-[#53627a]" href="/dashboard/listings">Cancel</Link><button className="inline-flex h-11 items-center rounded-lg border border-[#1453bb] px-4 text-xs font-extrabold text-[#1453bb]" type="button" onClick={(event) => event.currentTarget.form && saveDraft(event.currentTarget.form)}>Save as draft</button><button className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#1453bb] px-5 text-xs font-extrabold text-white hover:bg-[#0b3f91]" type="submit">Save &amp; get PDF copy <Arrow /></button></div></form></div>;
}
