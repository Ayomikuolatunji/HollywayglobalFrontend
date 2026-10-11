"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ApiResponseError } from "../../../components/api/apiResponse";
import Brand from "../../../components/ui/Brand";
import { Arrow } from "../../../components/ui/Arrow";
import EscrowAgreementDetails from "../components/EscrowAgreementDetails";
import EscrowInvitationAcceptance, { type FundingInvitationPreview } from "../components/EscrowInvitationAcceptance";
import EscrowPaymentProofForm from "../components/EscrowPaymentProofForm";
import EscrowStatusPill from "../components/EscrowStatusPill";
import { fetchEscrowTransaction, fetchFundingInvitation, acceptFundingInvitation } from "../data/escrowApi";
import type { EscrowRequest } from "../data/escrow";

export default function FundingInvitationPage() {
  const [token, setToken] = useState("");
  const [preview, setPreview] = useState<FundingInvitationPreview | null>(null);
  const [request, setRequest] = useState<EscrowRequest | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [signInRequired, setSignInRequired] = useState(false);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const queryToken = new URLSearchParams(window.location.search).get("token") || "";
    setToken(queryToken);
    if (!queryToken) {
      setError("This funding invitation link is incomplete.");
      setLoading(false);
      return;
    }
    fetchFundingInvitation(queryToken)
      .then((data) => setPreview(data as FundingInvitationPreview))
      .catch((reason) => setError(reason instanceof Error ? reason.message : "This funding invitation is invalid or expired."))
      .finally(() => setLoading(false));
  }, []);

  async function accept() {
    if (!token || !termsAccepted) {
      setError("Accept the written escrow terms before continuing.");
      return;
    }
    setError("");
    setAccepting(true);
    try {
      const accepted = await acceptFundingInvitation(token);
      setRequest(await fetchEscrowTransaction(accepted.reference));
    } catch (reason) {
      if (reason instanceof ApiResponseError && reason.status === 401) {
        setSignInRequired(true);
        setError("Sign in with the invited email address before accepting this funding invitation.");
      } else {
        setError(reason instanceof Error ? reason.message : "The funding invitation could not be accepted.");
      }
    } finally {
      setAccepting(false);
    }
  }

  const returnPath = "/escrow/funding?token=" + encodeURIComponent(token);
  const loginHref = "/login?next=" + encodeURIComponent(returnPath);
  const signupHref = "/signup?next=" + encodeURIComponent(returnPath);

  return (
    <div className="min-h-screen bg-[#eef1f5] text-[#0b1830]">
      <header className="flex min-h-[70px] items-center border-b border-[#dfe4ed] bg-white px-4 sm:px-8"><Brand /></header>
      <main className="mx-auto w-full max-w-6xl space-y-4 p-4 sm:p-8">
        {loading ? <section className="rounded-xl border border-[#dfe4ed] bg-white p-6 text-sm font-semibold text-[#53627a]">Loading funding invitation…</section> : request ? (
          <>
            <section className="rounded-lg border border-[#bfe5d0] bg-[#f5fcf7] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div><span className="text-[9px] font-extrabold tracking-[.14em] text-[#14733d]">PAYMENT RESPONSIBILITY ACCEPTED</span><h1 className="mt-1 font-[Manrope] text-xl font-extrabold tracking-[-.04em] text-[#0b1830]">{request.subject || "Protected Hollyway agreement"}</h1><p className="mt-1 text-xs leading-5 text-[#53627a]">Review the agreement on the left. Complete the manual transfer and receipt step on the right.</p></div>
                <EscrowStatusPill status={request.status} />
              </div>
            </section>
            <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(340px,420px)]">
              <EscrowAgreementDetails request={request} />
              <div className="lg:sticky lg:top-6"><EscrowPaymentProofForm request={request} onUpdated={setRequest} /></div>
            </div>
          </>
        ) : preview ? (
          <>
            <section className="rounded-lg border border-[#dfe4ed] bg-white p-4">
              <span className="text-[9px] font-extrabold tracking-[.14em] text-[#1453bb]">ESCROW DETAILS</span>
              <div className="mt-1 flex flex-wrap items-start justify-between gap-4"><div><h1 className="font-[Manrope] text-xl font-extrabold tracking-[-.04em] text-[#0b1830]">{preview.subject || "Protected Hollyway agreement"}</h1><p className="mt-1 text-xs leading-5 text-[#53627a]">{preview.purpose.replace("_", " ")} · {preview.reference}</p></div><p className="text-[10px] text-[#8490a4]">Invitation for {preview.invited_email}. Expires {new Date(preview.expires_at).toLocaleDateString("en-NG")}.</p></div>
            </section>
            <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(340px,420px)]">
              <section className="rounded-lg border border-[#dfe4ed] bg-white p-4">
                <h2 className="text-sm font-extrabold text-[#0b1830]">Review before payment</h2>
                <p className="mt-2 text-xs leading-5 text-[#53627a]">This request was created for you to fund. Confirm the value and Hollyway fee before accepting responsibility.</p>
                <dl className="mt-4 grid gap-3 border-t border-[#eef1f4] pt-4 sm:grid-cols-2"><Info label="Reference" value={preview.reference} /><Info label="Protected value" value={formatAmount(preview.amount_minor)} /><Info label="Hollyway fee" value={formatFee(preview)} /><Info label="Payment" value="Manual transfer after acceptance" /></dl>
              </section>
              <EscrowInvitationAcceptance accepting={accepting} error={error} loginHref={loginHref} onAccept={() => void accept()} onTermsChange={setTermsAccepted} preview={preview} signInRequired={signInRequired} signupHref={signupHref} termsAccepted={termsAccepted} />
            </div>
          </>
        ) : <section className="rounded-xl border border-[#f1d8a9] bg-[#fffaf1] p-6 text-center"><h1 className="font-[Manrope] text-xl font-extrabold text-[#0b1830]">Funding invitation unavailable</h1><p className="mt-2 text-xs leading-5 text-[#6b5a3d]">{error || "This invitation could not be loaded."}</p><Link className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-[#1453bb] px-4 text-xs font-extrabold text-white" href="/login">Go to sign in <Arrow /></Link></section>}
      </main>
    </div>
  );
}

function formatAmount(value: number | null) {
  if (value === null) return "To be confirmed";
  return `₦${Math.floor(value / 100).toLocaleString("en-NG")}`;
}

function formatFee(preview: FundingInvitationPreview) {
  if (preview.escrow_fee_min_minor === null || preview.escrow_fee_max_minor === null) return "To be confirmed";
  if (preview.escrow_fee_min_minor === preview.escrow_fee_max_minor) return formatAmount(preview.escrow_fee_min_minor);
  return `${formatAmount(preview.escrow_fee_min_minor)}–${formatAmount(preview.escrow_fee_max_minor)}`;
}

function Info({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-[9px] font-extrabold tracking-[.11em] text-[#8b97a9]">{label}</dt><dd className="mt-1 text-xs font-extrabold text-[#0b1830]">{value}</dd></div>;
}
