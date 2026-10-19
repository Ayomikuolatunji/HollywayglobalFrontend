"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ApiResponseError } from "../../../components/api/apiResponse";
import { Arrow } from "../../../components/ui/Arrow";
import { payForWantedRequestFee } from "../../dashboard/data/walletApi";
import { fetchPublicFeePolicy } from "../../fees/data/publicFeesApi";

export default function WantedRequestFeeButton({
  reference,
  amountMinor,
  durationDays,
  paymentStatus,
  onPaid,
}: {
  reference: string;
  amountMinor: number;
  durationDays?: number;
  paymentStatus: "pending_payment" | "paid";
  onPaid?: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [policyDuration, setPolicyDuration] = useState<number>();
  useEffect(() => {
    if (durationDays) return;
    let active = true;
    void fetchPublicFeePolicy().then((policy) => {
      if (active) setPolicyDuration(policy.wanted_request.duration_days);
    }).catch(() => undefined);
    return () => { active = false; };
  }, [durationDays]);
  const period = durationDays || policyDuration ? `${durationDays || policyDuration} days` : "the active period";
  if (paymentStatus === "paid") return <p className="rounded-lg border border-[#bfe5d0] bg-[#f5fcf7] p-3 text-xs font-semibold text-[#216b39]">The ₦{(amountMinor / 100).toLocaleString("en-NG")} wanted-request fee is confirmed. Hollyway can continue the review.</p>;

  async function pay() {
    setBusy(true);
    setError("");
    try {
      await payForWantedRequestFee(reference);
      onPaid?.();
    } catch (reason) {
      setError(reason instanceof ApiResponseError ? reason.message : "The wanted-request fee could not be completed.");
    } finally {
      setBusy(false);
    }
  }

  return <section className="rounded-lg border border-[#f1d8a9] bg-[#fffaf1] p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-[9px] font-extrabold tracking-[.14em] text-[#9a6500]">WANTED REQUEST FEE</p><h3 className="mt-1 text-sm font-extrabold text-[#0b1830]">Keep this request active for {period}</h3><p className="mt-1 text-xs leading-5 text-[#6b5a3d]">This fee does not guarantee a match. If the request becomes an escrow transaction, Hollyway applies the fee according to the documented rebate terms.</p></div><strong className="text-lg font-extrabold text-[#1453bb]">₦{(amountMinor / 100).toLocaleString("en-NG")}</strong></div>{error && <p className="mt-3 rounded-md border border-[#f3c4c4] bg-white px-3 py-2 text-xs font-semibold text-[#a32929]" role="alert">{error}</p>}<div className="mt-3 flex flex-wrap items-center gap-2"><button className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#1453bb] px-3 text-[10px] font-extrabold text-white disabled:cursor-wait disabled:opacity-60" disabled={busy} onClick={() => void pay()} type="button">{busy ? "Confirming…" : "Pay from wallet"} <Arrow /></button><Link className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#d9c28e] px-3 text-[10px] font-extrabold text-[#6b5a3d]" href="/dashboard/wallet">Fund wallet <Arrow /></Link></div></section>;
}
