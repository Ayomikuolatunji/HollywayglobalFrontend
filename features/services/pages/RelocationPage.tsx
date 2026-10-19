"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Arrow } from "../../../components/ui/Arrow";
import Dropdown, { type DropdownOption } from "../../../components/forms/Dropdown";
import ServicePageHeader from "../components/ServicePageHeader";
import { fetchRelocation, relocationApartmentSizes, relocationVehicleTypes, saveRelocation, type RelocationInput, type RelocationRequest } from "../data/relocation";

const emptyForm: RelocationInput = {
  action: "draft", fullName: "", phoneE164: "", pickupAddress: "", destinationAddress: "", apartmentSize: "self_contained",
  floorLevels: "", vehicleType: "minibus", loadersPacking: false, storageRequired: false, storageDurationDays: null,
  bulkyItems: "", movingAt: null, termsAccepted: false,
};
const apartmentOptions: DropdownOption[] = relocationApartmentSizes.map(([value, label]) => ({ value, label, tip: value === "office" ? "Choose Office for a commercial or business relocation." : `Choose ${label} when it best describes the property being moved.` }));
const vehicleOptions: DropdownOption[] = relocationVehicleTypes.map(([value, label]) => ({ value, label, tip: `Hollyway uses the ${label} option to request the right vehicle quotation for the move.` }));

export default function RelocationPage() {
  const router = useRouter();
  const [form, setForm] = useState<RelocationInput>(emptyForm);
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("reference") || "";
    setReference(value);
    if (!value) return;
    setLoading(true);
    fetchRelocation(value).then((item) => setForm(fromRequest(item))).catch((reason) => setError(reason instanceof Error ? reason.message : "The relocation Draft could not be loaded.")).finally(() => setLoading(false));
  }, []);

  function update<K extends keyof RelocationInput>(key: K, value: RelocationInput[K]) { setForm((current) => ({ ...current, [key]: value })); }
  async function save(action: "draft" | "submit") {
    setError(""); setNotice(""); setLoading(true);
    try {
      const item = await saveRelocation({ ...form, action }, reference || undefined);
      setNotice(item.status === "draft" && action === "submit" ? "Your details are saved as a Draft until KYC is approved." : action === "draft" ? "Your relocation Draft is saved." : "Your relocation request is with Hollyway for review.");
      router.push(`/dashboard/relocation/${encodeURIComponent(item.reference)}`);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "The relocation request could not be saved."); } finally { setLoading(false); }
  }
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); void save("submit"); }

  return <div className="mx-auto max-w-[1120px] space-y-5 p-4 sm:p-7">
    <ServicePageHeader kicker="RELOCATION REQUEST" title="Plan your move with Hollyway." description="Give us the route, property size, vehicle and support you need. Hollyway will review the move and return a quotation based on the request." action={<Link className="inline-flex items-center gap-2 text-xs font-extrabold text-[#1453bb] hover:underline" href="/dashboard/relocation"><Arrow />Back to relocations</Link>} />
    <section className="grid gap-3 rounded-xl border border-[#dfe4ed] bg-[#f8fbff] p-4 text-xs text-[#53627a] sm:grid-cols-3"><Step number="01" title="Tell us the route" text="Use complete pick-up and destination addresses." /><Step number="02" title="Describe the move" text="Choose the property, vehicle and crew support." /><Step number="03" title="Receive a quote" text="Hollyway reviews the request and coordinates quotations." /></section>
    {error && <p className="rounded-lg border border-[#f1c8c3] bg-[#fff5f3] p-3 text-xs font-semibold text-[#a32929]">{error}</p>}
    {notice && <p className="rounded-lg border border-[#bce4c9] bg-[#f3fcf5] p-3 text-xs font-semibold text-[#168046]">{notice}</p>}
    <form className="space-y-5 rounded-xl border border-[#dfe4ed] bg-white p-4 shadow-sm sm:p-6" onSubmit={submit}>
      <Section title="Your contact"><div className="grid gap-4 sm:grid-cols-2"><Field label="Full name" name="full_name" value={form.fullName} placeholder="Your full name" onChange={(value) => update("fullName", value)} /><Field label="Active WhatsApp phone number" name="phone_e164" value={form.phoneE164} placeholder="+234 801 234 5678" type="tel" onChange={(value) => update("phoneE164", value)} /></div></Section>
      <Section title="Move route"><div className="grid gap-4 sm:grid-cols-2"><Area label="Current pick-up address" value={form.pickupAddress} placeholder="Street, area, city and state" onChange={(value) => update("pickupAddress", value)} /><Area label="New destination address" value={form.destinationAddress} placeholder="Street, area, city and state" onChange={(value) => update("destinationAddress", value)} /></div></Section>
      <Section title="Move requirements"><div className="grid gap-4 sm:grid-cols-2"><Dropdown label="Apartment size" options={apartmentOptions} value={form.apartmentSize} onChange={(value) => update("apartmentSize", value as RelocationInput["apartmentSize"])} hint="Choose Self-contained, 2-bed, 3-bed, Duplex or Office." /><Field label="Floor levels" name="floor_levels" value={form.floorLevels} placeholder="e.g. Ground floor to third floor" onChange={(value) => update("floorLevels", value)} /><Dropdown label="Vehicle type required" options={vehicleOptions} value={form.vehicleType} onChange={(value) => update("vehicleType", value as RelocationInput["vehicleType"])} /><Dropdown label="Professional loaders and packing/wrapping crew" options={[{ value: "yes", label: "Yes", tip: "Request loading, packing and wrapping support." }, { value: "no", label: "No", tip: "You will arrange loading and packing yourself." }]} value={form.loadersPacking ? "yes" : "no"} onChange={(value) => update("loadersPacking", value === "yes")} /><Dropdown label="Temporary transit storage" options={[{ value: "yes", label: "Yes", tip: "Request temporary holding or transit storage for 2–7 days." }, { value: "no", label: "No", tip: "The move will go directly from pick-up to destination." }]} value={form.storageRequired ? "yes" : "no"} onChange={(value) => { const required = value === "yes"; update("storageRequired", required); if (!required) update("storageDurationDays", null); }} />{form.storageRequired && <Field label="Storage duration in days" name="storage_duration_days" value={form.storageDurationDays ? String(form.storageDurationDays) : ""} placeholder="Choose 2 to 7 days" type="number" min="2" max="7" onChange={(value) => update("storageDurationDays", value ? Number(value) : null)} />}</div></Section>
      <Section title="Move details"><div className="grid gap-4 sm:grid-cols-2"><Area label="Major bulky items" value={form.bulkyItems} placeholder="List furniture, appliances, machinery or other large items." onChange={(value) => update("bulkyItems", value)} /><Field label="Preferred moving date" name="moving_at" value={toDateTimeInput(form.movingAt)} type="datetime-local" onChange={(value) => update("movingAt", value ? new Date(value).toISOString() : null)} /></div></Section>
      <label className="flex items-start gap-2 border-t border-[#eef1f4] pt-4 text-xs leading-5 text-[#53627a]"><input className="mt-1 accent-[#1453bb]" type="checkbox" checked={form.termsAccepted} onChange={(event) => update("termsAccepted", event.target.checked)} />I confirm these relocation details are accurate and agree to Hollyway terms and privacy notice.</label>
      <div className="flex flex-wrap justify-end gap-2 border-t border-[#eef1f4] pt-4"><button className="h-10 rounded-lg border border-[#dfe4ed] px-4 text-xs font-extrabold text-[#53627a] disabled:opacity-50" disabled={loading} onClick={() => void save("draft")} type="button">{loading ? "Saving…" : "Save as Draft"}</button><button className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1453bb] px-4 text-xs font-extrabold text-white disabled:opacity-50" disabled={loading} type="submit">{loading ? "Submitting…" : "Submit relocation request"}<Arrow /></button></div>
    </form>
  </div>;
}

function fromRequest(item: RelocationRequest): RelocationInput { return { action: "draft", fullName: item.full_name, phoneE164: item.phone_e164, pickupAddress: item.pickup_address, destinationAddress: item.destination_address, apartmentSize: item.apartment_size, floorLevels: item.floor_levels, vehicleType: item.vehicle_type, loadersPacking: item.loaders_packing, storageRequired: item.storage_required, storageDurationDays: item.storage_duration_days, bulkyItems: item.bulky_items, movingAt: item.moving_at, termsAccepted: Boolean(item.terms_accepted_at) }; }
function toDateTimeInput(value: string | null) { if (!value) return ""; const date = new Date(value); const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000); return local.toISOString().slice(0, 16); }
function Section({ title, children }: { title: string; children: ReactNode }) { return <section className="border-t border-[#eef1f4] pt-5 first:border-0 first:pt-0"><h2 className="text-sm font-extrabold text-[#0b1830]">{title}</h2><div className="mt-4">{children}</div></section>; }
function Step({ number, title, text }: { number: string; title: string; text: string }) { return <div><span className="text-[10px] font-black text-[#1453bb]">{number}</span><p className="mt-1 text-xs font-extrabold text-[#0b1830]">{title}</p><p className="mt-1 text-[10px] leading-4">{text}</p></div>; }
function Field({ label, name, value, placeholder, type = "text", min, max, onChange }: { label: string; name: string; value: string; placeholder?: string; type?: string; min?: string; max?: string; onChange: (value: string) => void }) { return <label className="grid gap-2 text-[11px] font-extrabold text-[#31425e]"><span>{label}</span><small className="text-[10px] font-medium leading-4 text-[#8995a8]">{placeholder}</small><input className="h-11 rounded-lg border border-[#dfe4ed] bg-white px-3 text-xs font-medium text-[#0b1830] outline-none placeholder:text-[#9aa6b7] focus:border-[#1453bb] focus:ring-4 focus:ring-[#1453bb]/10" name={name} type={type} min={min} max={max} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} /></label>; }
function Area({ label, value, placeholder, onChange }: { label: string; value: string; placeholder: string; onChange: (value: string) => void }) { return <label className="grid gap-2 text-[11px] font-extrabold text-[#31425e]"><span>{label}</span><small className="text-[10px] font-medium leading-4 text-[#8995a8]">{placeholder}</small><textarea className="min-h-24 rounded-lg border border-[#dfe4ed] bg-white px-3 py-3 text-xs font-medium text-[#0b1830] outline-none placeholder:text-[#9aa6b7] focus:border-[#1453bb] focus:ring-4 focus:ring-[#1453bb]/10" value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} /></label>; }
