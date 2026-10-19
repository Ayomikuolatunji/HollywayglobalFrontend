"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Arrow } from "../../../components/ui/Arrow";
import { showToast } from "../../../components/ui/ToastProvider";
import DashboardPageHeader from "../../dashboard/components/DashboardPageHeader";
import EscrowAgreementDetails from "../components/EscrowAgreementDetails";
import EscrowFundingAction from "../components/EscrowFundingAction";
import EscrowLifecycleActions from "../components/EscrowLifecycleActions";
import EscrowStatusPill from "../components/EscrowStatusPill";
import { shouldShowEscrowPaymentAction, type EscrowRequest, type EscrowStatus } from "../data/escrow";
import { acceptFundingForEscrow, fetchEscrowTransaction } from "../data/escrowApi";

const stages = [
  ["Request submitted", "The parties and written conditions are recorded."],
  ["Funding responsibility", "The person paying accepts the terms and responsibility for the transfer."],
  ["Transfer to Hollyway", "Use the official Hollyway account and exact amount shown here."],
  ["Receipt review", "Upload the transfer record; Hollyway Admin checks and confirms the payment."],
  ["Fulfilment and acceptance", "The item, service or agreement follows the recorded terms."],
  ["Release or close", "Hollyway records release, refund or completion."],
] as const;

const stageIndexes: Partial<Record<EscrowStatus, number>> = {
  draft: 0,
  pending_review: 1,
  approved: 2,
  awaiting_party_acceptance: 1,
  awaiting_funder: 1,
  payment_pending: 2,
  payment_verified: 4,
  payment_proof_submitted: 3,
  payment_received: 4,
  dispatch_booked: 4,
  in_transit: 4,
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

function EscrowProgress({ request }: { request: EscrowRequest }) {
  const currentStage = stageIndexes[request.status] ?? 0;
  return (
    <section className="rounded-lg border border-[#dfe4ed] bg-white p-4">
      <span className="text-[9px] font-extrabold tracking-[.14em] text-[#1453bb]">PROTECTED FLOW</span>
      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {stages.map(([title, description], index) => (
          <article className={`rounded-lg border p-3 ${index < currentStage ? "border-[#bfe5d0] bg-[#f5fcf7]" : index === currentStage ? "border-[#cfe0f7] bg-[#f4f8ff]" : "border-[#eef1f4] bg-[#fafbfc]"}`} key={title}>
            <div className="flex items-center gap-2">
              <span className={`grid h-6 w-6 place-items-center rounded-full text-[9px] font-extrabold ${index <= currentStage ? "bg-[#1453bb] text-white" : "bg-[#eef1f4] text-[#8490a4]"}`}>{index < currentStage ? "✓" : String(index + 1).padStart(2, "0")}</span>
              <h3 className="text-xs font-extrabold text-[#0b1830]">{title}</h3>
            </div>
            <p className="mt-2 text-[10px] leading-4 text-[#8490a4]">{description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function EscrowActivity({ request }: { request: EscrowRequest }) {
  return (
    <section className="rounded-lg border border-[#dfe4ed] bg-white p-4">
      <h2 className="text-sm font-extrabold text-[#0b1830]">Activity</h2>
      {request.status_events.length ? (
        <ol className="mt-3 divide-y divide-[#eef1f4]">
          {request.status_events.map((event) => (
            <li className="py-2 first:pt-0" key={event.id}>
              <p className="text-xs font-extrabold text-[#0b1830]">{event.to_status.replaceAll("_", " ")}</p>
              <p className="mt-1 text-[10px] leading-4 text-[#8490a4]">{dateLabel(event.created_at)}{event.actor_label ? ` · ${event.actor_label}` : ""}{event.reason ? ` · ${event.reason}` : ""}</p>
            </li>
          ))}
        </ol>
      ) : <p className="mt-2 text-xs text-[#8490a4]">No activity recorded yet.</p>}
    </section>
  );
}

function FundingRecord({ request }: { request: EscrowRequest }) {
  const payment = request.payments[0];
  if (!payment) return null;
  const status = payment.status === "proof_submitted" ? "Under Admin review" : payment.status === "received" ? "Received by Hollyway" : payment.status === "rejected" ? "Needs attention" : payment.status;
  return (
    <section className="rounded-lg border border-[#dfe4ed] bg-white p-4">
      <h2 className="text-sm font-extrabold text-[#0b1830]">Funding record</h2>
      <p className="mt-2 text-xs leading-5 text-[#53627a]">Transfer proof status: <strong className="text-[#0b1830]">{status}</strong>.</p>
      {payment.admin_note && <p className="mt-2 text-xs leading-5 text-[#a32929]">{payment.admin_note}</p>}
    </section>
  );
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
      showToast("success", "Funding responsibility accepted. Payment details are ready.");
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

  const payerView = shouldShowEscrowPaymentAction(request);

  return (
    <div className="w-full space-y-4 p-4 sm:p-6 lg:p-8">
      <DashboardPageHeader
        action={<Link className="inline-flex items-center gap-2 text-xs font-extrabold text-[#1453bb] hover:underline" href="/dashboard/escrow">Back to my escrow <Arrow /></Link>}
        compact
        description={payerView ? "Review the agreement, then complete the payment step." : "Review the agreement, payment status and next recorded step."}
        kicker="ESCROW REQUEST"
        title={request.reference}
      />
      <section className="flex flex-col justify-between gap-3 rounded-lg border border-[#dfe4ed] bg-white p-4 sm:flex-row sm:items-start">
        <div><span className="text-[9px] font-extrabold tracking-[.14em] text-[#8b97a9]">{request.purpose_label.toUpperCase()}</span><h2 className="mt-1 font-[Manrope] text-lg font-extrabold text-[#0b1830]">{request.subject || "Untitled escrow agreement"}</h2><p className="mt-1 text-[10px] text-[#8490a4]">Created {dateLabel(request.created_at)} · Updated {dateLabel(request.updated_at)}</p></div>
        <EscrowStatusPill status={request.status} />
      </section>

      {payerView ? (
        <>
          <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(340px,420px)]">
            <EscrowAgreementDetails request={request} />
            <div className="lg:sticky lg:top-24">
              <EscrowFundingAction
                accepting={acceptingFunding}
                error={error}
                onAccept={() => void acceptFunding()}
                onTermsChange={setFundingTermsAccepted}
                onUpdated={setRequest}
                request={request}
                termsAccepted={fundingTermsAccepted}
              />
            </div>
          </div>
          <details className="rounded-lg border border-[#dfe4ed] bg-white p-4">
            <summary className="cursor-pointer text-sm font-extrabold text-[#0b1830]">View protected flow</summary>
            <div className="mt-4"><EscrowProgress request={request} /></div>
          </details>
          <details className="rounded-lg border border-[#dfe4ed] bg-white p-4">
            <summary className="cursor-pointer text-sm font-extrabold text-[#0b1830]">View activity</summary>
            <div className="mt-4"><EscrowActivity request={request} /></div>
          </details>
        </>
      ) : (
        <>
          <EscrowProgress request={request} />
          <EscrowAgreementDetails request={request} />
          <FundingRecord request={request} />
          <EscrowLifecycleActions request={request} onUpdated={setRequest} />
          <EscrowActivity request={request} />
        </>
      )}

      {request.status === "draft" && <Link className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1453bb] px-4 text-xs font-extrabold text-white" href={`/dashboard/escrow/new?draft=${encodeURIComponent(request.reference)}`}>Continue draft <Arrow /></Link>}
    </div>
  );
}
