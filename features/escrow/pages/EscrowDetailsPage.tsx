"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Arrow } from "../../../components/ui/Arrow";
import { showToast } from "../../../components/ui/ToastProvider";
import DashboardPageHeader from "../../dashboard/components/DashboardPageHeader";
import EscrowPaymentProofForm from "../components/EscrowPaymentProofForm";
import EscrowStatusPill from "../components/EscrowStatusPill";
import { formatMinorNaira, type EscrowRequest, type EscrowStatus } from "../data/escrow";
import { acceptFundingForEscrow, fetchEscrowTransaction } from "../data/escrowApi";

const stages = [
  ["Request submitted", "The parties and written conditions are recorded."],
  ["Hollyway review", "Hollyway confirms the reference, fee and agreement."],
  ["Funding confirmed", "The accepted funding party transfers to Hollyway and uploads proof."],
  ["Fulfilment", "The item, service or agreement follows the recorded terms."],
  ["Acceptance", "The receiving party checks the agreed conditions."],
  ["Release or close", "Hollyway records release, refund or completion."],
] as const;

const stageIndexes: Partial<Record<EscrowStatus, number>> = {
  draft: 0,
  pending_review: 1,
  approved: 2,
  awaiting_party_acceptance: 2,
  awaiting_funder: 2,
  payment_pending: 2,
  payment_verified: 2,
  payment_proof_submitted: 2,
  payment_received: 3,
  dispatch_booked: 3,
  in_transit: 3,
  delivered: 4,
  inspection: 4,
  buyer_confirmed: 5,
  released: 5,
  disputed: 4,
  refunded: 5,
  closed: 5,
  cancelled: 5,
  expired: 5,
};

function dateLabel(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" });
}

function feeLabel(request: EscrowRequest) {
  if (request.escrow_fee_min_minor === null || request.escrow_fee_max_minor === null) return "To be confirmed";
  if (request.escrow_fee_min_minor === request.escrow_fee_max_minor) return formatMinorNaira(request.escrow_fee_min_minor);
  return formatMinorNaira(request.escrow_fee_min_minor) + "–" + formatMinorNaira(request.escrow_fee_max_minor);
}

function roleLabel(role: string) {
  return role.replace("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function EscrowDetailsPage() {
  const params = useParams<{ reference: string }>();
  const [request, setRequest] = useState<EscrowRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [acceptingFunding, setAcceptingFunding] = useState(false);
  const [fundingTermsAccepted, setFundingTermsAccepted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const rawReference = Array.isArray(params.reference) ? params.reference[0] : params.reference;
    const reference = decodeURIComponent(rawReference || "");
    let active = true;
    setLoading(true);
    fetchEscrowTransaction(reference)
      .then((result) => { if (active) setRequest(result); })
      .catch((reason) => {
        if (active) {
          const message = reason instanceof Error ? reason.message : "This escrow request could not be loaded.";
          setError(message);
          showToast("error", message);
        }
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [params.reference]);

  async function acceptFunding() {
    if (!request) return;
    setAcceptingFunding(true);
    setError("");
    try {
      await acceptFundingForEscrow(request.reference, fundingTermsAccepted);
      setRequest(await fetchEscrowTransaction(request.reference));
      showToast("success", "Funding responsibility accepted.");
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "The funding invitation could not be accepted.";
      setError(message);
      showToast("error", message);
    } finally {
      setAcceptingFunding(false);
    }
  }

  if (loading) return <div className="w-full p-4 sm:p-6 lg:p-8"><section className="rounded-xl border border-[#dfe4ed] bg-white p-6 text-sm font-semibold text-[#53627a]">Loading escrow request…</section></div>;
  if (!request) return <div className="w-full p-4 sm:p-6 lg:p-8"><section className="rounded-xl border border-[#f1d8a9] bg-[#fffaf1] p-6 text-center"><h2 className="font-[Manrope] text-xl font-extrabold text-[#0b1830]">Escrow request unavailable</h2><p className="mt-2 text-xs leading-5 text-[#6b5a3d]">{error || "This request could not be found."}</p><Link className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-[#1453bb] px-4 text-xs font-extrabold text-white" href="/dashboard/escrow">Back to my escrow <Arrow /></Link></section></div>;

  const currentStage = stageIndexes[request.status] ?? 0;
  const latestPayment = request.payments[0];
  const nonFunderParties = request.participants.filter((item) => item.role !== "funder");

  return <div className="w-full space-y-4 p-4 sm:p-6 lg:p-8">
    <DashboardPageHeader action={<Link className="inline-flex items-center gap-2 text-xs font-extrabold text-[#1453bb] hover:underline" href="/dashboard/escrow">Back to my escrow <Arrow /></Link>} compact description="Review the agreement, bank-transfer proof status and next recorded step for this HWE request." kicker="ESCROW REQUEST" title={request.reference} />
    <section className="flex flex-col justify-between gap-3 rounded-lg border border-[#dfe4ed] bg-white p-4 sm:flex-row sm:items-start">
      <div><span className="text-[9px] font-extrabold tracking-[.14em] text-[#8b97a9]">{request.purpose_label.toUpperCase()}</span><h2 className="mt-1 font-[Manrope] text-lg font-extrabold text-[#0b1830]">{request.subject || "Untitled escrow agreement"}</h2><p className="mt-1 text-[10px] text-[#8490a4]">Created {dateLabel(request.created_at)} · Updated {dateLabel(request.updated_at)}</p></div>
      <EscrowStatusPill status={request.status} />
    </section>
    {request.can_accept_funding && request.funding_invitation?.status === "pending" && <section className="rounded-lg border border-[#cfe0f7] bg-[#f4f8ff] p-4"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><span className="text-[9px] font-extrabold tracking-[.14em] text-[#1453bb]">FUNDING INVITATION</span><h2 className="mt-1 text-sm font-extrabold text-[#0b1830]">You are invited to fund this escrow</h2><p className="mt-1 text-xs leading-5 text-[#53627a]">Accept responsibility for the transfer. After Hollyway Admin approves the request, the official account and exact amount will appear here.</p><label className="mt-3 flex items-start gap-2 text-[11px] font-semibold leading-5 text-[#53627a]"><input className="mt-1 h-4 w-4 accent-[#1453bb]" type="checkbox" checked={fundingTermsAccepted} onChange={(event) => setFundingTermsAccepted(event.currentTarget.checked)} /><span>I accept the written escrow terms and understand that Hollyway Admin confirms the transfer.</span></label></div><button className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#1453bb] px-4 text-xs font-extrabold text-white disabled:opacity-60" disabled={acceptingFunding || !fundingTermsAccepted} onClick={() => void acceptFunding()} type="button">{acceptingFunding ? "Accepting…" : "Accept and continue"} <Arrow /></button></div></section>}
    <section className="rounded-lg border border-[#dfe4ed] bg-white p-4">
      <span className="text-[9px] font-extrabold tracking-[.14em] text-[#1453bb]">PROTECTED FLOW</span>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{stages.map(([title, description], index) => <article className={"rounded-lg border p-3 " + (index < currentStage ? "border-[#bfe5d0] bg-[#f5fcf7]" : index === currentStage ? "border-[#cfe0f7] bg-[#f4f8ff]" : "border-[#eef1f4] bg-[#fafbfc]")} key={title}><div className="flex items-center gap-2"><span className={"grid h-6 w-6 place-items-center rounded-full text-[9px] font-extrabold " + (index <= currentStage ? "bg-[#1453bb] text-white" : "bg-[#eef1f4] text-[#8490a4]")}>{index < currentStage ? "✓" : String(index + 1).padStart(2, "0")}</span><h3 className="text-xs font-extrabold text-[#0b1830]">{title}</h3></div><p className="mt-2 text-[10px] leading-4 text-[#8490a4]">{description}</p></article>)}</div>
    </section>
    <section className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-lg border border-[#dfe4ed] bg-white p-4"><h2 className="font-[Manrope] text-base font-extrabold text-[#0b1830]">Agreement summary</h2><dl className="mt-3 space-y-2 text-xs"><div className="flex justify-between gap-3"><dt className="text-[#687895]">Purpose</dt><dd className="font-extrabold text-right text-[#0b1830]">{request.purpose_label}</dd></div><div className="flex justify-between gap-3"><dt className="text-[#687895]">Agreed value</dt><dd className="font-extrabold text-[#0b1830]">{formatMinorNaira(request.amount_minor)}</dd></div><div className="flex justify-between gap-3"><dt className="text-[#687895]">Hollyway fee</dt><dd className="font-extrabold text-[#0b1830]">{feeLabel(request)}</dd></div><div className="flex justify-between gap-3"><dt className="text-[#687895]">Fee coverage</dt><dd className="font-extrabold text-right text-[#0b1830]">{request.fee_coverage || "To be agreed"}</dd></div><div className="flex justify-between gap-3"><dt className="text-[#687895]">Delivery</dt><dd className="font-extrabold text-right text-[#0b1830]">{request.delivery_required ? request.courier_method || "Method to be confirmed" : "Not included"}</dd></div></dl></div>
      <div className="rounded-lg border border-[#dfe4ed] bg-white p-4"><h2 className="font-[Manrope] text-base font-extrabold text-[#0b1830]">Verified parties</h2><div className="mt-3 divide-y divide-[#eef1f4]">{nonFunderParties.map((party) => <div className="flex justify-between gap-3 py-2 text-xs first:pt-0" key={party.id}><span className="text-[#687895]">{roleLabel(party.role)}</span><span className="text-right font-extrabold text-[#0b1830]">{party.email || "Hollyway user"}{party.accepted_at && <small className="block text-[10px] font-medium text-[#8490a4]">Accepted</small>}</span></div>)}{request.funding_party_type === "other" && <p className="pt-2 text-[10px] leading-4 text-[#8490a4]">A separate funding party must accept the invitation and use the official transfer instructions.</p>}</div></div>
    </section>
    <section className="rounded-lg border border-[#dfe4ed] bg-white p-4"><h2 className="font-[Manrope] text-base font-extrabold text-[#0b1830]">Written terms</h2><p className="mt-2 text-xs leading-5 text-[#53627a]">{request.description || "No description provided."}</p>{request.item_condition && <p className="mt-3 text-xs leading-5 text-[#53627a]"><strong className="text-[#0b1830]">Item condition:</strong> {request.item_condition}</p>}{request.inspection_terms && <p className="mt-2 text-xs leading-5 text-[#53627a]"><strong className="text-[#0b1830]">Inspection:</strong> {request.inspection_terms}</p>}{request.scope && <p className="mt-3 text-xs leading-5 text-[#53627a]"><strong className="text-[#0b1830]">Scope:</strong> {request.scope}</p>}{request.deliverables && <p className="mt-2 text-xs leading-5 text-[#53627a]"><strong className="text-[#0b1830]">Deliverables:</strong> {request.deliverables}</p>}<p className="mt-3 border-t border-[#eef1f4] pt-3 text-xs leading-5 text-[#53627a]"><strong className="text-[#0b1830]">Release conditions:</strong> {request.release_conditions || "To be confirmed."}</p>{request.delivery_address && <p className="mt-2 text-xs leading-5 text-[#53627a]"><strong className="text-[#0b1830]">Delivery address:</strong> {request.delivery_address}</p>}</section>
    {request.manual_payment || request.manual_payment_unavailable ? <EscrowPaymentProofForm request={request} onUpdated={setRequest} /> : latestPayment ? <section className="rounded-lg border border-[#dfe4ed] bg-white p-4"><h2 className="font-[Manrope] text-base font-extrabold text-[#0b1830]">Funding record</h2><p className="mt-2 text-xs leading-5 text-[#53627a]">Transfer proof status: <strong className="text-[#0b1830]">{latestPayment.status === "proof_submitted" ? "Under Admin review" : latestPayment.status === "received" ? "Received by Hollyway" : latestPayment.status === "rejected" ? "Needs attention" : latestPayment.status}</strong>.</p>{latestPayment.admin_note && <p className="mt-2 text-xs leading-5 text-[#a32929]">{latestPayment.admin_note}</p>}</section> : null}
    <section className="rounded-lg border border-[#dfe4ed] bg-white p-4"><h2 className="font-[Manrope] text-base font-extrabold text-[#0b1830]">Activity</h2>{request.status_events.length ? <ol className="mt-3 divide-y divide-[#eef1f4]">{request.status_events.map((event) => <li className="py-2 first:pt-0" key={event.id}><p className="text-xs font-extrabold text-[#0b1830]">{event.to_status.replaceAll("_", " ")}</p><p className="mt-1 text-[10px] leading-4 text-[#8490a4]">{dateLabel(event.created_at)}{event.actor_label ? " · " + event.actor_label : ""}{event.reason ? " · " + event.reason : ""}</p></li>)}</ol> : <p className="mt-2 text-xs text-[#8490a4]">No activity recorded yet.</p>}</section>
    {request.status === "draft" && <Link className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1453bb] px-4 text-xs font-extrabold text-white" href={"/dashboard/escrow/new?draft=" + encodeURIComponent(request.reference)}>Continue draft <Arrow /></Link>}
  </div>;
}
