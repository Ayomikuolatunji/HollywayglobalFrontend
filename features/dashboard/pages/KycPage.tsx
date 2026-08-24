"use client";

import Link from "next/link";
import { useEffect, useState, type ChangeEvent } from "react";
import { Arrow } from "../../../components/ui/Arrow";
import DashboardIcon from "../components/DashboardIcon";
import DashboardPageHeader from "../components/DashboardPageHeader";
import { emptyKycDraft, kycSteps, kycStorageKey, type KycDraft, type KycStatus } from "../data/kyc";

const documentTypes = ["NIN", "International passport", "Driver's licence", "Voter's card"];
const nigerianStates = ["Lagos", "Abuja (FCT)", "Rivers", "Oyo", "Kano", "Enugu", "Kaduna", "Other"];

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return <label className="grid gap-2 text-[11px] font-extrabold text-[#31425e]"><span>{label}</span>{children}{hint && <small className="text-[10px] font-medium leading-4 text-[#8995a8]">{hint}</small>}</label>;
}

function inputClass() {
  return "h-11 rounded-lg border border-[#dfe4ed] bg-white px-3 text-xs font-medium text-[#0b1830] outline-none placeholder:text-[#9aa6b7] focus:border-[#1453bb] focus:ring-4 focus:ring-[#1453bb]/10";
}

export default function KycPage() {
  const [draft, setDraft] = useState<KycDraft>(emptyKycDraft);
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<KycStatus>("not-started");
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem(kycStorageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as { draft?: Partial<KycDraft>; status?: KycStatus };
        setDraft({ ...emptyKycDraft, ...parsed.draft });
        setStatus(parsed.status === "submitted" ? "submitted" : parsed.status === "draft" ? "draft" : "not-started");
      } catch {
        window.localStorage.removeItem(kycStorageKey);
      }
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem(kycStorageKey, JSON.stringify({ draft, status }));
  }, [draft, ready, status]);

  function update<K extends keyof KycDraft>(field: K, value: KycDraft[K]) {
    setDraft((current) => ({ ...current, [field]: value }));
    if (status === "not-started") setStatus("draft");
    setError("");
  }

  function validateCurrentStep() {
    const required = step === 0 ? [draft.dateOfBirth, draft.phone] : step === 1 ? [draft.documentType, draft.documentNumber, draft.documentName] : step === 2 ? [draft.address, draft.city, draft.state] : [draft.consent ? "confirmed" : ""];
    if (required.some((value) => !String(value).trim())) {
      setError("Complete the required fields before continuing.");
      return false;
    }
    return true;
  }

  function nextStep() { if (validateCurrentStep()) setStep((current) => Math.min(current + 1, kycSteps.length - 1)); }
  function previousStep() { setError(""); setStep((current) => Math.max(current - 1, 0)); }
  function chooseDocument(event: ChangeEvent<HTMLInputElement>) { update("documentName", event.target.files?.[0]?.name || ""); }
  function submitKyc() { if (!validateCurrentStep()) return; setStatus("submitted"); setError(""); }
  function startOver() { window.localStorage.removeItem(kycStorageKey); setDraft(emptyKycDraft); setStatus("not-started"); setStep(0); setError(""); }

  if (status === "submitted") return <div className="w-full p-5 sm:p-8"><section className="mx-auto max-w-2xl rounded-2xl border border-[#bfe5d0] bg-[#f5fcf7] p-8 text-center shadow-sm sm:p-12"><span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#20bd61] text-xl font-extrabold text-white">✓</span><span className="mt-6 block text-[10px] font-extrabold tracking-[.18em] text-[#168046]">KYC SUBMISSION SAVED</span><h2 className="mt-3 font-[Manrope] text-3xl font-extrabold tracking-[-.06em] text-[#0b1830]">Your verification details are ready.</h2><p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#53627a]">This UI has saved your verification draft locally. The secure provider lookup, document upload and Hollyway review will activate when the verification API is connected.</p><div className="mt-7 flex flex-wrap justify-center gap-3"><Link className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#1453bb] px-4 text-xs font-extrabold text-white" href="/dashboard/profile">Back to profile <Arrow /></Link><button className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#bfe5d0] px-4 text-xs font-extrabold text-[#168046]" type="button" onClick={startOver}>Start a new draft</button></div></section></div>;

  return <div className="w-full space-y-6 p-5 sm:p-8"><DashboardPageHeader kicker="PROFILE & KYC" title="Verify your identity" description="Complete the details needed to prepare your provider verification. Your verified legal name will come from the KYC provider." action={<div className="flex flex-wrap items-center gap-4"><Link className="text-xs font-extrabold text-[#53627a] hover:underline" href="/dashboard">Skip for now</Link><Link className="inline-flex items-center gap-2 text-xs font-extrabold text-[#1453bb] hover:underline" href="/dashboard/profile">Back to profile <Arrow /></Link></div>} /><div className="grid gap-6 lg:grid-cols-[.65fr_1.35fr]"><aside className="h-fit rounded-xl border border-[#dfe4ed] bg-white p-5 shadow-sm"><div className="flex items-center justify-between gap-3"><span className="text-[10px] font-extrabold tracking-[.16em] text-[#8b97a9]">VERIFICATION PROGRESS</span><span className="rounded-full bg-[#edf4ff] px-2 py-1 text-[9px] font-extrabold text-[#1453bb]">{status === "draft" ? "Draft saved" : "Not started"}</span></div><ol className="mt-5 grid gap-2">{kycSteps.map((label, index) => { const active = index === step; const complete = index < step; return <li key={label}><button className={`flex w-full items-center gap-3 rounded-lg p-3 text-left ${active ? "bg-[#edf4ff]" : "hover:bg-[#f8fafc]"}`} type="button" onClick={() => index <= step && setStep(index)}><span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-extrabold ${complete ? "bg-[#20bd61] text-white" : active ? "bg-[#1453bb] text-white" : "bg-[#f1f4f8] text-[#8490a4]"}`}>{complete ? "✓" : index + 1}</span><span className={`text-xs font-extrabold ${active ? "text-[#1453bb]" : "text-[#53627a]"}`}>{label}</span></button></li>; })}</ol><div className="mt-5 flex items-start gap-3 rounded-lg bg-[#fffaf1] p-4 text-[#b45309] [&>svg]:h-5 [&>svg]:w-5"><DashboardIcon name="shield" /><p className="text-[10px] leading-5 text-[#6b5a3d]">The provider supplies the verified legal name. Only submit accurate contact, identity and address details.</p></div></aside><section className="rounded-xl border border-[#dfe4ed] bg-white p-6 shadow-sm sm:p-8"><div className="flex items-start justify-between gap-4"><div><span className="text-[10px] font-extrabold tracking-[.16em] text-[#ff8a00]">STEP {step + 1} OF {kycSteps.length}</span><h2 className="mt-2 font-[Manrope] text-2xl font-extrabold tracking-[-.05em] text-[#0b1830]">{kycSteps[step]}</h2></div><span className="hidden h-11 w-11 place-items-center rounded-xl bg-[#edf4ff] text-[#1453bb] [&>svg]:h-5 [&>svg]:w-5 sm:grid"><DashboardIcon name="shield" /></span></div>{error && <p className="mt-5 rounded-lg border border-[#f3caca] bg-[#fff5f5] px-3 py-2 text-xs font-semibold leading-5 text-[#a32929]" role="alert">{error}</p>}{step === 0 && <div className="mt-6 grid gap-4 sm:grid-cols-2"><div className="flex items-start gap-3 rounded-lg border border-[#cfe0f7] bg-[#f4f8ff] p-4 sm:col-span-2"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#dceaff] text-xs font-extrabold text-[#1453bb]">ID</span><p className="text-xs leading-5 text-[#53627a]"><strong className="text-[#0b1830]">Full name supplied by the KYC provider.</strong> Hollyway will match the provider response to this user account instead of asking you to type your legal name again.</p></div><Field label="Date of birth"><input className={inputClass()} type="date" value={draft.dateOfBirth} onChange={(event) => update("dateOfBirth", event.target.value)} /></Field><Field label="Reachable phone number" hint="Hollyway may use this for transaction coordination."><input className={inputClass()} type="tel" value={draft.phone} onChange={(event) => update("phone", event.target.value)} placeholder="080..." /></Field><Field label="Country"><input className={`${inputClass()} bg-[#f8fafc]`} value="Nigeria" readOnly /></Field></div>}{step === 1 && <div className="mt-6 grid gap-4 sm:grid-cols-2"><Field label="Identity document type" hint="The reference PDF notes that NIN may be required for fraud prevention."><select className={inputClass()} value={draft.documentType} onChange={(event) => update("documentType", event.target.value)}>{documentTypes.map((type) => <option key={type}>{type}</option>)}</select></Field><Field label="Document number"><input className={inputClass()} value={draft.documentNumber} onChange={(event) => update("documentNumber", event.target.value)} placeholder="Enter document number" /></Field><Field label="Document file" hint="The file name is kept in this local UI draft; secure upload starts with the API integration."><input className="sr-only" type="file" accept="image/*,.pdf" onChange={chooseDocument} id="kyc-document" /><label className="flex min-h-24 cursor-pointer items-center gap-3 rounded-lg border border-dashed border-[#b9c8dd] bg-[#f8fafc] px-4 hover:border-[#1453bb]" htmlFor="kyc-document"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#edf4ff] text-[#1453bb]">↑</span><span className="min-w-0"><b className="block truncate text-xs text-[#1453bb]">{draft.documentName || "Choose identity document"}</b><small className="mt-1 block text-[10px] text-[#8490a4]">PDF, JPG or PNG</small></span></label></Field></div>}{step === 2 && <div className="mt-6 grid gap-4 sm:grid-cols-2"><Field label="Residential address"><textarea className="min-h-24 rounded-lg border border-[#dfe4ed] bg-white px-3 py-3 text-xs font-medium text-[#0b1830] outline-none placeholder:text-[#9aa6b7] focus:border-[#1453bb] focus:ring-4 focus:ring-[#1453bb]/10 sm:col-span-2" value={draft.address} onChange={(event) => update("address", event.target.value)} placeholder="Street, area and house number" /></Field><Field label="City"><input className={inputClass()} value={draft.city} onChange={(event) => update("city", event.target.value)} placeholder="e.g. Ikeja" /></Field><Field label="State"><select className={inputClass()} value={draft.state} onChange={(event) => update("state", event.target.value)}><option value="">Select state</option>{nigerianStates.map((state) => <option key={state}>{state}</option>)}</select></Field></div>}{step === 3 && <div className="mt-6 space-y-4"><div className="grid gap-3 sm:grid-cols-2">{[["Verified name", "Supplied by KYC provider"], ["Date of birth", draft.dateOfBirth], ["Phone", draft.phone], ["Document", `${draft.documentType} · ${draft.documentNumber}`], ["File", draft.documentName], ["Address", `${draft.address}, ${draft.city}, ${draft.state}`]].map(([label, value]) => <div className="rounded-lg border border-[#eef1f4] bg-[#f8fafc] p-4" key={label}><small className="block text-[10px] font-extrabold tracking-[.1em] text-[#8995a8]">{label}</small><strong className="mt-2 block break-words text-xs text-[#0b1830]">{value || "Not provided"}</strong></div>)}</div><label className="flex items-start gap-3 rounded-lg border border-[#dfe4ed] p-4 text-xs leading-5 text-[#53627a]"><input className="mt-1 accent-[#1453bb]" type="checkbox" checked={draft.consent} onChange={(event) => update("consent", event.target.checked)} />I confirm that these details are accurate and I understand that Hollyway will only use them for account verification and safer transaction support.</label></div>}<div className="mt-7 flex flex-col-reverse gap-3 border-t border-[#eef1f4] pt-5 sm:flex-row sm:items-center sm:justify-between">{step > 0 ? <button className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#dfe4ed] px-4 text-xs font-extrabold text-[#53627a]" type="button" onClick={previousStep}><Arrow /> Back</button> : <span className="text-[10px] text-[#8995a8]">Your progress is saved locally.</span>}{step < kycSteps.length - 1 ? <button className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#1453bb] px-5 text-xs font-extrabold text-white hover:bg-[#0b3f91]" type="button" onClick={nextStep}>Continue <Arrow /></button> : <button className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#1453bb] px-5 text-xs font-extrabold text-white hover:bg-[#0b3f91]" type="button" onClick={submitKyc}>Save verification draft <Arrow /></button>}</div></section></div></div>;
}
