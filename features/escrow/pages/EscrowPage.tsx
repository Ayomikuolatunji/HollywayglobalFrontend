"use client";

import Link from "next/link";
import { useState, type FormEvent, type ReactNode } from "react";
import Brand from "../../../components/ui/Brand";
import { Arrow } from "../../../components/ui/Arrow";
import useInternationalPhoneInputs from "../../../components/forms/useInternationalPhoneInputs";
import EscrowHeader from "../components/EscrowHeader";
import DraftStatusNotice from "../../commerce/components/DraftStatusNotice";
import OrderCopyActions, { createOrderReference, type OrderCopyDetails } from "../../commerce/components/OrderCopyActions";
import { getDraftValues, saveUserDraft } from "../../dashboard/data/drafts";

const inputClass = "h-11 rounded-lg border border-[#dfe4ed] bg-white px-3 text-xs font-medium text-[#0b1830] outline-none focus:border-[#1453bb] focus:ring-4 focus:ring-[#1453bb]/10";
const labelClass = "grid gap-2 text-[11px] font-extrabold text-[#31425e]";
const steps = [["Buyer & Seller Agree", "Both parties confirm the item, value and terms."], ["Submit Escrow", "Create the documented HWE transaction request."], ["Funds Deposited (Fidelity)", "Use only official Hollyway payment instructions."], ["Dispatch", "The agreed courier delivers the item."], ["Inspect", "The buyer tests the item against the agreement."], ["Instant Payout", "Seller payout follows buyer confirmation."]];

function SelectField({ label, name, children }: { label: string; name: string; children: ReactNode }) {
  return <label className={labelClass}><span>{label}</span><select className={inputClass} name={name} defaultValue="" required><option value="" disabled>Select an option</option>{children}</select></label>;
}

function TextAreaField({ label, name, placeholder }: { label: string; name: string; placeholder: string }) {
  return <label className={labelClass}><span>{label}</span><textarea className="min-h-24 rounded-lg border border-[#dfe4ed] bg-white px-3 py-3 text-xs font-medium text-[#0b1830] outline-none placeholder:text-[#9aa6b7] focus:border-[#1453bb] focus:ring-4 focus:ring-[#1453bb]/10" name={name} placeholder={placeholder} required /></label>;
}

export default function EscrowPage({ standalone = false }: { standalone?: boolean }) {
  const [sent, setSent] = useState(false);
  useInternationalPhoneInputs();
  const [draftSaved, setDraftSaved] = useState(false);
  const [draftReference, setDraftReference] = useState("");
  const [orderCopy, setOrderCopy] = useState<OrderCopyDetails | null>(null);
  const backHref = standalone ? "/" : "/dashboard/escrow";
  const backLabel = standalone ? "Return to website" : "Back to my escrow";

  function getReference() {
    const reference = draftReference || createOrderReference("HWE");
    if (!draftReference) setDraftReference(reference);
    return reference;
  }

  function saveDraft(form: HTMLFormElement) {
    saveUserDraft("escrow request", { reference: getReference(), values: getDraftValues(form) });
    setDraftSaved(true);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const reference = getReference();
    const createdAt = new Date().toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" });
    const value = (name: string) => String(values.get(name) || "Not provided");
    saveUserDraft("escrow request", { reference, values: getDraftValues(form) });
    setOrderCopy({ title: "Standalone Third-Party Escrow", reference, status: "DRAFT", createdAt, fields: [{ label: "Item", value: value("itemName") }, { label: "Agreed value", value: `₦${value("value")}` }, { label: "Buyer", value: value("buyerName") }, { label: "Seller", value: value("sellerName") }, { label: "Courier", value: value("courier") }, { label: "Inspection terms", value: value("inspectionTerms") }], note: "This escrow request is saved as a Draft. Do not transfer funds until Hollyway confirms the HWE reference and official Fidelity payment instructions. Disputes follow the documented 48-hour dispute and return protocol." });
    setSent(true);
  }

  const content = <div className="w-full space-y-6 p-5 sm:p-8"><EscrowHeader action={<Link className="inline-flex items-center gap-2 text-xs font-extrabold text-[#1453bb] hover:underline" href={backHref}>{backLabel} <Arrow /></Link>} /><section className="rounded-xl border border-[#cfe0f7] bg-[#f4f8ff] p-5"><span className="text-[10px] font-extrabold tracking-[.16em] text-[#1453bb]">STANDALONE THIRD-PARTY ESCROW</span><h2 className="mt-2 font-[Manrope] text-xl font-extrabold tracking-[-.04em] text-[#0b1830]">Protect an outside transaction.</h2><p className="mt-2 max-w-3xl text-xs leading-5 text-[#53627a]">Use this independent escrow transaction protection for buyers and sellers who met on Jiji, Instagram, X, Facebook Marketplace or offline.</p></section><section className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6" aria-label="Standalone escrow process">{steps.map(([title, text], index) => <article className="rounded-xl border border-[#dfe4ed] bg-white p-4" key={title}><span className="text-[10px] font-extrabold text-[#ff8a00]">{String(index + 1).padStart(2, "0")}</span><h3 className="mt-3 text-xs font-extrabold leading-4 text-[#0b1830]">{title}</h3><p className="mt-2 text-[10px] leading-4 text-[#8490a4]">{text}</p></article>)}</section>{!sent && <DraftStatusNotice contentType="escrow request" saved={draftSaved} />}<section className="rounded-xl border border-[#dfe4ed] bg-white p-6 shadow-sm">{sent && orderCopy ? <div className="rounded-lg bg-[#f5fcf7] p-6 text-center"><span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-[#20bd61] text-xl font-extrabold text-white">✓</span><b className="mt-4 block text-sm text-[#0b1830]">Standalone escrow request saved as Draft</b><p className="mx-auto mt-2 max-w-md text-xs leading-5 text-[#53627a]">Your HWE request is ready for Hollyway review. Funds are deposited to the official Fidelity settlement process only after the reference and terms are confirmed.</p><OrderCopyActions copy={orderCopy} /><button className="mt-6 text-xs font-extrabold text-[#1453bb] hover:underline" type="button" onClick={() => { setSent(false); setOrderCopy(null); }}>Create another escrow request</button></div> : <form onSubmit={submit}><h3 className="font-[Manrope] text-lg font-extrabold tracking-[-.04em] text-[#0b1830]">Standalone Third-Party Escrow Transaction</h3><p className="mt-2 text-xs leading-5 text-[#53627a]">Buyer &amp; seller agree → submit escrow → funds deposited (Fidelity) → dispatch → inspect → instant payout.</p><section className="mt-5 border-b border-[#eef1f4] pb-6"><h4 className="text-xs font-extrabold text-[#1453bb]">Item and fee terms</h4><div className="mt-4 grid gap-4 sm:grid-cols-2"><label className={labelClass}><span>Item name</span><input className={inputClass} name="itemName" placeholder="What is being protected?" required /></label><label className={labelClass}><span>Agreed transaction value (₦)</span><input className={inputClass} name="value" type="number" min="1000" placeholder="0" required /></label><SelectField label="Agreed escrow fee coverage" name="escrowFeeCoverage"><option>Buyer pays</option><option>Seller pays</option><option>50/50 split</option></SelectField><SelectField label="Delivery fee coverage" name="deliveryFeeCoverage"><option>Buyer pays</option><option>Seller pays</option><option>50/50 split</option></SelectField></div><div className="mt-4"><TextAreaField label="Item description" name="description" placeholder="Describe the item, condition and transaction context." /></div></section><section className="mt-6 grid gap-6 lg:grid-cols-2"><div><h4 className="text-xs font-extrabold text-[#1453bb]">Buyer details</h4><div className="mt-4 grid gap-4"><label className={labelClass}><span>Buyer full name</span><input className={inputClass} name="buyerName" placeholder="Full name" required /></label><label className={labelClass}><span>Buyer WhatsApp phone number</span><input className={inputClass} name="buyerPhone" type="tel" placeholder="080..." required /></label><TextAreaField label="Buyer full delivery address" name="buyerAddress" placeholder="Street, area, city and state" /></div></div><div><h4 className="text-xs font-extrabold text-[#1453bb]">Seller details</h4><div className="mt-4 grid gap-4"><label className={labelClass}><span>Seller full name</span><input className={inputClass} name="sellerName" placeholder="Full name" required /></label><label className={labelClass}><span>Seller WhatsApp phone number</span><input className={inputClass} name="sellerPhone" type="tel" placeholder="080..." required /></label><TextAreaField label="Seller settlement bank details" name="sellerBank" placeholder="Bank name, account number and account name" /></div></div></section><div className="mt-6"><TextAreaField label="Specific testing and inspection terms agreed" name="inspectionTerms" placeholder="List the physical checks, inspection window and condition confirmation required before release." /></div><label className="mt-5 flex items-start gap-2 text-xs leading-5 text-[#53627a]"><input className="mt-1 accent-[#1453bb]" type="checkbox" required />I understand that funds remain locked until inspection and buyer confirmation, and that disputes follow Hollyway&apos;s 48-hour dispute and return protocol.</label><div className="mt-6 flex flex-wrap justify-end gap-3"><Link className="inline-flex h-11 items-center rounded-lg border border-[#dfe4ed] px-4 text-xs font-extrabold text-[#53627a]" href={backHref}>Cancel</Link><button className="inline-flex h-11 items-center rounded-lg border border-[#1453bb] px-4 text-xs font-extrabold text-[#1453bb]" type="button" onClick={(event) => event.currentTarget.form && saveDraft(event.currentTarget.form)}>Save as draft</button><button className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#1453bb] px-5 text-xs font-extrabold text-white hover:bg-[#0b3f91]" type="submit">Save &amp; get PDF copy <Arrow /></button></div></form>}</section><p className="rounded-lg border border-[#f1d8a9] bg-[#fffaf1] p-4 text-xs leading-5 text-[#6b5a3d]"><strong>Safety reminder:</strong> Hollyway Global will never send payment accounts via private DM, phone call or voice note. Use only the official Fidelity settlement instructions attached to the confirmed HWE reference.</p></div>;

  if (standalone) return <main className="min-h-screen bg-[#eef1f5] text-[#0b1830]"><header className="flex min-h-[78px] items-center border-b border-[#dfe4ed] bg-white px-5 sm:px-8"><Brand /></header>{content}</main>;
  return content;
}
