"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import Dropdown, { type DropdownOption } from "../../../components/forms/Dropdown";
import { ApiResponseError } from "../../../components/api/apiResponse";
import { Arrow } from "../../../components/ui/Arrow";
import ServiceField from "./ServiceField";
import {
  professionalCategories,
  saveProfessionalRequest,
  type ProfessionalCategory,
  type ProfessionalRequestInput,
} from "../data/professional";

const categoryOptions: DropdownOption[] = professionalCategories.map(([value, label]) => ({
  value,
  label,
  tip: `${label} requests are matched with a reviewed service professional who works under Hollyway's service terms.`,
}));
const fieldClass = "grid gap-2 text-[11px] font-extrabold text-[#31425e]";
const areaClass = "min-h-24 rounded-lg border border-[#dfe4ed] bg-white px-3 py-3 text-xs font-medium text-[#0b1830] outline-none placeholder:text-[#9aa6b7] focus:border-[#1453bb] focus:ring-4 focus:ring-[#1453bb]/10";

const initialValues: ProfessionalRequestInput = {
  action: "draft", clientFullName: "", clientPhoneE164: "", category: "",
  serviceStreet: "", serviceArea: "", serviceCity: "", serviceState: "",
  taskDescription: "", moveInStatus: "new_move_in", materialsArrangement: "client_supplies",
  preferredAt: "", targetBudgetMinor: null, termsAccepted: false,
};

export default function ProfessionalRequestForm() {
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  function change<K extends keyof ProfessionalRequestInput>(key: K, value: ProfessionalRequestInput[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }
  async function save(action: "draft" | "submit") {
    setBusy(true); setError("");
    try {
      const saved = await saveProfessionalRequest({ ...values, action });
      router.push(`/dashboard/services/${saved.reference}`);
    } catch (reason) {
      setError(reason instanceof ApiResponseError ? reason.message : "Professional request could not be saved.");
    } finally { setBusy(false); }
  }
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); void save("submit"); }
  return <form className="space-y-5" onSubmit={submit}>
    {error && <p className="rounded-lg border border-[#f1c8c3] bg-[#fff5f3] p-3 text-xs font-semibold text-[#a32929]">{error}</p>}
    <section className="rounded-xl border border-[#dfe4ed] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3 border-b border-[#eef1f4] pb-4"><div><p className="text-[10px] font-black uppercase tracking-[.16em] text-[#1453bb]">01 · Request details</p><h2 className="mt-1 font-[Manrope] text-lg font-extrabold tracking-[-.04em] text-[#0b1830]">Tell us what needs to be done.</h2></div><span className="rounded-full bg-[#f4f8ff] px-2.5 py-1 text-[10px] font-extrabold text-[#1453bb]">Draft available</span></div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <ServiceField label="Client full name" name="clientFullName" placeholder="Your full name" required={false} defaultValue={values.clientFullName} onChange={(value) => change("clientFullName", value)} />
        <ServiceField label="WhatsApp phone number" name="clientPhoneE164" type="tel" placeholder="+234 801 234 5678" required={false} defaultValue={values.clientPhoneE164} onChange={(value) => change("clientPhoneE164", value)} />
        <Dropdown label="Service category needed" name="category" options={categoryOptions} value={values.category} onChange={(value) => change("category", value as ProfessionalCategory)} required={false} hint="Choose the pathway closest to the work you need." />
        <ServiceField label="Preferred date and time" name="preferredAt" type="datetime-local" required={false} defaultValue={values.preferredAt || ""} onChange={(value) => change("preferredAt", value)} />
      </div>
    </section>
    <section className="rounded-xl border border-[#dfe4ed] bg-white p-5 shadow-sm">
      <p className="text-[10px] font-black uppercase tracking-[.16em] text-[#1453bb]">02 · Location and job</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <ServiceField label="Street" name="serviceStreet" placeholder="Street and building number" required={false} defaultValue={values.serviceStreet} onChange={(value) => change("serviceStreet", value)} />
        <ServiceField label="Area" name="serviceArea" placeholder="Area or neighbourhood" required={false} defaultValue={values.serviceArea} onChange={(value) => change("serviceArea", value)} />
        <ServiceField label="City" name="serviceCity" placeholder="City" required={false} defaultValue={values.serviceCity} onChange={(value) => change("serviceCity", value)} />
        <ServiceField label="State" name="serviceState" placeholder="State" required={false} defaultValue={values.serviceState} onChange={(value) => change("serviceState", value)} />
        <label className={`${fieldClass} sm:col-span-2`}><span>Detailed task description or equipment fault</span><small className="text-[10px] font-medium leading-4 text-[#8995a8]">Explain the work, fault, access details and anything the professional should know before quoting.</small><textarea className={areaClass} value={values.taskDescription} onChange={(event) => change("taskDescription", event.target.value)} /></label>
      </div>
    </section>
    <section className="rounded-xl border border-[#dfe4ed] bg-white p-5 shadow-sm">
      <p className="text-[10px] font-black uppercase tracking-[.16em] text-[#1453bb]">03 · Timing and materials</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <Dropdown label="Property status" options={[{ value: "new_move_in", label: "New move-in", tip: "Use this when the work is for a home you are preparing to move into." }, { value: "occupied", label: "Occupied", tip: "Use this when people currently live or work at the address." }]} value={values.moveInStatus} onChange={(value) => change("moveInStatus", value as ProfessionalRequestInput["moveInStatus"])} />
        <Dropdown label="Materials arrangement" options={[{ value: "client_supplies", label: "Client supplies", tip: "You will provide the agreed materials for the job." }, { value: "artisan_supplies_all", label: "Artisan supplies all", tip: "Ask the professional to include required materials in the quotation." }]} value={values.materialsArrangement} onChange={(value) => change("materialsArrangement", value as ProfessionalRequestInput["materialsArrangement"])} />
        <ServiceField label="Target budget (₦)" name="targetBudgetMinor" type="number" placeholder="Enter your expected budget" required={false} defaultValue={values.targetBudgetMinor ? String(values.targetBudgetMinor / 100) : ""} onChange={(value) => change("targetBudgetMinor", value ? Number(value.replace(/,/g, "")) * 100 : null)} />
      </div>
      <label className="mt-5 flex items-start gap-2 text-xs leading-5 text-[#53627a]"><input className="mt-1 accent-[#1453bb]" type="checkbox" checked={values.termsAccepted} onChange={(event) => change("termsAccepted", event.target.checked)} />I confirm these service details are accurate and agree to Hollyway terms and privacy notice.</label>
      <div className="mt-5 flex flex-wrap gap-2"><button className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#dfe4ed] px-4 text-xs font-extrabold text-[#1453bb]" disabled={busy} onClick={() => void save("draft")} type="button">{busy ? "Saving…" : "Save as Draft"}</button><button className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1453bb] px-4 text-xs font-extrabold text-white hover:bg-[#0b3f91]" disabled={busy} type="submit">{busy ? "Submitting…" : "Submit request"} <Arrow /></button></div>
    </section>
  </form>;
}
