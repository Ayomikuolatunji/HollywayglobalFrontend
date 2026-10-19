"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Arrow } from "../../../components/ui/Arrow";
import { accountProfileUpdatedEvent } from "../data/accountApi";
import DashboardPageHeader from "../components/DashboardPageHeader";
import KycForm from "../components/KycForm";
import KycStatusPanel from "../components/KycStatusPanel";
import { useDashboard } from "../components/DashboardShell";
import { KycApiError, fetchKycStatus, verifyKyc, type KycServerSubmission } from "../data/kycApi";
import {
  clearKycLocalState,
  emptyKycDraft,
  getKycStorageKey,
  hasKycSubmission,
  isKycComplete,
  persistKycLocalState,
  readKycLocalState,
  resolveKycStatus,
  type KycDraft,
  type KycStatus,
} from "../data/kyc";

export default function KycPage() {
  const { accountEmail } = useDashboard();
  const storageKey = getKycStorageKey(accountEmail);
  const [draft, setDraft] = useState<KycDraft>(emptyKycDraft);
  const [status, setStatus] = useState<KycStatus>("not-started");
  const [submission, setSubmission] = useState<KycServerSubmission | null>(null);
  const [step, setStep] = useState(0);
  const [ready, setReady] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [statusError, setStatusError] = useState("");
  const [message, setMessage] = useState("");

  const loadStatus = useCallback(async (fallback: KycStatus = "not-started", signal?: AbortSignal) => {
    setLoadingStatus(true);
    setStatusError("");
    try {
      const remote = await fetchKycStatus(signal);
      setSubmission(remote.status === "not_submitted" ? null : remote);
      setStatus(resolveKycStatus(remote.status, fallback));
    } catch (requestError) {
      if (requestError instanceof DOMException && requestError.name === "AbortError") return;
      if (!(requestError instanceof KycApiError && requestError.status === 401)) {
        setStatusError(requestError instanceof Error ? requestError.message : "KYC status could not be loaded.");
      }
    } finally {
      setLoadingStatus(false);
    }
  }, []);

  useEffect(() => {
    if (!accountEmail) return;
    const controller = new AbortController();
    const local = readKycLocalState(storageKey);
    setDraft(local.draft);
    setStatus(local.status);
    setReady(true);
    void loadStatus(local.status, controller.signal);
    return () => controller.abort();
  }, [accountEmail, loadStatus, storageKey]);

  useEffect(() => {
    if (ready && accountEmail) persistKycLocalState(draft, status, storageKey);
  }, [accountEmail, draft, ready, status, storageKey]);

  function update(field: keyof KycDraft, value: string | boolean) {
    setDraft((current) => ({ ...current, [field]: value } as KycDraft));
    if (!isKycComplete(status)) setStatus("draft");
    setError("");
    setMessage("");
  }

  function validateStep() {
    if (step === 0 && !/^\d{11}$/.test(draft.identityNumber)) {
      setError(`Enter your 11-digit ${draft.identityType} before continuing.`);
      return false;
    }
    if (step === 1 && !draft.consent) {
      setError("Confirm that your KYC details are accurate before submitting.");
      return false;
    }
    return true;
  }

  function clearVerificationAttempt() {
    setDraft((current) => ({ ...current, identityNumber: "" }));
  }

  function nextStep() {
    if (validateStep()) setStep((current) => Math.min(current + 1, 1));
  }

  function saveDraft() {
    setStatus((current) => (isKycComplete(current) ? current : "draft"));
    setMessage("Draft saved on this device. Your identity number is not stored in browser storage.");
    setError("");
  }

  async function submit() {
    if (!validateStep()) return;
    setSubmitting(true);
    setError("");
    setMessage("");
    try {
      const result = await verifyKyc({
        identityType: draft.identityType,
        identityNumber: draft.identityNumber,
      });
      setSubmission(result.submission);
      setStatus(result.submission.status);
      setMessage(result.message);
      if (result.submission.status === "approved") {
        window.dispatchEvent(
          new CustomEvent(accountProfileUpdatedEvent, {
            detail: { kycName: result.submission.legal_full_name || "" },
          }),
        );
      }
      clearVerificationAttempt();
      setStep(result.submission.status === "rejected" ? 0 : 1);
    } catch (requestError) {
      if (
        requestError instanceof KycApiError &&
        requestError.status === 422 &&
        requestError.submission?.status === "rejected"
      ) {
        setSubmission(requestError.submission);
        setStatus("rejected");
        setMessage(requestError.message);
        clearVerificationAttempt();
        setStep(0);
        return;
      }
      setError(requestError instanceof Error ? requestError.message : "KYC submission could not be completed.");
      setStep(0);
    } finally {
      setSubmitting(false);
    }
  }

  function startNewDraft() {
    clearKycLocalState(storageKey);
    setDraft(emptyKycDraft);
    setSubmission(null);
    setStatus("not-started");
    setStep(0);
    setError("");
    setMessage("");
  }

  if (!ready) return <div className="mx-auto w-full max-w-[1180px] space-y-6 p-5 sm:p-8"><DashboardPageHeader kicker="ACCOUNT" title="Identity verification" description="Loading your Hollyway verification status…" /><div className="rounded-xl border border-[#dfe4ed] bg-white p-6 text-sm text-[#53627a]">Checking your secure KYC status…</div></div>;

  const complete = isKycComplete(status);
  const showStatus = Boolean(submission && hasKycSubmission(status) && status !== "rejected");
  return <div className="mx-auto w-full max-w-[1180px] space-y-6 p-5 sm:p-8"><DashboardPageHeader kicker="ACCOUNT" title="Identity verification" description="Verify your identity for high-value transactions and account actions that require KYC." action={<Link className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#dfe4ed] px-4 text-xs font-extrabold text-[#53627a] hover:border-[#1453bb] hover:text-[#1453bb]" href="/dashboard/profile">Back to profile <Arrow /></Link>} />{statusError && <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#f1d8a9] bg-[#fffaf1] px-4 py-3 text-xs leading-5 text-[#6b5a3d]" role="alert"><span>{statusError} You can continue a saved draft.</span><button className="font-extrabold text-[#b8560d] hover:underline" type="button" onClick={() => void loadStatus(status)}>Retry</button></div>}{message && <p className={`rounded-lg border px-4 py-3 text-xs font-semibold leading-5 ${complete ? "border-[#bfe5d0] bg-[#f1fbf5] text-[#14733d]" : "border-[#cfe0f7] bg-[#f4f8ff] text-[#31527f]"}`} role="status">{message}</p>}{status === "rejected" && submission?.rejection_reason && <div className="rounded-lg border border-[#f3caca] bg-[#fff5f5] px-4 py-3 text-xs leading-5 text-[#8d2c2c]"><strong>Reason for rejection:</strong> {submission.rejection_reason}</div>}{showStatus && submission ? <KycStatusPanel submission={submission} loading={loadingStatus} onRefresh={() => void loadStatus(status)} /> : <KycForm draft={draft} step={step} error={error} submitting={submitting} onUpdate={update} onNext={nextStep} onPrevious={() => { setError(""); setStep((current) => Math.max(current - 1, 0)); }} onSave={saveDraft} onSubmit={submit} />}{status === "rejected" && <button className="text-xs font-extrabold text-[#b8560d] hover:underline" type="button" onClick={startNewDraft}>Start a new verification draft</button>}</div>;
}
