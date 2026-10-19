"use client";

import Link from "next/link";
import { useState } from "react";
import { ApiResponseError } from "../../../components/api/apiResponse";
import { Arrow } from "../../../components/ui/Arrow";
import { payForService } from "../data/walletApi";

type Service = "professional" | "logistics" | "relocation";

export default function WalletServicePaymentButton({ service, reference, amountMinor, onPaid }: { service: Service; reference: string; amountMinor: number; onPaid: () => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function pay() {
    setBusy(true); setError("");
    try { await payForService(service, reference); onPaid(); }
    catch (reason) { setError(reason instanceof ApiResponseError ? reason.message : "Wallet payment could not be completed."); }
    finally { setBusy(false); }
  }
  return <div className="mt-3 rounded-lg border border-[#cfe0f7] bg-[#f4f8ff] p-3"><div className="flex flex-wrap items-center justify-between gap-2"><div><p className="text-[10px] font-black uppercase tracking-[.12em] text-[#1453bb]">PAY FROM WALLET</p><p className="mt-1 text-xs leading-5 text-[#53627a]">Use your confirmed wallet balance to pay ₦{(amountMinor / 100).toLocaleString("en-NG")} for this quotation.</p></div><button className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#1453bb] px-3 text-xs font-extrabold text-white disabled:opacity-50" disabled={busy} onClick={() => void pay()} type="button">{busy ? "Paying…" : "Pay now"}<Arrow /></button></div>{error && <p className="mt-2 text-[10px] font-semibold leading-4 text-[#a32929]" role="alert">{error} <Link className="font-extrabold underline" href="/dashboard/wallet">Fund wallet</Link></p>}</div>;
}
