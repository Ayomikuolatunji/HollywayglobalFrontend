"use client";

import Link from "next/link";
import { useState, type FormEvent, type ReactNode } from "react";
import { Arrow } from "../../../components/ui/Arrow";
import ServiceField from "../components/ServiceField";
import ServicePageHeader from "../components/ServicePageHeader";
import { getDraftValues, saveUserDraft } from "../../dashboard/data/drafts";

const inputClass = "h-11 rounded-lg border border-[#dfe4ed] bg-white px-3 text-xs font-medium text-[#0b1830] outline-none focus:border-[#1453bb] focus:ring-4 focus:ring-[#1453bb]/10";
const labelClass = "grid gap-2 text-[11px] font-extrabold text-[#31425e]";

function SelectField({ label, name, children }: { label: string; name: string; children: ReactNode }) {
  return <label className={labelClass}><span>{label}</span><select className={inputClass} name={name} defaultValue="" required><option value="" disabled>Select an option</option>{children}</select></label>;
}

function TextAreaField({ label, name, placeholder }: { label: string; name: string; placeholder: string }) {
  return <label className={labelClass}><span>{label}</span><small className="text-[10px] font-medium leading-4 text-[#8995a8]">{placeholder}</small><textarea className="min-h-28 rounded-lg border border-[#dfe4ed] bg-white px-3 py-3 text-xs font-medium text-[#0b1830] outline-none placeholder:text-[#9aa6b7] focus:border-[#1453bb] focus:ring-4 focus:ring-[#1453bb]/10" name={name} placeholder={placeholder} required /></label>;
}

const serviceOptions = ["Catering", "Bulk drinks", "Planner", "Decorator", "Canopies", "Sound", "Generators"];

export default function EventsPage() {
  const [sent, setSent] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); saveUserDraft("event enquiry", { values: getDraftValues(event.currentTarget) }); setSent(true); }
  return <div className="mx-auto max-w-[980px] space-y-6 p-5 sm:p-8"><ServicePageHeader kicker="EVENT SUPPLIES & VENDORS" title="Plan the items around your event." description="Complete the event details so Hollyway can coordinate vendors, supplies and delivery requirements." action={<Link className="inline-flex items-center gap-2 text-xs font-extrabold text-[#1453bb] hover:underline" href="/dashboard/events">Back to events <Arrow /></Link>} /><section className="rounded-xl border border-[#dfe4ed] bg-white p-6 shadow-sm">{sent ? <div className="rounded-lg bg-[#f5fcf7] p-6 text-center"><b className="text-sm text-[#0b1830]">Event request saved as Draft</b><p className="mt-2 text-xs leading-5 text-[#53627a]">Your event, venue, vendor and supply details are captured in this UI flow. Availability, contracts and delivery coordination will connect when the event service is enabled.</p><Link className="mt-4 inline-flex items-center gap-2 text-xs font-extrabold text-[#1453bb] hover:underline" href="/dashboard/events">View events <Arrow /></Link></div> : <form onSubmit={submit}><h3 className="font-[Manrope] text-lg font-extrabold tracking-[-.04em] text-[#0b1830]">Plan event supplies and vendors</h3><div className="mt-5 grid gap-4 sm:grid-cols-2"><ServiceField label="Client full name" name="name" placeholder="Full name" /><ServiceField label="WhatsApp number" name="phone" type="tel" placeholder="080..." /><SelectField label="Event type" name="eventType"><option>Wedding</option><option>Birthday</option><option>Corporate</option><option>Funeral</option><option>Housewarming</option></SelectField><ServiceField label="Estimated guest count" name="guests" type="number" placeholder="0" /><ServiceField label="Event date and time" name="dateTime" type="datetime-local" /></div><div className="mt-4"><TextAreaField label="Venue address" name="venue" placeholder="Street, area, city and state" /></div><div className="mt-5 border-t border-[#eef1f4] pt-5"><h4 className="text-xs font-extrabold text-[#1453bb]">Services and supplies required</h4><div className="mt-4 grid gap-4 sm:grid-cols-2"><SelectField label="Primary service or supply" name="service"><>{serviceOptions.map((service) => <option key={service}>{service}</option>)}</></SelectField><ServiceField label="Target event budget (₦)" name="budget" type="number" placeholder="0" /></div><div className="mt-4"><TextAreaField label="Specific quantities or menu preferences" name="requirements" placeholder="List quantities, menu preferences, equipment, decor or delivery requirements." /></div></div><label className="mt-5 flex items-start gap-2 text-xs leading-5 text-[#53627a]"><input className="mt-1 accent-[#1453bb]" type="checkbox" required />I confirm these event details are accurate and agree to Hollyway terms and privacy notice.</label><button className="mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-[#1453bb] px-5 text-xs font-extrabold text-white hover:bg-[#0b3f91]" type="submit">Save event request <Arrow /></button></form>}</section></div>;
}
