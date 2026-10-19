"use client";

import { useState, type FormEvent } from "react";
import type { SolarLeadInput, SolarPackage } from "../data/solarApi";

type Props = {
  packages: SolarPackage[];
  energyFocus: string;
  selectedPackageKey: string | null;
  source: "public" | "dashboard";
  initialName?: string;
  initialPhone?: string;
  onEnergyFocusChange: (value: string) => void;
  onPackageChange: (value: string | null) => void;
  onSubmit: (input: SolarLeadInput) => Promise<void>;
};

const propertyTypes: ReadonlyArray<readonly [string, string]> = [["flat", "Flat"], ["duplex", "Duplex"], ["small_shop", "Small shop"], ["cold_room", "Cold room"], ["office", "Office"], ["estate", "Estate"]];
const applianceOptions: ReadonlyArray<readonly [string, string]> = [["inverter_ac", "Inverter AC"], ["water_pump", "Water pump"], ["deep_freezer", "Deep freezer"], ["washing_machine", "Washing machine"]];
const inverterOptions: ReadonlyArray<readonly [string, string]> = [["no_motor_load", "No large motor load"], ["one_hp_pump", "One 1HP pump"], ["high_starting_load", "Larger pump or compressor start"]];

export default function SolarLeadForm({ packages, energyFocus, selectedPackageKey, source, initialName = "", initialPhone = "", onEnergyFocusChange, onPackageChange, onSubmit }: Props) {
  const [form, setForm] = useState({ name: initialName, whatsapp_e164: initialPhone, location: "", property_type: "", inverter_need: "no_motor_load" });
  const [appliances, setAppliances] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function update(key: keyof typeof form, value: string) { setForm((current) => ({ ...current, [key]: value })); }
  function toggleAppliance(value: string) { setAppliances((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]); }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setError("");
    try {
      await onSubmit({ ...form, energy_focus: energyFocus as SolarLeadInput["energy_focus"], appliances, selected_package_key: selectedPackageKey, source });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The Solar enquiry could not be saved.");
    } finally { setBusy(false); }
  }

  return (
    <section className="bg-[#071a34] py-14 text-white" id="solar-assessment">
      <div className="mx-auto grid w-[calc(100%-40px)] max-w-[1180px] gap-8 lg:w-[calc(100%-64px)] lg:grid-cols-[.8fr_1.2fr]">
        <div><p className="text-[10px] font-black tracking-[.18em] text-[#f4b41a]">SOLAR ASSESSMENT</p><h2 className="mt-3 text-3xl font-black tracking-[-.06em]">Tell Hollyway what the system must do.</h2><p className="mt-3 max-w-md text-xs leading-6 text-[#c6d8ea]">Submit one clear enquiry. Hollyway saves it, gives you a starting package, and hands the reference to the Solar team on WhatsApp.</p><div className="mt-7 border-l-2 border-[#2d83d5] pl-4 text-[11px] leading-5 text-[#c6d8ea]">Runtime and appliance claims are examples from the published guide. Final sizing needs your actual load, battery reserve, panel position and site conditions.</div></div>
        <form className="grid gap-4 rounded-2xl bg-white p-5 text-[#071a34] sm:p-7" onSubmit={submit}>
          <div className="grid gap-4 sm:grid-cols-2"><Field label="Name" value={form.name} onChange={(value) => update("name", value)} placeholder="Your name" /><Field label="WhatsApp number" value={form.whatsapp_e164} onChange={(value) => update("whatsapp_e164", value)} placeholder="+234 701 558 5967" type="tel" /><Field label="Lagos location" value={form.location} onChange={(value) => update("location", value)} placeholder="Area and city" /></div>
          <ChoiceGroup label="Property type" options={propertyTypes} value={form.property_type} onChange={(value) => update("property_type", value)} />
          <ChoiceGroup label="Energy focus" options={[["day_priority", "Daytime priority"], ["night_priority", "Night priority"], ["balanced_24_7", "Balanced 24/7"]]} value={energyFocus} onChange={onEnergyFocusChange} />
          <ChoiceGroup label="Inverter sizing need" options={inverterOptions} value={form.inverter_need} onChange={(value) => update("inverter_need", value)} />
          <div><span className="text-[10px] font-black uppercase tracking-[.12em] text-[#53627a]">Major appliances</span><div className="mt-2 grid gap-2 sm:grid-cols-2">{applianceOptions.map(([value, label]) => <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#d6e3ef] px-3 py-2.5 text-[11px] font-bold hover:border-[#2d83d5]" key={value}><input checked={appliances.includes(value)} className="accent-[#2d83d5]" onChange={() => toggleAppliance(value)} type="checkbox" />{label}</label>)}</div></div>
          <ChoiceGroup label="Package starting point (optional)" options={[["", "Let Hollyway recommend"] as const, ...packages.map((item) => [item.package_key, `${item.tier_label} · ${item.name}`] as const)]} value={selectedPackageKey || ""} onChange={(value) => onPackageChange(value || null)} />
          {error && <p className="rounded-lg border border-[#f1c8c3] bg-[#fff5f3] p-3 text-xs font-semibold text-[#a32929]" role="alert">{error}</p>}
          <button className="h-11 bg-[#f4b41a] text-xs font-black text-[#071a34] hover:bg-[#ffca45] disabled:opacity-60" disabled={busy} type="submit">{busy ? "Saving enquiry…" : "Save Solar enquiry and continue"}</button>
          <p className="text-[10px] leading-4 text-[#687895]">Your reference is saved in Hollyway. WhatsApp opens only after the save succeeds.</p>
        </form>
      </div>
    </section>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; type?: string }) { return <label className="grid gap-1.5 text-[10px] font-black text-[#53627a]">{label}<input className="h-10 rounded-lg border border-[#d6e3ef] px-3 text-xs font-medium outline-none focus:border-[#2d83d5]" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} type={type} required /></label>; }

function ChoiceGroup({ label, options, value, onChange }: { label: string; options: readonly (readonly [string, string])[]; value: string; onChange: (value: string) => void }) { return <fieldset><legend className="text-[10px] font-black uppercase tracking-[.12em] text-[#53627a]">{label}</legend><div className="mt-2 flex flex-wrap gap-2">{options.map(([option, text]) => <button className={`rounded-lg border px-3 py-2 text-left text-[10px] font-bold ${value === option ? "border-[#2d83d5] bg-[#eaf6ff] text-[#145b9c]" : "border-[#d6e3ef] text-[#53627a] hover:border-[#7bb9ea]"}`} key={option || "none"} onClick={() => onChange(option)} type="button" aria-pressed={value === option}>{text}</button>)}</div></fieldset>; }
