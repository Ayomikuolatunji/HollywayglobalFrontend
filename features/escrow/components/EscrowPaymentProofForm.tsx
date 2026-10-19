"use client";

import { useState, type FormEvent } from "react";
import { usePublicContact } from "../../../components/config/PublicContactProvider";
import { showToast } from "../../../components/ui/ToastProvider";
import {
  amountToMinor,
  formatEscrowAmountInput,
  formatMinorNaira,
  type EscrowRequest,
} from "../data/escrow";
import { submitEscrowPaymentProof } from "../data/escrowApi";

export default function EscrowPaymentProofForm({ request, onUpdated }: {
  request: EscrowRequest;
  onUpdated: (request: EscrowRequest) => void;
}) {
  const { contact } = usePublicContact();
  const payment = request.payments[0];
  const instructions = request.manual_payment;
  const alreadyReceived = payment?.status === "received";
  const [amount, setAmount] = useState(instructions ? formatEscrowAmountInput(String(Math.floor(instructions.amount_minor / 100))) : "");
  const [receipt, setReceipt] = useState<File | null>(null);
  const [transferReference, setTransferReference] = useState("");
  const [transferredAt, setTransferredAt] = useState("");
  const [senderName, setSenderName] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (alreadyReceived) {
    return <section className="rounded-xl border border-[#bfe5d0] bg-[#f5fcf7] p-4 sm:p-5">
      <span className="text-[9px] font-extrabold tracking-[.14em] text-[#14733d]">PAYMENT RECEIVED</span>
      <h2 className="mt-1 text-base font-extrabold text-[#0b1830]">Hollyway confirmed this transfer</h2>
      <p className="mt-2 text-xs leading-5 text-[#53627a]">Admin checked the transfer record and marked the payment received. Keep the receipt and HWE reference for your records, then follow the recorded fulfilment terms.</p>
    </section>;
  }

  if (!instructions) {
    return <section className="rounded-xl border border-[#dfe4ed] bg-white p-4"><h2 className="text-sm font-extrabold text-[#0b1830]">Bank transfer instructions</h2><p className="mt-2 text-xs leading-5 text-[#687895]">{request.manual_payment_unavailable || "Accept funding responsibility to reveal the official Hollyway account and payment amount."}</p></section>;
  }

  const waitingForReview = payment?.status === "proof_submitted";
  const whatsappHref = instructions?.admin_whatsapp_url || contact?.admin_whatsapp_url || "#contact";
  const whatsappLabel = instructions?.admin_whatsapp_number ? "Send receipt to Admin WhatsApp (" + instructions.admin_whatsapp_number + ")" : contact?.admin_phone ? `Send receipt to Admin WhatsApp (${contact.admin_phone})` : "Contact Hollyway about this receipt";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (alreadyReceived || waitingForReview) return;
    if (!receipt) {
      setError("Upload the bank transfer receipt before submitting.");
      return;
    }
    const submittedAmount = amountToMinor(amount);
    if (submittedAmount !== instructions.amount_minor) {
      setError("Enter the exact amount shown in the Hollyway transfer instructions.");
      return;
    }
    setSaving(true);
    try {
      const result = await submitEscrowPaymentProof(request.reference, {
        idempotencyKey: globalThis.crypto?.randomUUID?.() || String(Date.now()) + "-" + Math.random(),
        amountMinor: submittedAmount,
        receipt,
        transferReference,
        transferredAt,
        senderName,
        submittedNote: note,
      });
      onUpdated(result.transaction);
      setReceipt(null);
      showToast("success", "Transfer proof uploaded. Hollyway Admin will review it.");
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "The transfer proof could not be uploaded.";
      setError(message);
      showToast("error", message);
    } finally {
      setSaving(false);
    }
  }

  return <section className="rounded-xl border border-[#cfe0f7] bg-[#f4f8ff] p-4 sm:p-5">
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
      <div><span className="text-[9px] font-extrabold tracking-[.14em] text-[#1453bb]">MAKE PAYMENT</span><h2 className="mt-1 text-base font-extrabold text-[#0b1830]">Transfer to Hollyway, then send the receipt</h2><p className="mt-1 max-w-xl text-[10px] leading-5 text-[#53627a]">Use only the official details below. Admin checks the uploaded record against the bank record and marks it received or rejected.</p></div>
      {payment && <span className="rounded-full bg-white px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[.08em] text-[#1453bb]">{payment.status === "proof_submitted" ? "Under review" : payment.status === "received" ? "Received" : payment.status === "rejected" ? "Upload again" : "Awaiting proof"}</span>}
    </div>
    <div className="mt-4 grid gap-2 rounded-lg border border-[#dbe7f7] bg-white p-3 text-xs sm:grid-cols-3">
      <div><span className="block text-[9px] font-extrabold tracking-[.12em] text-[#8b97a9]">BANK</span><strong className="mt-1 block text-[#0b1830]">{instructions.bank_name}</strong></div>
      <div><span className="block text-[9px] font-extrabold tracking-[.12em] text-[#8b97a9]">ACCOUNT NAME</span><strong className="mt-1 block text-[#0b1830]">{instructions.account_name}</strong></div>
      <div><span className="block text-[9px] font-extrabold tracking-[.12em] text-[#8b97a9]">ACCOUNT NUMBER</span><strong className="mt-1 block font-mono text-[#0b1830]">{instructions.account_number}</strong></div>
    </div>
    <p className="mt-3 rounded-lg border border-[#f1d8a9] bg-[#fffaf1] p-3 text-[10px] font-semibold leading-5 text-[#6b5a3d]">Transfer exactly {formatMinorNaira(instructions.amount_minor)}. Include the HWE reference where your bank allows it, upload the receipt here, then share the same receipt and reference with Hollyway Admin on WhatsApp.</p>
    {payment?.status === "rejected" && <p className="mt-3 rounded-lg border border-[#f0c5c0] bg-[#fff4f2] p-3 text-[10px] font-semibold leading-5 text-[#a32929]">Admin note: {payment.admin_note || "The receipt needs attention. Upload a clearer or corrected record."}</p>}
    {alreadyReceived ? <p className="mt-4 rounded-lg border border-[#bfe5d0] bg-[#f5fcf7] p-3 text-xs font-bold text-[#14733d]">Hollyway Admin marked this transfer received. Keep the receipt and HWE reference for your records.</p> : waitingForReview ? <div className="mt-4 flex flex-wrap items-center gap-3"><p className="text-xs font-bold text-[#53627a]">Your receipt is with Hollyway Admin for review.</p><a className="text-xs font-extrabold text-[#1453bb] hover:underline" href={whatsappHref} rel="noreferrer" target="_blank">{whatsappLabel}</a></div> : <form className="mt-4 grid gap-3 sm:grid-cols-2" onSubmit={(event) => void submit(event)}>
      <label className="grid gap-1.5 text-[11px] font-extrabold text-[#31425e]"><span>Amount transferred (₦)</span><input className="h-10 rounded-lg border border-[#dfe4ed] bg-white px-3 text-xs text-[#0b1830] outline-none focus:border-[#1453bb] focus:ring-4 focus:ring-[#1453bb]/10" inputMode="numeric" value={amount} onChange={(event) => setAmount(formatEscrowAmountInput(event.currentTarget.value))} required /></label>
      <label className="grid gap-1.5 text-[11px] font-extrabold text-[#31425e]"><span>Receipt or transaction record</span><input className="block h-10 w-full rounded-lg border border-dashed border-[#b9c8dd] bg-white px-2 py-2 text-[10px] text-[#53627a] file:mr-2 file:rounded file:border-0 file:bg-[#edf4ff] file:px-2 file:py-1 file:text-[10px] file:font-bold file:text-[#1453bb]" accept="image/jpeg,image/png,image/webp,application/pdf" onChange={(event) => setReceipt(event.currentTarget.files?.[0] || null)} type="file" required /></label>
      <label className="grid gap-1.5 text-[11px] font-extrabold text-[#31425e]"><span>Bank transfer reference <em className="font-medium not-italic text-[#8995a8]">(optional)</em></span><input className="h-10 rounded-lg border border-[#dfe4ed] bg-white px-3 text-xs text-[#0b1830] outline-none focus:border-[#1453bb] focus:ring-4 focus:ring-[#1453bb]/10" value={transferReference} onChange={(event) => setTransferReference(event.currentTarget.value)} placeholder="Bank reference" /></label>
      <label className="grid gap-1.5 text-[11px] font-extrabold text-[#31425e]"><span>Transfer date and time <em className="font-medium not-italic text-[#8995a8]">(optional)</em></span><input className="h-10 rounded-lg border border-[#dfe4ed] bg-white px-3 text-xs text-[#0b1830] outline-none focus:border-[#1453bb] focus:ring-4 focus:ring-[#1453bb]/10" type="datetime-local" value={transferredAt} onChange={(event) => setTransferredAt(event.currentTarget.value)} /></label>
      <label className="grid gap-1.5 text-[11px] font-extrabold text-[#31425e]"><span>Sender name <em className="font-medium not-italic text-[#8995a8]">(optional)</em></span><input className="h-10 rounded-lg border border-[#dfe4ed] bg-white px-3 text-xs text-[#0b1830] outline-none focus:border-[#1453bb] focus:ring-4 focus:ring-[#1453bb]/10" value={senderName} onChange={(event) => setSenderName(event.currentTarget.value)} placeholder="Name on the transfer" /></label>
      <label className="grid gap-1.5 text-[11px] font-extrabold text-[#31425e] sm:col-span-2"><span>Note for Hollyway <em className="font-medium not-italic text-[#8995a8]">(optional)</em></span><textarea className="min-h-20 rounded-lg border border-[#dfe4ed] bg-white px-3 py-2 text-xs text-[#0b1830] outline-none focus:border-[#1453bb] focus:ring-4 focus:ring-[#1453bb]/10" value={note} onChange={(event) => setNote(event.currentTarget.value)} placeholder="Anything Admin should know about this transfer?" /></label>
      {error && <p className="sm:col-span-2 rounded-lg border border-[#f0c5c0] bg-[#fff4f2] px-3 py-2 text-xs font-semibold text-[#a32929]" role="alert">{error}</p>}
      <div className="flex flex-wrap items-center gap-3 sm:col-span-2"><button className="inline-flex h-10 items-center justify-center rounded-lg bg-[#1453bb] px-4 text-xs font-extrabold text-white disabled:opacity-60" disabled={saving} type="submit">{saving ? "Uploading…" : "Upload transfer proof"}</button><a className="text-xs font-extrabold text-[#1453bb] hover:underline" href={whatsappHref} rel="noreferrer" target="_blank">{whatsappLabel}</a></div>
    </form>}
  </section>;
}
