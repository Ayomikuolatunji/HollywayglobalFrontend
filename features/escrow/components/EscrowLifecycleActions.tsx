"use client";

import { useState } from "react";
import { showToast } from "../../../components/ui/ToastProvider";
import {
  fetchEscrowTransaction,
  openEscrowDispute,
  requestEscrowRelease,
  updateEscrowFulfilment,
  updateEscrowInspection,
  uploadEscrowEvidence,
} from "../data/escrowApi";
import { saveEscrowSettlementAccount } from "../data/settlementApi";
import type { EscrowRequest } from "../data/escrow";

const fieldClass = "mt-1 h-9 w-full rounded-md border border-[#cfd8e6] bg-white px-2.5 text-xs text-[#0b1830] outline-none focus:border-[#1453bb]";

function payoutRole(purpose: EscrowRequest["purpose"]) {
  return purpose === "goods_sale" ? "seller" : purpose === "service_agreement" ? "provider" : "party_b";
}

function actionLabel(request: EscrowRequest) {
  if (request.viewer?.can_book_dispatch) return "Record dispatch";
  if (request.viewer?.can_mark_in_transit) return "Mark in transit";
  if (request.viewer?.can_mark_delivered) return "Mark delivered";
  if (request.viewer?.can_start_inspection) return "Start inspection";
  if (request.viewer?.can_accept) return "Confirm acceptance";
  return null;
}

export default function EscrowLifecycleActions({
  request,
  onUpdated,
}: {
  request: EscrowRequest;
  onUpdated: (request: EscrowRequest) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [carrier, setCarrier] = useState(request.fulfilment?.carrier_name || request.courier_method || "");
  const [tracking, setTracking] = useState(request.fulfilment?.tracking_reference || "");
  const [note, setNote] = useState("");
  const [disputeReason, setDisputeReason] = useState("");
  const [disputeDetails, setDisputeDetails] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [evidenceKind, setEvidenceKind] = useState("photo");
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [releaseDetails, setReleaseDetails] = useState("");
  const viewer = request.viewer;
  const activeDispute = request.disputes?.find((item) => item.status !== "resolved" && item.status !== "rejected") || null;
  const pendingRelease = request.release_requests?.find((item) => item.status === "pending") || null;
  const canSettle = Boolean(viewer?.roles.includes(payoutRole(request.purpose)) && !request.settlement_account);
  const nextAction = actionLabel(request);

  async function refresh() {
    onUpdated(await fetchEscrowTransaction(request.reference));
  }

  async function submitFulfilment(action: "book_dispatch" | "mark_in_transit" | "mark_delivered" | "start_inspection") {
    setBusy(true);
    setError("");
    try {
      const updated = await updateEscrowFulfilment(request.reference, {
        action,
        carrierName: carrier,
        trackingReference: tracking,
        note,
      });
      onUpdated(updated);
      setNote("");
      showToast("success", action === "start_inspection" ? "Inspection is now open." : "Escrow fulfilment updated.");
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "The escrow update could not be saved.";
      setError(message);
      showToast("error", message);
    } finally {
      setBusy(false);
    }
  }

  async function acceptInspection(decision: "accepted" | "disputed") {
    setBusy(true);
    setError("");
    try {
      const updated = await updateEscrowInspection(request.reference, decision, note);
      onUpdated(updated);
      setNote("");
      showToast("success", decision === "accepted" ? "Acceptance recorded for Admin release." : "Dispute opened. Add evidence to protect the record.");
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "The inspection decision could not be saved.";
      setError(message);
      showToast("error", message);
    } finally {
      setBusy(false);
    }
  }

  async function submitDispute() {
    if (!disputeReason.trim() || !disputeDetails.trim()) {
      setError("Add the reason and details so Hollyway can review the dispute.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const updated = await openEscrowDispute(request.reference, disputeReason, disputeDetails);
      onUpdated(updated);
      setDisputeReason("");
      setDisputeDetails("");
      showToast("success", "Dispute opened. The 24-hour evidence window has started.");
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "The dispute could not be opened.";
      setError(message);
      showToast("error", message);
    } finally {
      setBusy(false);
    }
  }

  async function saveSettlement() {
    if (!bankName.trim() || accountNumber.replace(/\D/g, "").length !== 10) {
      setError("Enter the settlement bank and its 10-digit account number.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await saveEscrowSettlementAccount(request.reference, { bankName, accountNumber });
      await refresh();
      setBankName("");
      setAccountNumber("");
      showToast("success", "Settlement account verified and saved securely.");
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "Settlement details could not be verified.";
      setError(message);
      showToast("error", message);
    } finally {
      setBusy(false);
    }
  }

  async function uploadEvidence() {
    if (!activeDispute || !evidenceFile) {
      setError("Choose an evidence file before uploading.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await uploadEscrowEvidence(request.reference, activeDispute.id, { kind: evidenceKind, file: evidenceFile });
      await refresh();
      setEvidenceFile(null);
      showToast("success", "Evidence uploaded to the escrow record.");
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "Evidence could not be uploaded.";
      setError(message);
      showToast("error", message);
    } finally {
      setBusy(false);
    }
  }

  async function submitReleaseRequest() {
    if (releaseDetails.trim().length < 3) {
      setError("Explain why Hollyway should review this escrow for release.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const updated = await requestEscrowRelease(request.reference, releaseDetails);
      onUpdated(updated);
      setReleaseDetails("");
      showToast("success", "Your payout release request was sent to Hollyway Admin.");
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "The release request could not be sent.";
      setError(message);
      showToast("error", message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      {(nextAction || canSettle) && (
        <section className="rounded-lg border border-[#cfe0f7] bg-[#f7faff] p-4">
          <p className="text-[9px] font-extrabold tracking-[.14em] text-[#1453bb]">YOUR NEXT STEP</p>
          {nextAction && <h2 className="mt-1 text-sm font-extrabold text-[#0b1830]">{nextAction}</h2>}
          {viewer?.can_book_dispatch && (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <label className="text-[10px] font-bold text-[#53627a]">Courier or carrier<input className={fieldClass} value={carrier} onChange={(event) => setCarrier(event.target.value)} placeholder="Optional until booked" /></label>
              <label className="text-[10px] font-bold text-[#53627a]">Tracking reference<input className={fieldClass} value={tracking} onChange={(event) => setTracking(event.target.value)} placeholder="Add when available" /></label>
            </div>
          )}
          {(viewer?.can_book_dispatch || viewer?.can_start_inspection || viewer?.can_accept) && (
            <label className="mt-3 block text-[10px] font-bold text-[#53627a]">Note for the record<textarea className="mt-1 min-h-16 w-full rounded-md border border-[#cfd8e6] p-2.5 text-xs outline-none focus:border-[#1453bb]" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Add only what Admin and the other party need to know." /></label>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            {viewer?.can_book_dispatch && <button className="h-9 rounded-md bg-[#1453bb] px-3 text-xs font-extrabold text-white disabled:opacity-50" disabled={busy} onClick={() => void submitFulfilment("book_dispatch")} type="button">{busy ? "Saving…" : "Record dispatch"}</button>}
            {viewer?.can_mark_in_transit && <button className="h-9 rounded-md bg-[#1453bb] px-3 text-xs font-extrabold text-white disabled:opacity-50" disabled={busy} onClick={() => void submitFulfilment("mark_in_transit")} type="button">Mark in transit</button>}
            {viewer?.can_mark_delivered && <button className="h-9 rounded-md bg-[#1453bb] px-3 text-xs font-extrabold text-white disabled:opacity-50" disabled={busy} onClick={() => void submitFulfilment("mark_delivered")} type="button">Mark delivered</button>}
            {viewer?.can_start_inspection && <button className="h-9 rounded-md bg-[#1453bb] px-3 text-xs font-extrabold text-white disabled:opacity-50" disabled={busy} onClick={() => void submitFulfilment("start_inspection")} type="button">Start inspection</button>}
            {viewer?.can_accept && <button className="h-9 rounded-md bg-[#1f7a5c] px-3 text-xs font-extrabold text-white disabled:opacity-50" disabled={busy} onClick={() => void acceptInspection("accepted")} type="button">Confirm acceptance</button>}
          </div>
          {canSettle && <div className="mt-4 border-t border-[#dce7f7] pt-3"><p className="text-xs font-extrabold text-[#0b1830]">Settlement bank details</p><p className="mt-1 text-[10px] leading-4 text-[#687895]">Use your verified Hollyway identity. The account name is checked before Admin can release funds.</p><div className="mt-2 grid gap-2 sm:grid-cols-2"><input className={fieldClass} value={bankName} onChange={(event) => setBankName(event.target.value)} placeholder="Bank name" /><input className={fieldClass} inputMode="numeric" value={accountNumber} onChange={(event) => setAccountNumber(event.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="10-digit account number" /></div><button className="mt-2 h-9 rounded-md border border-[#1453bb] px-3 text-xs font-extrabold text-[#1453bb] disabled:opacity-50" disabled={busy} onClick={() => void saveSettlement()} type="button">Verify settlement account</button></div>}
        </section>
      )}

      {request.fulfilment && <section className="rounded-lg border border-[#dfe4ed] bg-white p-4"><div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-sm font-extrabold text-[#0b1830]">Fulfilment</h2><span className="text-[10px] font-extrabold uppercase tracking-[.1em] text-[#53627a]">{request.fulfilment.status.replaceAll("_", " ")}</span></div><p className="mt-2 text-xs text-[#53627a]">{request.fulfilment.carrier_name || "Courier not recorded"}{request.fulfilment.tracking_reference ? ` · ${request.fulfilment.tracking_reference}` : ""}</p></section>}

      {(viewer?.can_request_release || request.release_requests?.length) && <section className="rounded-lg border border-[#cfe0f7] bg-[#f7faff] p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-[9px] font-extrabold tracking-[.14em] text-[#1453bb]">ADMIN RELEASE REVIEW</p><h2 className="mt-1 text-sm font-extrabold text-[#0b1830]">Request payout release</h2><p className="mt-1 max-w-2xl text-[10px] leading-4 text-[#53627a]">Any escrow participant can ask Hollyway Admin to review release. Admin releases only after the recorded acceptance conditions and settlement checks are complete.</p></div>{pendingRelease && <span className="rounded-full bg-[#fff4d8] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[.08em] text-[#8b5b08]">Awaiting review</span>}</div>{viewer?.can_request_release && <div className="mt-3"><textarea className="min-h-16 w-full rounded-md border border-[#cfd8e6] bg-white p-2.5 text-xs outline-none focus:border-[#1453bb]" value={releaseDetails} onChange={(event) => setReleaseDetails(event.target.value)} placeholder="Explain what has been completed and why Admin should review release." /><button className="mt-2 h-9 rounded-md bg-[#1453bb] px-3 text-xs font-extrabold text-white disabled:opacity-50" disabled={busy} onClick={() => void submitReleaseRequest()} type="button">{busy ? "Sending…" : "Send release request"}</button></div>}{request.release_requests?.map((item) => <div className="mt-3 border-t border-[#dce7f7] pt-3" key={item.id}><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-[10px] font-extrabold uppercase tracking-[.08em] text-[#53627a]">{item.requested_by_role || "Participant"} · {item.status.replaceAll("_", " ")}</p><span className="text-[10px] text-[#8490a4]">{new Date(item.created_at).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })}</span></div><p className="mt-1 text-xs leading-5 text-[#53627a]">{item.details}</p>{item.review_note && <p className="mt-1 text-[10px] font-semibold text-[#a32929]">Admin: {item.review_note}</p>}</div>)}</section>}

      {viewer?.can_open_dispute && !activeDispute && <section className="rounded-lg border border-[#ecd6ad] bg-[#fffaf1] p-4"><h2 className="text-sm font-extrabold text-[#0b1830]">Report a problem</h2><p className="mt-1 text-[10px] leading-4 text-[#6b5a3d]">Open a dispute if the recorded item, service or agreement terms were not met. Add photos, videos, waybills or chat records within 24 hours.</p><input className={fieldClass} value={disputeReason} onChange={(event) => setDisputeReason(event.target.value)} placeholder="Reason, for example: item differs from terms" /><textarea className="mt-2 min-h-16 w-full rounded-md border border-[#cfd8e6] p-2.5 text-xs outline-none focus:border-[#1453bb]" value={disputeDetails} onChange={(event) => setDisputeDetails(event.target.value)} placeholder="Explain what happened and what outcome you are requesting." /><button className="mt-2 h-9 rounded-md border border-[#b77914] px-3 text-xs font-extrabold text-[#8b5b08] disabled:opacity-50" disabled={busy} onClick={() => void submitDispute()} type="button">Open dispute</button></section>}

      {activeDispute && <section className="rounded-lg border border-[#e3c6c2] bg-[#fff8f7] p-4"><div className="flex items-center justify-between gap-2"><h2 className="text-sm font-extrabold text-[#0b1830]">Dispute record</h2><span className="text-[10px] font-extrabold uppercase tracking-[.1em] text-[#a32929]">{activeDispute.status.replaceAll("_", " ")}</span></div><p className="mt-2 text-xs font-extrabold text-[#0b1830]">{activeDispute.reason}</p><p className="mt-1 text-xs leading-5 text-[#53627a]">{activeDispute.details}</p><p className="mt-2 text-[10px] font-bold text-[#a32929]">Evidence due {activeDispute.evidence_deadline_at ? new Date(activeDispute.evidence_deadline_at).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" }) : "within 24 hours"} · Admin review target {activeDispute.response_deadline_at ? new Date(activeDispute.response_deadline_at).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" }) : "within 48 hours"}</p><div className="mt-3 flex flex-wrap items-end gap-2"><label className="text-[10px] font-bold text-[#53627a]">Evidence type<select className={fieldClass} value={evidenceKind} onChange={(event) => setEvidenceKind(event.target.value)}><option value="photo">Photo</option><option value="unboxing_video">Unboxing video</option><option value="waybill">Waybill</option><option value="chat">Chat record</option><option value="other">Other</option></select></label><label className="text-[10px] font-bold text-[#53627a]">File<input className="mt-1 block h-9 w-full text-[10px]" type="file" accept="image/jpeg,image/png,image/webp,application/pdf,video/mp4,video/quicktime" onChange={(event) => setEvidenceFile(event.target.files?.[0] || null)} /></label><button className="h-9 rounded-md bg-[#a32929] px-3 text-xs font-extrabold text-white disabled:opacity-50" disabled={busy} onClick={() => void uploadEvidence()} type="button">Upload evidence</button></div></section>}

      {request.payout && <section className="rounded-lg border border-[#dfe4ed] bg-white p-4"><h2 className="text-sm font-extrabold text-[#0b1830]">Payout record</h2><p className="mt-1 text-xs text-[#53627a]">{request.payout.status.replaceAll("_", " ")} · {request.payout.reference}</p></section>}
      {error && <p className="rounded-md border border-[#f1c8c3] bg-[#fff5f3] p-3 text-xs font-semibold text-[#a32929]">{error}</p>}
    </div>
  );
}
