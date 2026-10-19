"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  decideEventProposal,
  formatEventMoney,
  submitEventPaymentProof,
  type EventRequest,
} from "../data/events";

const fieldClass = "mt-1 h-10 w-full rounded-lg border border-[#dfe4ed] bg-white px-3 text-xs font-semibold text-[#0b1830] outline-none focus:border-[#1453bb] focus:ring-4 focus:ring-[#1453bb]/10";

export default function EventProposalPanel({ event, onChange, onError }: {
  event: EventRequest;
  onChange: (event: EventRequest) => void;
  onError: (message: string) => void;
}) {
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  async function decide(decision: "accept" | "decline") {
    setSaving(true);
    onError("");
    try {
      onChange(await decideEventProposal(event.reference, decision, note));
      setNote("");
    } catch (reason) {
      onError(reason instanceof Error ? reason.message : "The proposal decision could not be saved.");
    } finally {
      setSaving(false);
    }
  }

  if (event.status === "vendor_assigned" && event.proposal_status === "pending") {
    return (
      <section className="rounded-xl border border-[#bcd5ff] bg-[#f7faff] p-4 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[.12em] text-[#1453bb]">PROPOSAL READY</p>
            <h2 className="mt-1 text-sm font-extrabold text-[#0b1830]">Review the coordinated event proposal</h2>
          </div>
          <strong className="text-sm text-[#1453bb]">{formatEventMoney(totalAssigned(event))}</strong>
        </div>
        <p className="mt-2 text-xs leading-5 text-[#53627a]">Hollyway has assigned a vendor quotation to every service you requested. Accept to continue to the manual transfer step, or request changes before payment.</p>
        <AssignmentSummary event={event} />
        <textarea className="mt-3 min-h-20 w-full rounded-lg border border-[#dfe4ed] bg-white p-3 text-xs text-[#0b1830] outline-none focus:border-[#1453bb] focus:ring-4 focus:ring-[#1453bb]/10" value={note} onChange={(input) => setNote(input.target.value)} placeholder="Optional note for Hollyway" />
        <div className="mt-3 flex flex-wrap gap-2">
          <button className="h-10 rounded-lg border border-[#dfe4ed] px-4 text-xs font-extrabold text-[#1453bb] disabled:opacity-50" disabled={saving} onClick={() => void decide("decline")} type="button">Request changes</button>
          <button className="h-10 rounded-lg bg-[#1453bb] px-4 text-xs font-extrabold text-white disabled:opacity-50" disabled={saving} onClick={() => void decide("accept")} type="button">{saving ? "Saving…" : "Accept proposal"}</button>
        </div>
      </section>
    );
  }

  if (event.proposal_status === "declined") {
    return <section className="rounded-xl border border-[#f1d8ad] bg-[#fffaf0] p-4 shadow-sm"><p className="text-[10px] font-black uppercase tracking-[.12em] text-[#9a6500]">CHANGES REQUESTED</p><h2 className="mt-1 text-sm font-extrabold text-[#0b1830]">Hollyway is reviewing your request</h2>{event.proposal_note && <p className="mt-2 text-xs leading-5 text-[#53627a]">{event.proposal_note}</p>}</section>;
  }

  if (!event.payment || event.proposal_status !== "accepted") return null;
  return <EventPaymentPanel event={event} onChange={onChange} onError={onError} />;
}

function EventPaymentPanel({ event, onChange, onError }: { event: EventRequest; onChange: (event: EventRequest) => void; onError: (message: string) => void }) {
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({ transferReference: "", transferredAt: "", senderName: "", submittedNote: "" });
  const payment = event.payment;
  const manual = event.manual_payment;
  if (!payment) return null;
  const editable = ["pending", "rejected"].includes(payment.status) && event.status === "payment_pending";

  async function submit(input: FormEvent<HTMLFormElement>) {
    input.preventDefault();
    if (!file || !manual?.amount_minor) {
      onError("Upload the transfer receipt before submitting payment proof.");
      return;
    }
    setSaving(true);
    onError("");
    try {
      const idempotencyKey = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `event-proof-${Date.now()}`;
      onChange(await submitEventPaymentProof(event.reference, {
        idempotencyKey,
        amountMinor: manual.amount_minor,
        receipt: file,
        ...form,
      }));
      setFile(null);
    } catch (reason) {
      onError(reason instanceof Error ? reason.message : "Payment proof could not be uploaded.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-xl border border-[#dfe4ed] bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-[10px] font-black uppercase tracking-[.12em] text-[#8290a8]">EVENT PAYMENT</p><h2 className="mt-1 text-sm font-extrabold text-[#0b1830]">{payment.status === "received" ? "Payment confirmed" : payment.status === "proof_submitted" ? "Receipt under review" : "Transfer the confirmed amount"}</h2></div><strong className="text-sm text-[#1453bb]">{formatEventMoney(payment.amount_minor)}</strong></div>
      {payment.status === "received" && <p className="mt-3 text-xs leading-5 text-[#216b39]">Admin confirmed this transfer. Hollyway will keep the event coordination record updated as work progresses.</p>}
      {payment.status === "proof_submitted" && <p className="mt-3 text-xs leading-5 text-[#53627a]">Your receipt is with Hollyway Admin. Do not send another transfer while this proof is being checked.</p>}
      {payment.status === "rejected" && <p className="mt-3 rounded-lg bg-[#fff5f3] p-3 text-xs leading-5 text-[#a32929]">{payment.failure_reason || "Admin could not confirm this receipt. Review the amount and upload a clearer record."}</p>}
      {editable && (manual?.configured ? <>
        <div className="mt-4 grid gap-3 rounded-lg bg-[#f7f9fc] p-3 sm:grid-cols-3"><Info label="Bank" value={manual.bank_name || "—"} /><Info label="Account name" value={manual.account_name || "—"} /><Info label="Account number" value={manual.account_number || "—"} /></div>
        <p className="mt-3 text-xs leading-5 text-[#53627a]">{manual.instruction} Transfer exactly {formatEventMoney(manual.amount_minor || 0)}. {manual.admin_whatsapp_number ? <>Send the same reference to Admin on WhatsApp ({manual.admin_whatsapp_number}). {manual.admin_whatsapp_url && <a className="font-extrabold text-[#1453bb] hover:underline" href={manual.admin_whatsapp_url} rel="noreferrer" target="_blank">Open WhatsApp</a>}</> : "Keep the transfer reference for Admin review."}</p>
        <form className="mt-4 grid gap-3 sm:grid-cols-2" onSubmit={submit}><label className="text-xs font-bold text-[#31425e]">Transfer reference<input className={fieldClass} value={form.transferReference} onChange={(input) => setForm({ ...form, transferReference: input.target.value })} placeholder="Bank transaction reference" /></label><label className="text-xs font-bold text-[#31425e]">Transfer date and time<input className={fieldClass} type="datetime-local" value={form.transferredAt} onChange={(input) => setForm({ ...form, transferredAt: input.target.value })} /></label><label className="text-xs font-bold text-[#31425e]">Sender name<input className={fieldClass} value={form.senderName} onChange={(input) => setForm({ ...form, senderName: input.target.value })} placeholder="Name on the transfer" /></label><label className="text-xs font-bold text-[#31425e]">Receipt<input className={`${fieldClass} py-2`} accept="image/jpeg,image/png,image/webp,application/pdf" onChange={(input: ChangeEvent<HTMLInputElement>) => setFile(input.target.files?.[0] || null)} required type="file" /></label><label className="text-xs font-bold text-[#31425e] sm:col-span-2">Note for Admin<textarea className="mt-1 min-h-20 w-full rounded-lg border border-[#dfe4ed] p-3 text-xs text-[#0b1830] outline-none focus:border-[#1453bb]" value={form.submittedNote} onChange={(input) => setForm({ ...form, submittedNote: input.target.value })} placeholder="Optional context for the transfer" /></label><button className="h-10 rounded-lg bg-[#1453bb] px-4 text-xs font-extrabold text-white disabled:opacity-50 sm:col-span-2 sm:w-fit" disabled={saving} type="submit">{saving ? "Uploading…" : "Submit receipt for review"}</button></form>
      </> : <p className="mt-3 rounded-lg bg-[#fff5f3] p-3 text-xs font-semibold text-[#a32929]">Hollyway payment details are temporarily unavailable. Please contact support.</p>)}
    </section>
  );
}

function AssignmentSummary({ event }: { event: EventRequest }) { return <div className="mt-4 divide-y divide-[#e8eef7] rounded-lg border border-[#dfe4ed] bg-white">{event.assignments.map((item) => <div className="flex items-center justify-between gap-3 p-3" key={item.id}><div><p className="text-xs font-extrabold text-[#0b1830]">{item.vendor_name || "Assigned vendor"}</p><p className="mt-1 text-[11px] text-[#687895]">{event.services.find((service) => service.id === item.service_id)?.service_label || "Event service"}</p></div><strong className="text-xs text-[#1453bb]">{formatEventMoney(item.amount_minor)}</strong></div>)}</div>; }
function totalAssigned(event: EventRequest) { return event.assignments.reduce((sum, item) => sum + (item.amount_minor || 0), 0); }
function Info({ label, value }: { label: string; value: string }) { return <div><p className="text-[10px] font-black uppercase tracking-[.1em] text-[#8290a8]">{label}</p><p className="mt-1 text-xs font-extrabold text-[#0b1830]">{value}</p></div>; }
