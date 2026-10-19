"use client";

import { useState, type FormEvent } from "react";
import { requestWalletPayout, type WalletPayout } from "../data/walletApi";

function formatAmount(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits ? Number(digits).toLocaleString("en-NG") : "";
}

export default function WalletPayoutPanel({
  enabled,
  balanceMinor,
  onCreated,
}: {
  enabled: boolean;
  balanceMinor: number;
  onCreated: (payout: WalletPayout) => void;
}) {
  const [amount, setAmount] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const payout = await requestWalletPayout({
        amount: amount.replace(/,/g, ""),
        bankName,
        accountNumber,
        accountName,
      });
      onCreated(payout);
      setAmount("");
      setBankName("");
      setAccountNumber("");
      setAccountName("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The payout request could not be sent.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-[14px] border border-[#e4e2da] bg-white p-4 shadow-[0_1px_2px_rgba(18,20,28,.03)] sm:p-5">
      <div>
        <span className="text-[9px] font-bold uppercase tracking-[.12em] text-[#1f7a5c]">REQUEST PAYOUT</span>
        <h2 className="mt-1 font-[Manrope] text-lg font-semibold text-[#12141c]">Withdraw confirmed wallet funds</h2>
        <p className="mt-1 max-w-2xl text-xs leading-5 text-[#5c5f6b]">Hollyway verifies the settlement account before Admin reviews the payout.</p>
      </div>
      {!enabled ? (
        <p className="mt-4 rounded-lg border border-[#f0c9a0] bg-[#fff8ef] p-3 text-xs leading-5 text-[#7a4a17]">Complete identity verification before requesting a wallet payout.</p>
      ) : (
        <form className="mt-4 grid gap-3 sm:grid-cols-2" onSubmit={submit}>
          <Field label="Amount (₦)" value={amount} onChange={(value) => setAmount(formatAmount(value))} placeholder="e.g. 50,000" required />
          <Field label="Bank name" value={bankName} onChange={setBankName} placeholder="e.g. Fidelity Bank" required />
          <Field label="Account number" value={accountNumber} onChange={(value) => setAccountNumber(value.replace(/\D/g, "").slice(0, 10))} placeholder="10 digits" inputMode="numeric" required />
          <Field label="Account name" value={accountName} onChange={setAccountName} placeholder="Name on the account" required />
          <p className="sm:col-span-2 text-[10px] leading-4 text-[#8995a8]">Available balance: ₦{(balanceMinor / 100).toLocaleString("en-NG")}. Account numbers are encrypted and only the last four digits are shown after submission.</p>
          {error && <p className="sm:col-span-2 rounded-lg border border-[#f1c8c3] bg-[#fff5f3] p-3 text-[10px] font-semibold text-[#a32929]" role="alert">{error}</p>}
          <button className="h-10 justify-self-start rounded-lg bg-[#1f7a5c] px-4 text-xs font-bold text-white disabled:opacity-50" disabled={busy} type="submit">{busy ? "Verifying…" : "Request payout"}</button>
        </form>
      )}
    </section>
  );
}

function Field({ label, value, onChange, placeholder, inputMode, required }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; inputMode?: "numeric"; required?: boolean }) {
  return <label className="grid gap-1.5 text-[10px] font-bold text-[#3b4b6b]"><span>{label}</span><input className="h-10 rounded-lg border border-[#e4e2da] px-3 text-xs text-[#12141c] outline-none focus:border-[#1f7a5c]" inputMode={inputMode} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} required={required} /></label>;
}
