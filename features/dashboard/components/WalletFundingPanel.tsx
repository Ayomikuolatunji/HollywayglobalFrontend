"use client";

import { useState, type FormEvent } from "react";
import Dropdown from "../../../components/forms/Dropdown";
import { createWalletFundingReference, saveWalletFundingRequest, type WalletFundingRequest } from "../data/wallet";

const presetAmounts = [5000, 10000, 25000, 50000];
const paymentMethods = [
  { value: "Card or bank payment", label: "Card or bank payment", tip: "Continue to the secure payment step when the payment service is connected." },
  { value: "Bank transfer", label: "Bank transfer", tip: "Receive a funding reference before transferring to the confirmed Hollyway account." },
];

function formatAmount(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits ? Number(digits).toLocaleString("en-NG") : "";
}

export default function WalletFundingPanel({ onCreated }: { onCreated: (requests: WalletFundingRequest[]) => void }) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Card or bank payment");
  const [error, setError] = useState("");
  const [created, setCreated] = useState<WalletFundingRequest | null>(null);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const numericAmount = Number(amount.replace(/,/g, ""));
    if (!numericAmount || numericAmount <= 0) { setError("Enter the amount you want to deposit."); return; }
    const request: WalletFundingRequest = { reference: createWalletFundingReference(), amount: numericAmount, method, createdAt: new Intl.DateTimeFormat("en-NG", { dateStyle: "medium", timeStyle: "short" }).format(new Date()), status: "Pending payment" };
    onCreated(saveWalletFundingRequest(request));
    setCreated(request);
    setError("");
  }

  return <section className="rounded-[14px] border border-[#e4e2da] bg-white p-4 shadow-[0_1px_2px_rgba(18,20,28,.03)] sm:p-5"><div><span className="text-[9px] font-bold uppercase tracking-[.12em] text-[#b8560d]">FUND WALLET</span><h2 className="mt-1 font-[Manrope] text-lg font-semibold text-[#12141c]">Deposit money for service payments</h2><p className="mt-1 max-w-2xl text-xs leading-5 text-[#5c5f6b]">Confirmed wallet funds can be used to pay eligible Hollyway service fees from your workspace.</p></div>{created ? <div className="mt-5 rounded-xl border border-[#d7e2dc] bg-[#e4f2ec] p-4"><span className="text-[9px] font-bold uppercase tracking-[.12em] text-[#1f7a5c]">FUNDING REQUEST CREATED</span><strong className="mt-2 block font-[Manrope] text-xl text-[#174f3d]">₦{created.amount.toLocaleString("en-NG")}</strong><p className="mt-1 text-xs text-[#376957]">Reference: <b>{created.reference}</b></p><p className="mt-2 text-[10px] leading-4 text-[#376957]">Status: Pending payment. Your available balance will update only after the payment service confirms the deposit.</p><button className="mt-3 text-[10px] font-bold text-[#1f7a5c] hover:underline" type="button" onClick={() => { setCreated(null); setAmount(""); }}>Create another deposit</button></div> : <form className="mt-5" onSubmit={submit}><fieldset><legend className="text-[10px] font-bold text-[#3b4b6b]">Choose an amount</legend><div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">{presetAmounts.map((value) => <button className={`h-10 rounded-lg border text-xs font-bold ${amount === value.toLocaleString("en-NG") ? "border-[#14213d] bg-[#edeff5] text-[#14213d]" : "border-[#e4e2da] bg-white text-[#5c5f6b] hover:border-[#14213d]"}`} type="button" onClick={() => setAmount(value.toLocaleString("en-NG"))} key={value}>₦{value.toLocaleString("en-NG")}</button>)}</div></fieldset><div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="grid gap-1.5 text-[10px] font-bold text-[#3b4b6b]"><span>Custom amount (₦)</span><input className="h-10 rounded-lg border border-[#e4e2da] px-3 text-xs text-[#12141c] outline-none focus:border-[#14213d]" inputMode="numeric" value={amount} onChange={(event) => setAmount(formatAmount(event.target.value))} placeholder="Enter amount" /></label><Dropdown compact label="Payment method" options={paymentMethods} value={method} onChange={setMethod} showSelectedTip={false} /></div>{error && <p className="mt-3 text-[10px] font-semibold text-[#a32929]" role="alert">{error}</p>}<div className="mt-5 flex flex-col justify-between gap-3 border-t border-[#e4e2da] pt-4 sm:flex-row sm:items-center"><p className="max-w-lg text-[10px] leading-4 text-[#7a4a17]">Do not transfer money without a Hollyway funding reference and confirmed payment instructions.</p><button className="h-10 shrink-0 rounded-lg bg-[#dd6b12] px-4 text-xs font-bold text-white hover:bg-[#b8560d]" type="submit">Continue to payment</button></div></form>}</section>;
}
