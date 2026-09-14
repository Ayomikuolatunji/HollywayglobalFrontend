"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, type ComponentProps, type FormEvent, type ReactNode } from "react";
import { Arrow } from "../../../components/ui/Arrow";
import Dropdown, { dropdownOptionsFromChildren } from "../../../components/forms/Dropdown";
import CommerceFieldBase from "../components/CommerceField";
import CommercePageHeader from "../components/CommercePageHeader";
import BulkListingItems from "../components/BulkListingItems";
import ListingCodeNotice from "../components/ListingCodeNotice";
import DraftStatusNotice from "../components/DraftStatusNotice";
import FeaturedPostSelector, { getFeaturedPostPackage, type FeaturedPostPackage } from "../components/FeaturedPostSelector";
import OrderCopyActions, { createOrderReference, type OrderCopyDetails } from "../components/OrderCopyActions";
import { getDraftValues, saveUserDraft } from "../../dashboard/data/drafts";
import { reserveListingCode } from "../data/listingCode";

const inputClass = "h-11 rounded-lg border border-[#dfe4ed] bg-white px-3 text-xs font-medium text-[#0b1830] outline-none focus:border-[#1453bb] focus:ring-4 focus:ring-[#1453bb]/10";
const labelClass = "grid gap-2 text-[11px] font-extrabold text-[#31425e]";

const sellingRoutes = [
  ["declutter", "Home & office decluttering"],
  ["distress", "Urgent distress sale"],
  ["relocation", "Relocation / Japa clearance"],
  ["importer", "Importer / container clearance"],
  ["campus", "Campus & NYSC clearance"],
  ["commercial", "Commercial business clearance"],
  ["estate", "Full home clearance"],
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

const dropdownTips: Record<string, string> = {
  "Home & office decluttering": "Use this for household, office or personal items you no longer need.",
  "Urgent distress sale": "Use this when the item needs a faster sale because of an urgent financial or personal need.",
  "Relocation / Japa clearance": "Use this for items being sold because you are moving locally or abroad.",
  "Importer / container clearance": "Use this for imported goods, container stock or items awaiting clearance and sale.",
  "Campus & NYSC clearance": "Use this for student, graduate or service-year items being cleared out.",
  "Commercial business clearance": "Use this for stock, equipment or furniture from a business clearance.",
  "Full home clearance": "Use this when selling several household items together during a full home clearance.",
  "Repair, refurbish & resell": "Use this for repaired, refurbished or restored items being offered for sale.",
  "Smart trade-in & upgrade": "Use this when the sale is connected to replacing or upgrading an existing item.",
  "Agro products or handmade crafts": "Use this for farm produce, processed goods or handmade artisan products.",
  "Other item for sale": "Use this when no other selling route accurately describes the item.",
  "Vehicles & machinery": "Cars, motorcycles, generators, heavy equipment and other machines.",
  "Home & kitchen appliances": "Refrigerators, freezers, cookers, air conditioners and similar appliances.",
  "Household essentials & utensils": "Kitchenware, household tools, storage items and everyday essentials.",
  "Living room & electronics": "Televisions, sound systems and living-room electronics.",
  "Gadgets & computing": "Phones, laptops, tablets, computers and related accessories.",
  "Furniture & interior decor": "Sofas, beds, desks, chairs, dining sets and decorative items.",
  "Fashion, toys & personal items": "Clothing, footwear, toys, bags and personal-use items.",
  "Imported clearance & excess stock": "Imported products, excess inventory, container stock or clearance lots.",
  "Agro products": "Crops, food produce, livestock-related products and processed farm goods.",
  "Handmade crafts": "Locally made artwork, baskets, furniture, fashion and artisan products.",
  "Commercial equipment": "Office, restaurant, hotel, salon, shop and other business equipment.",
  "Other": "Choose this when the item does not fit the listed categories.",
  "Single item": "Choose this when you are selling one unit of the item.",
  "Bulk commercial lot": "Choose this when several units are being sold together as one lot.",
  "Brand New": "The item is unused and has not been previously operated or owned by a customer.",
  "Open Box": "The packaging was opened, but the item is unused or lightly handled.",
  "Clean Fairly Used": "The item has been used and remains clean, functional and accurately described.",
  "No": "Choose this when the item has not been repaired or modified.",
  "Yes": "Choose this when the item has had a repair or modification; add the details below.",
  "Pickup from farm": "The buyer or approved logistics partner collects directly from the farm.",
  "Pickup from depot": "The item is collected from the seller's depot or storage location.",
  "Pickup from workshop": "The item is collected from the workshop or production location.",
  "Nationwide waybill": "The item can be sent through an interstate waybill service.",
  "Buyer-arranged logistics": "The buyer will arrange the delivery provider after Admin confirmation.",
  "Restaurant": "Use this for restaurant furniture, kitchen equipment or stock.",
  "Office": "Use this for office furniture, electronics or business equipment.",
  "Supermarket": "Use this for supermarket fixtures, shelves, stock or equipment.",
  "Hotel": "Use this for hotel furniture, appliances, fittings or equipment.",
  "Gym": "Use this for gym machines, weights and fitness equipment.",
  "Salon": "Use this for salon furniture, beauty equipment and supplies.",
  "Proof of purchase available?": "Select whether you have a receipt, invoice, waybill or other ownership proof.",
  "Preferred delivery method": "Choose the delivery route that best suits the item's size and destination.",
  "Dispatch rider": "Suitable for smaller items that can be handled by a rider.",
  "Interstate waybill": "Suitable for sending items between states through a waybill service.",
  "Logistics company": "Use a logistics company for larger, fragile or managed deliveries.",
  "Bulk minibus": "Suitable for grouped items or stock moving together.",
  "Pickup": "The buyer or an approved representative collects the item.",
  "Seller pays": "The seller covers the agreed delivery or escrow charge after confirmation.",
  "Buyer pays": "The buyer covers the agreed delivery or escrow charge after confirmation.",
  "50/50 shared": "The agreed charge is split equally between buyer and seller.",
};

function SelectField({ label, name, children, value, onChange, required = true }: { label: string; name: string; children: ReactNode; value?: string; onChange?: (value: string) => void; required?: boolean }) {
  return <Dropdown label={label} name={name} options={dropdownOptionsFromChildren(children)} value={value} onChange={onChange} tips={dropdownTips} required={required} />;
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
  const [listingCode, setListingCode] = useState("");
  const [orderCopy, setOrderCopy] = useState<OrderCopyDetails | null>(null);
  const selectedPackage = getFeaturedPostPackage(featuredPackage);
  const routeLabel = sellingRoutes.find(([id]) => id === listingType)?.[1] || "Item for sale";
  const needsClearanceDetails = ["commercial", "estate"].includes(listingType);
  const needsAgroDetails = listingType === "agro-crafts";
  const needsTradeInDetails = listingType === "trade-in";

  useEffect(() => {
    setListingCode(reserveListingCode());
  }, []);

  function getListingCode() {
    const code = listingCode || reserveListingCode();
    if (!listingCode) setListingCode(code);
    return code;
  }

  function getReference() {
    const reference = draftReference || createOrderReference("HWG");
    if (!draftReference) setDraftReference(reference);
    return reference;
  }

  function saveDraft(form: HTMLFormElement) {
    const values = getDraftValues(form);
    values.listingCode = getListingCode();
    saveUserDraft("listing", { reference: getReference(), values, featuredPostPackage: selectedPackage.id, featuredPostAmount: selectedPackage.amount });
    setDraftSaved(true);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const reference = getReference();
    const createdAt = new Date().toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" });
    const value = (name: string) => String(values.get(name) || "Not provided");
    const draftValues = getDraftValues(form);
    draftValues.listingCode = getListingCode();
    saveUserDraft("listing", { reference, values: draftValues, featuredPostPackage: selectedPackage.id, featuredPostAmount: selectedPackage.amount });
    setOrderCopy({ title: "Listing submission", reference, status: "DRAFT", createdAt, fields: [{ label: "Listing code", value: getListingCode() }, { label: "Selling route", value: routeLabel }, { label: "Item", value: value("itemName") }, { label: "Category", value: value("itemCategory") }, { label: "Seller", value: value("sellerName") }, { label: "Location", value: `${value("area")}, ${value("city")}, ${value("state")}` }, { label: "Selling price", value: `₦${value("unitPrice")}` }, { label: "Visibility option", value: selectedPackage.amount ? `${selectedPackage.name} · ₦${selectedPackage.amount.toLocaleString("en-NG")}` : "Standard listing · ₦0 (no extra charge)" }], note: "This listing is saved as a Draft. Keep the listing code for support and complete KYC before Hollyway Admin reviews it for publication. A selected ₦100 or ₦500 visibility request is optional and still requires Admin confirmation before payment or featured placement." });
    setSubmitted(true);
  }

  if (submitted && orderCopy) return <div className="mx-auto max-w-[760px] p-5 sm:p-8"><section className="rounded-2xl border border-[#bfe5d0] bg-[#f5fcf7] p-8 text-center shadow-sm"><span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#20bd61] text-xl font-extrabold text-white">✓</span><h2 className="mt-5 font-[Manrope] text-2xl font-extrabold tracking-[-.05em] text-[#0b1830]">Listing saved as Draft</h2><p className="mt-3 text-xs font-extrabold tracking-[.12em] text-[#1453bb]">LISTING CODE: {getListingCode()}</p><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#53627a]">Your {routeLabel.toLowerCase()} details, product photo and working video are saved locally. {selectedPackage.amount ? `Your ${selectedPackage.name.toLowerCase()} request (₦${selectedPackage.amount.toLocaleString("en-NG")}) is recorded with the draft.` : "Standard listing selected at no extra charge."} Complete KYC before Hollyway Admin can review and publish it.</p><OrderCopyActions copy={orderCopy} /><div className="mt-7 flex flex-wrap justify-center gap-3"><Link className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#1453bb] px-4 text-xs font-extrabold text-white" href="/dashboard/listings">View my listings <Arrow /></Link><Link className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#cbd5e1] px-4 text-xs font-extrabold text-[#1453bb]" href="/dashboard/marketplace">Browse marketplace <Arrow /></Link></div></section></div>;

}
