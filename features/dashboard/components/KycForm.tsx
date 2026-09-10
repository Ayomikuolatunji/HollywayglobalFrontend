"use client";

import { type ReactNode } from "react";
import Dropdown, { type DropdownOption } from "../../../components/forms/Dropdown";
import { Arrow } from "../../../components/ui/Arrow";
import { kycSteps, type KycDraft } from "../data/kyc";
import FaceVerificationCapture from "./FaceVerificationCapture";

const inputClass = "h-11 rounded-lg border border-[#dfe4ed] bg-white px-3 text-xs font-medium text-[#0b1830] outline-none placeholder:text-[#9aa6b7] focus:border-[#1453bb] focus:ring-4 focus:ring-[#1453bb]/10";
const identityOptions: DropdownOption[] = [
  { value: "NIN", label: "National Identification Number (NIN)", tip: "Use your 11-digit NIN exactly as issued." },
  { value: "BVN", label: "Bank Verification Number (BVN)", tip: "Use your 11-digit BVN exactly as issued." },
];
const stateOptions: DropdownOption[] = ["Lagos", "Abuja (FCT)", "Rivers", "Oyo", "Kano", "Enugu", "Kaduna", "Other"].map((state) => ({ value: state, label: state }));

function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return <label className="grid gap-2 text-[11px] font-extrabold text-[#31425e]"><span>{label}</span>{children}{hint && <small className="text-[10px] font-medium leading-4 text-[#8995a8]">{hint}</small>}</label>;
}

type StepProps = { draft: KycDraft; onUpdate: (field: keyof KycDraft, value: string | boolean) => void };

function IdentityRecordStep({ draft, onUpdate }: StepProps) {
  return <div className="mt-6 grid gap-4 sm:grid-cols-2"><Dropdown label="Identity record type" options={identityOptions} value={draft.identityType} onChange={(value) => onUpdate("identityType", value)} /><Field label={`${draft.identityType} number`} hint="Use the 11-digit number exactly as issued. It is sent securely and never saved in browser storage."><input className={inputClass} value={draft.identityNumber} onChange={(event) => onUpdate("identityNumber", event.target.value.replace(/\D/g, "").slice(0, 11))} placeholder="Enter 11-digit number" inputMode="numeric" autoComplete="off" /></Field></div>;
}

function AddressStep({ draft, onUpdate }: StepProps) {
  return <div className="mt-6 grid gap-4 sm:grid-cols-2"><Field label="Full address" hint="Include street, area, city and state for the address record."><textarea className="min-h-24 rounded-lg border border-[#dfe4ed] bg-white px-3 py-3 text-xs font-medium text-[#0b1830] outline-none placeholder:text-[#9aa6b7] focus:border-[#1453bb] focus:ring-4 focus:ring-[#1453bb]/10" value={draft.address} onChange={(event) => onUpdate("address", event.target.value)} placeholder="Street, area and house number" /></Field><div className="grid content-start gap-4"><Field label="City"><input className={inputClass} value={draft.city} onChange={(event) => onUpdate("city", event.target.value)} placeholder="e.g. Ikeja" /></Field><Dropdown label="State" options={stateOptions} value={draft.state} onChange={(value) => onUpdate("state", value)} /></div><p className="sm:col-span-2 rounded-lg border border-[#f1d8a9] bg-[#fffaf1] p-3 text-[10px] leading-5 text-[#6b5a3d]">Keep the address accurate so Hollyway can coordinate account and transaction support when needed.</p></div>;
}

function ReviewStep({ draft, selfieFile, onUpdate }: StepProps & { selfieFile: File | null }) {
  return <div className="mt-6 grid gap-3"><dl className="grid gap-3 rounded-lg bg-[#f8fafc] p-4 text-xs sm:grid-cols-2"><div><dt className="text-[10px] font-extrabold tracking-[.1em] text-[#8b97a9]">IDENTITY</dt><dd className="mt-1 font-semibold text-[#0b1830]">{draft.identityType} ending {draft.identityNumber ? draft.identityNumber.slice(-4) : "—"}</dd></div><div><dt className="text-[10px] font-extrabold tracking-[.1em] text-[#8b97a9]">FACE SELFIE</dt><dd className="mt-1 truncate font-semibold text-[#0b1830]">{selfieFile?.name || "Not selected"}</dd></div><div className="sm:col-span-2"><dt className="text-[10px] font-extrabold tracking-[.1em] text-[#8b97a9]">ADDRESS</dt><dd className="mt-1 font-semibold text-[#0b1830]">{[draft.address, draft.city, draft.state].filter(Boolean).join(", ") || "Not provided"}</dd></div></dl><label className="flex items-start gap-2 text-xs leading-5 text-[#53627a]"><input className="mt-1 accent-[#1453bb]" type="checkbox" checked={draft.consent} onChange={(event) => onUpdate("consent", event.target.checked)} />I confirm these details are accurate and agree to Hollyway’s terms and privacy notice.</label><p className="rounded-lg border border-[#bfe5d0] bg-[#f1fbf5] p-3 text-[10px] leading-5 text-[#376957]">Your NIN/BVN is submitted only to the authenticated Hollyway verification endpoint. It is not stored in localStorage or returned in the browser response.</p></div>;
}

type KycFormProps = {
  draft: KycDraft;
  step: number;
  selfieFile: File | null;
  error: string;
  submitting: boolean;
  onUpdate: (field: keyof KycDraft, value: string | boolean) => void;
  onSelfieChange: (file: File | null) => void;
  onNext: () => void;
  onPrevious: () => void;
  onSave: () => void;
  onSubmit: () => void;
};

export default function KycForm({ draft, step, selfieFile, error, submitting, onUpdate, onSelfieChange, onNext, onPrevious, onSave, onSubmit }: KycFormProps) {
  const stepContent = step === 0 ? <IdentityRecordStep draft={draft} onUpdate={onUpdate} /> : step === 1 ? <FaceVerificationCapture file={selfieFile} onChange={onSelfieChange} /> : step === 2 ? <AddressStep draft={draft} onUpdate={onUpdate} /> : <ReviewStep draft={draft} selfieFile={selfieFile} onUpdate={onUpdate} />;
  return <section className="rounded-xl border border-[#dfe4ed] bg-white p-5 shadow-sm sm:p-7"><div className="flex items-center justify-between gap-4"><div><span className="text-[10px] font-extrabold tracking-[.15em] text-[#1453bb]">STEP {step + 1} OF {kycSteps.length}</span><h3 className="mt-1 font-[Manrope] text-lg font-extrabold text-[#0b1830]">{kycSteps[step]}</h3></div><button className="text-xs font-extrabold text-[#1453bb] hover:underline" type="button" onClick={onSave}>Save draft</button></div><div className="mt-5 grid grid-cols-4 gap-1" aria-label="KYC progress">{kycSteps.map((label, index) => <span className={`h-1.5 rounded-full ${index <= step ? "bg-[#1453bb]" : "bg-[#e8edf4]"}`} key={label} />)}</div>{error && <p className="mt-5 rounded-lg border border-[#f3caca] bg-[#fff5f5] px-3 py-2 text-xs font-semibold leading-5 text-[#a32929]" role="alert">{error}</p>}{stepContent}<div className="mt-7 flex flex-wrap justify-between gap-3"><button className="inline-flex h-10 items-center rounded-lg border border-[#dfe4ed] px-4 text-xs font-extrabold text-[#53627a] disabled:cursor-not-allowed disabled:opacity-40" type="button" onClick={onPrevious} disabled={step === 0 || submitting}>Back</button><div className="flex flex-wrap gap-3"><button className="inline-flex h-10 items-center rounded-lg border border-[#1453bb] px-4 text-xs font-extrabold text-[#1453bb]" type="button" onClick={onSave} disabled={submitting}>Save draft</button>{step < kycSteps.length - 1 ? <button className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1453bb] px-4 text-xs font-extrabold text-white hover:bg-[#0b3f91]" type="button" onClick={onNext}>Continue <Arrow /></button> : <button className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1453bb] px-4 text-xs font-extrabold text-white hover:bg-[#0b3f91] disabled:cursor-not-allowed disabled:opacity-60" type="button" onClick={onSubmit} disabled={submitting}>{submitting ? "Submitting securely…" : <>Submit for verification <Arrow /></>}</button>}</div></div></section>;
}
