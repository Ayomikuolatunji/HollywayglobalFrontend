"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Brand from "../../../components/ui/Brand";
import { Arrow } from "../../../components/ui/Arrow";
import { fetchEscrowTransaction } from "../data/escrowApi";
import { showToast } from "../../../components/ui/ToastProvider";
import type { EscrowRequest } from "../data/escrow";
import EscrowHeader from "../components/EscrowHeader";
import EscrowCreateRail from "../components/EscrowCreateRail";
import EscrowRequestConfirmation from "../components/EscrowRequestConfirmation";
import EscrowRequestForm from "../components/EscrowRequestForm";

export default function EscrowPage({ standalone = false }: { standalone?: boolean }) {
  const searchParams = useSearchParams();
  const draftReference = searchParams.get("draft") || "";
  const [draftRequest, setDraftRequest] = useState<EscrowRequest | null>(null);
  const [submittedRequest, setSubmittedRequest] = useState<EscrowRequest | null>(null);
  const [draftSaved, setDraftSaved] = useState(false);
  const [transactionValue, setTransactionValue] = useState(0);
  const [draftLoading, setDraftLoading] = useState(Boolean(draftReference));
  const [draftError, setDraftError] = useState("");

  useEffect(() => {
    if (!draftReference) {
      setDraftRequest(null);
      setDraftLoading(false);
      return;
    }
    let active = true;
    setDraftLoading(true);
    setDraftError("");
    fetchEscrowTransaction(draftReference)
      .then((request) => {
        if (active) {
          setDraftRequest(request);
          setDraftSaved(request.status === "draft");
        }
      })
      .catch((reason) => {
        if (active) {
          const message = reason instanceof Error ? reason.message : "This escrow draft could not be loaded.";
          setDraftError(message);
          showToast("error", message);
        }
      })
      .finally(() => {
        if (active) setDraftLoading(false);
      });
    return () => {
      active = false;
    };
  }, [draftReference]);

  const updateTransactionValue = useCallback((value: number) => {
    setTransactionValue(value);
  }, []);

  const backHref = standalone ? "/" : "/dashboard/escrow";
  const backLabel = standalone ? "Return to website" : "Back to my escrow";

  const content = (
    <main className="mx-auto w-full max-w-[1440px] space-y-5 p-4 sm:p-6 lg:p-8">
      <EscrowHeader action={<Link className="inline-flex items-center gap-2 text-xs font-extrabold text-[#1453bb] hover:underline" href={backHref}>{backLabel} <Arrow /></Link>} />
      {submittedRequest ? (
        <EscrowRequestConfirmation
          onCreateAnother={() => {
            setSubmittedRequest(null);
            setDraftRequest(null);
            setDraftSaved(false);
            setTransactionValue(0);
          }}
          request={submittedRequest}
        />
      ) : draftLoading ? (
        <section className="rounded-xl border border-[#dfe4ed] bg-white p-6 text-sm font-semibold text-[#53627a]">Loading your saved escrow draft…</section>
      ) : draftError ? (
        <section className="rounded-xl border border-[#f1d8a9] bg-[#fffaf1] p-5 text-sm font-semibold text-[#6b5a3d]" role="alert">{draftError}</section>
      ) : (
        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
          <EscrowRequestForm
            initialRequest={draftRequest}
            key={draftRequest?.reference || "new-escrow-request"}
            onDraftSaved={(request) => {
              setDraftRequest(request);
              setDraftSaved(true);
            }}
            onSubmitted={setSubmittedRequest}
            onTransactionValueChange={updateTransactionValue}
          />
          <EscrowCreateRail draftSaved={draftSaved} transactionValue={transactionValue} />
        </div>
      )}
    </main>
  );

  if (standalone) {
    return <div className="min-h-screen bg-[#eef1f5] text-[#0b1830]"><header className="flex min-h-[70px] items-center border-b border-[#dfe4ed] bg-white px-4 sm:px-8"><Brand /></header>{content}</div>;
  }
  return content;
}
