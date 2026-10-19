"use client";

import { useState, type FormEvent } from "react";
import Dropdown from "../../../components/forms/Dropdown";
import type { WalletDeposit, WalletInstructions } from "../data/walletApi";
import { createWalletDeposit, submitWalletProof } from "../data/walletApi";

const presetAmounts = [5000, 10000, 25000, 50000];
const paymentMethods = [{ value: "manual_bank_transfer", label: "Bank transfer", tip: "Create a Hollyway reference, transfer to the official account and upload the receipt for review." }];

function formatAmount(value: string) { const digits = value.replace(/\D/g, ""); return digits ? Number(digits).toLocaleString("en-NG") : ""; }

export default function WalletFundingPanel({ instructions, onCreated }: { instructions: WalletInstructions; onCreated: (deposit: WalletDeposit) => void }) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("manual_bank_transfer");
  const [created, setCreated] = useState<WalletDeposit | null>(null);
  const [proof, setProof] = useState<File | null>(null);
  const [transferReference, setTransferReference] = useState("");
  const [senderName, setSenderName] = useState("");
  const [transferredAt, setTransferredAt] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setBusy(true);
    try { const deposit = await createWalletDeposit(amount.replace(/,/g, "")); setCreated(deposit); onCreated(deposit); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Wallet deposit could not be created."); }
    finally { setBusy(false); }
  }

  async function uploadProof(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!created || !proof) { setError("Choose the bank transfer receipt first."); return; }
    setError(""); setBusy(true);
    try { const deposit = await submitWalletProof(created.reference, { proof, transferReference, senderName, transferredAt, note }); setCreated(deposit); onCreated(deposit); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Wallet proof could not be submitted."); }
    finally { setBusy(false); }
  }

  const reset = () => { setCreated(null); setAmount(""); setProof(null); setError(""); };
  return <section className="rounded-[14px] border border-[#e4e2da] bg-white p-4 shadow-[0_1px_2px_rgba(18,20,28,.03)] sm:p-5"><div><span className="text-[9px] font-bold uppercase tracking-[.12em] text-[#b8560d]">FUND WALLET</span><h2 className="mt-1 font-[Manrope] text-lg font-semibold text-[#12141c]">Deposit money for service payments</h2><p className="mt-1 max-w-2xl text-xs leading-5 text-[#5c5f6b]">Create a deposit reference before transferring. Hollyway adds funds only after an admin confirms the uploaded bank record.</p></div>{created ? <DepositProofForm deposit={created} instructions={instructions} proof={proof} setProof={setProof} transferReference={transferReference} setTransferReference={setTransferReference} senderName={senderName} setSenderName={setSenderName} transferredAt={transferredAt} setTransferredAt={setTransferredAt} note={note} setNote={setNote} busy={busy} error={error} onSubmit={uploadProof} onReset={reset} /> : <form className="mt-5" onSubmit={submit}><fieldset><legend className="text-[10px] font-bold text-[#3b4b6b]">Choose an amount</legend><div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">{presetAmounts.map((value) => <button className={`h-10 rounded-lg border text-xs font-bold ${amount === value.toLocaleString("en-NG") ? "border-[#14213d] bg-[#edeff5] text-[#14213d]" : "border-[#e4e2da] bg-white text-[#5c5f6b] hover:border-[#14213d]"}`} type="button" onClick={() => setAmount(value.toLocaleString("en-NG"))} key={value}>₦{value.toLocaleString("en-NG")}</button>)}</div></fieldset><div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="grid gap-1.5 text-[10px] font-bold text-[#3b4b6b]"><span>Custom amount (₦)</span><input className="h-10 rounded-lg border border-[#e4e2da] px-3 text-xs text-[#12141c] outline-none focus:border-[#14213d]" inputMode="numeric" value={amount} onChange={(event) => setAmount(formatAmount(event.target.value))} placeholder="Enter amount" required /></label><Dropdown compact label="Payment method" options={paymentMethods} value={method} onChange={setMethod} showSelectedTip={false} /></div>{error && <p className="mt-3 text-[10px] font-semibold text-[#a32929]" role="alert">{error}</p>}<div className="mt-5 flex flex-col justify-between gap-3 border-t border-[#e4e2da] pt-4 sm:flex-row sm:items-center"><p className="max-w-lg text-[10px] leading-4 text-[#7a4a17]">Do not transfer money without a Hollyway funding reference and confirmed payment instructions.</p><button className="h-10 shrink-0 rounded-lg bg-[#dd6b12] px-4 text-xs font-bold text-white hover:bg-[#b8560d] disabled:opacity-50" disabled={busy} type="submit">{busy ? "Creating…" : "Create deposit reference"}</button></div></form>}</section>;
}

function DepositProofForm({ deposit, instructions, proof, setProof, transferReference, setTransferReference, senderName, setSenderName, transferredAt, setTransferredAt, note, setNote, busy, error, onSubmit, onReset }: { deposit: WalletDeposit; instructions: WalletInstructions; proof: File | null; setProof: (file: File | null) => void; transferReference: string; setTransferReference: (value: string) => void; senderName: string; setSenderName: (value: string) => void; transferredAt: string; setTransferredAt: (value: string) => void; note: string; setNote: (value: string) => void; busy: boolean; error: string; onSubmit: (event: FormEvent<HTMLFormElement>) => void; onReset: () => void }) {
  if (deposit.status === "proof_submitted" || deposit.status === "received") return <div className="mt-5 rounded-xl border border-[#d7e2dc] bg-[#e4f2ec] p-4"><span className="text-[9px] font-bold uppercase tracking-[.12em] text-[#1f7a5c]">DEPOSIT {deposit.status === "received" ? "CONFIRMED" : "SUBMITTED"}</span><strong className="mt-2 block font-[Manrope] text-xl text-[#174f3d]">₦{(deposit.amount_minor / 100).toLocaleString("en-NG")}</strong><p className="mt-1 text-xs text-[#376957]">Reference: <b>{deposit.reference}</b></p><p className="mt-2 text-[10px] leading-4 text-[#376957]">{deposit.status === "received" ? "The confirmed amount is available for eligible Hollyway payments." : "Hollyway Admin is reviewing the transfer record."}</p><button className="mt-3 text-[10px] font-bold text-[#1f7a5c] hover:underline" type="button" onClick={onReset}>Create another deposit</button></div>;
  return <form className="mt-5 space-y-4" onSubmit={onSubmit}><div className="rounded-xl border border-[#f0c9a0] bg-[#fbe9da] p-4"><span className="text-[9px] font-bold uppercase tracking-[.12em] text-[#b8560d]">PAYMENT INSTRUCTIONS</span><p className="mt-2 text-xs leading-5 text-[#7a4a17]">Transfer exactly <b>₦{(deposit.amount_minor / 100).toLocaleString("en-NG")}</b> and include <b>{deposit.reference}</b> where your bank allows it.</p>{instructions.configured ? <p className="mt-2 text-xs font-bold leading-5 text-[#7a4a17]">{instructions.bank_name} · {instructions.account_name} · {instructions.account_number}</p> : <p className="mt-2 text-xs font-bold text-[#a32929]">Hollyway payment details are temporarily unavailable.</p>}</div><div className="grid gap-3 sm:grid-cols-2"><label className="grid gap-1.5 text-[10px] font-bold text-[#3b4b6b]"><span>Bank transaction reference (optional)</span><input className="h-10 rounded-lg border border-[#e4e2da] px-3 text-xs" value={transferReference} onChange={(event) => setTransferReference(event.target.value)} /></label><label className="grid gap-1.5 text-[10px] font-bold text-[#3b4b6b]"><span>Sender name (optional)</span><input className="h-10 rounded-lg border border-[#e4e2da] px-3 text-xs" value={senderName} onChange={(event) => setSenderName(event.target.value)} /></label><label className="grid gap-1.5 text-[10px] font-bold text-[#3b4b6b]"><span>Transfer date and time (optional)</span><input className="h-10 rounded-lg border border-[#e4e2da] px-3 text-xs" type="datetime-local" value={transferredAt} onChange={(event) => setTransferredAt(event.target.value)} /></label><label className="grid gap-1.5 text-[10px] font-bold text-[#3b4b6b]"><span>Receipt (JPG, PNG, WEBP or PDF)</span><input className="block w-full text-[10px]" accept="image/jpeg,image/png,image/webp,application/pdf" type="file" required onChange={(event) => setProof(event.target.files?.[0] || null)} /></label></div><label className="grid gap-1.5 text-[10px] font-bold text-[#3b4b6b]"><span>Note (optional)</span><textarea className="min-h-20 rounded-lg border border-[#e4e2da] p-3 text-xs" value={note} onChange={(event) => setNote(event.target.value)} /></label>{error && <p className="text-[10px] font-semibold text-[#a32929]" role="alert">{error}</p>}<div className="flex flex-wrap justify-between gap-2"><button className="h-9 rounded-lg border border-[#e4e2da] px-3 text-[10px] font-bold text-[#5c5f6b]" type="button" onClick={onReset}>Cancel</button><button className="h-9 rounded-lg bg-[#dd6b12] px-4 text-[10px] font-bold text-white disabled:opacity-50" disabled={busy || !proof} type="submit">{busy ? "Sending…" : "Send payment proof"}</button></div></form>;
}
