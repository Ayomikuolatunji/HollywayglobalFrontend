"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ApiResponseError } from "../../../components/api/apiResponse";
import Brand from "../../../components/ui/Brand";
import { Arrow } from "../../../components/ui/Arrow";
import EscrowPaymentProofForm from "../components/EscrowPaymentProofForm";
import EscrowStatusPill from "../components/EscrowStatusPill";
import { formatMinorNaira, type EscrowRequest } from "../data/escrow";
import { acceptFundingInvitation, fetchEscrowTransaction, fetchFundingInvitation } from "../data/escrowApi";

type Preview = {
  reference: string;
  purpose: string;
  subject: string;
  amount_minor: number | null;
  escrow_fee_min_minor: number | null;
  escrow_fee_max_minor: number | null;
  invited_email: string;
  expires_at: string;
};

function feeLabel(preview: Preview) {
  if (preview.escrow_fee_min_minor === null || preview.escrow_fee_max_minor === null) return "To be confirmed";
  if (preview.escrow_fee_min_minor === preview.escrow_fee_max_minor) return formatMinorNaira(preview.escrow_fee_min_minor);
  return formatMinorNaira(preview.escrow_fee_min_minor) + "–" + formatMinorNaira(preview.escrow_fee_max_minor);
}

export default function FundingInvitationPage() {
  const [token, setToken] = useState("");
  const [preview, setPreview] = useState<Preview | null>(null);
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
      .then((data) => setPreview(data as Preview))
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
      const detail = await fetchEscrowTransaction(accepted.reference);
      setRequest(detail);
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

  return <div className="min-h-screen bg-[#eef1f5] text-[#0b1830]"><header className="flex min-h-[70px] items-center border-b border-[#dfe4ed] bg-white px-4 sm:px-8"><Brand /></header><main className="mx-auto w-full max-w-3xl space-y-4 p-4 sm:p-8">
    {loading ? <section className="rounded-xl border border-[#dfe4ed] bg-white p-6 text-sm font-semibold text-[#53627a]">Loading funding invitation…</section> : request ? <><section className="rounded-xl border border-[#bfe5d0] bg-[#f5fcf7] p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><span className="text-[9px] font-extrabold tracking-[.14em] text-[#14733d]">FUNDING INVITATION ACCEPTED</span><h1 className="mt-2 font-[Manrope] text-2xl font-extrabold tracking-[-.05em] text-[#0b1830]">{request.subject || "Protected Hollyway agreement"}</h1><p className="mt-2 text-xs leading-5 text-[#53627a]">You are the accepted funding party for {request.reference}. Transfer only after reviewing the official instructions below.</p></div><EscrowStatusPill status={request.status} /></div></section><EscrowPaymentProofForm request={request} onUpdated={setRequest} /></> : preview ? <><section className="rounded-xl border border-[#dfe4ed] bg-white p-5"><span className="text-[9px] font-extrabold tracking-[.14em] text-[#1453bb]">HOLLYWAY FUNDING INVITATION</span><h1 className="mt-2 font-[Manrope] text-2xl font-extrabold tracking-[-.05em] text-[#0b1830]">{preview.subject || "Protected Hollyway agreement"}</h1><p className="mt-2 text-xs leading-5 text-[#53627a]">You were invited to fund this {preview.purpose.replace("_", " ")}. Review the reference and terms with the other parties before accepting.</p><dl className="mt-5 grid gap-3 sm:grid-cols-3"><div className="rounded-lg bg-[#f7f9fc] p-3"><dt className="text-[9px] font-extrabold tracking-[.12em] text-[#8b97a9]">REFERENCE</dt><dd className="mt-1 text-xs font-extrabold text-[#1453bb]">{preview.reference}</dd></div><div className="rounded-lg bg-[#f7f9fc] p-3"><dt className="text-[9px] font-extrabold tracking-[.12em] text-[#8b97a9]">PROTECTED VALUE</dt><dd className="mt-1 text-xs font-extrabold text-[#0b1830]">{formatMinorNaira(preview.amount_minor)}</dd></div><div className="rounded-lg bg-[#f7f9fc] p-3"><dt className="text-[9px] font-extrabold tracking-[.12em] text-[#8b97a9]">HOLLYWAY FEE</dt><dd className="mt-1 text-xs font-extrabold text-[#0b1830]">{feeLabel(preview)}</dd></div></dl><p className="mt-4 text-[10px] leading-5 text-[#8490a4]">Invitation for {preview.invited_email}. It expires {new Date(preview.expires_at).toLocaleDateString("en-NG")}.</p></section><section className="rounded-xl border border-[#dfe4ed] bg-white p-5"><h2 className="text-base font-extrabold text-[#0b1830]">Before you accept</h2><p className="mt-2 text-xs leading-5 text-[#53627a]">You will transfer manually to the official Hollyway account shown after acceptance. Upload the bank receipt on the site. Hollyway Admin checks the transfer and marks it received or rejected; WhatsApp is only for sharing the HWE reference, not for payment confirmation.</p><label className="mt-4 flex items-start gap-3 text-xs font-semibold leading-5 text-[#53627a]"><input className="mt-1 h-4 w-4 accent-[#1453bb]" type="checkbox" checked={termsAccepted} onChange={(event) => setTermsAccepted(event.currentTarget.checked)} /><span>I accept the written escrow terms and understand that Hollyway Admin must confirm my uploaded transfer proof.</span></label>{error && <p className="mt-3 rounded-lg border border-[#f0c5c0] bg-[#fff4f2] px-3 py-2 text-xs font-semibold text-[#a32929]" role="alert">{error}</p>}<div className="mt-4 flex flex-wrap gap-2">{signInRequired ? <><Link className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1453bb] px-4 text-xs font-extrabold text-white" href={loginHref}>Sign in with invited email <Arrow /></Link><Link className="inline-flex h-10 items-center rounded-lg border border-[#cfe0f7] px-4 text-xs font-extrabold text-[#1453bb]" href={signupHref}>Create account</Link></> : <button className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1453bb] px-4 text-xs font-extrabold text-white disabled:opacity-60" disabled={accepting} onClick={() => void accept()} type="button">{accepting ? "Checking account…" : "Accept and continue"} <Arrow /></button>}</div></section></> : <section className="rounded-xl border border-[#f1d8a9] bg-[#fffaf1] p-6 text-center"><h1 className="font-[Manrope] text-xl font-extrabold text-[#0b1830]">Funding invitation unavailable</h1><p className="mt-2 text-xs leading-5 text-[#6b5a3d]">{error || "This invitation could not be loaded."}</p><Link className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-[#1453bb] px-4 text-xs font-extrabold text-white" href="/login">Go to sign in <Arrow /></Link></section>}
  </main></div>;
}
