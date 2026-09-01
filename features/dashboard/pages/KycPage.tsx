"use client";

import Link from "next/link";
import { useEffect, useState, type ChangeEvent } from "react";
import { Arrow } from "../../../components/ui/Arrow";
import DashboardIcon from "../components/DashboardIcon";
import DashboardPageHeader from "../components/DashboardPageHeader";
import { emptyKycDraft, kycSteps, kycStorageKey, type KycDraft, type KycStatus } from "../data/kyc";
import Dropdown from "../../../components/forms/Dropdown";

const documentTypes = ["NIN", "International passport", "Driver's licence", "Voter's card"];
const nigerianStates = ["Lagos", "Abuja (FCT)", "Rivers", "Oyo", "Kano", "Enugu", "Kaduna", "Other"];

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return <label className="grid gap-2 text-[11px] font-extrabold text-[#31425e]"><span>{label}</span>{children}{hint && <small className="text-[10px] font-medium leading-4 text-[#8995a8]">{hint}</small>}</label>;
}

function inputClass() {
  return "h-11 rounded-lg border border-[#dfe4ed] bg-white px-3 text-xs font-medium text-[#0b1830] outline-none placeholder:text-[#9aa6b7] focus:border-[#1453bb] focus:ring-4 focus:ring-[#1453bb]/10";
}

function displayDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return match ? `${match[3]}/${match[2]}/${match[1]}` : value;
}

function formatDateInput(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
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
        setDraft({ ...emptyKycDraft, ...parsed.draft, dateOfBirth: displayDate(parsed.draft?.dateOfBirth || "") });
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
    if (step === 0 && draft.dateOfBirth && !/^\d{2}\/\d{2}\/\d{4}$/.test(draft.dateOfBirth)) {
      setError("Enter your date of birth as DD/MM/YYYY.");
      return false;
    }
    const required = step === 0 ? [draft.dateOfBirth, draft.phone, draft.country] : step === 1 ? [draft.documentType, draft.documentNumber, draft.documentName] : step === 2 ? [draft.address, draft.city, draft.state] : [draft.consent ? "confirmed" : ""];
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


}
