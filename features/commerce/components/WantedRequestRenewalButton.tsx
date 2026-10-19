"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ApiResponseError } from "../../../components/api/apiResponse";
import { Arrow } from "../../../components/ui/Arrow";
import { renewWantedRequest } from "../../dashboard/data/walletApi";
import { fetchPublicFeePolicy } from "../../fees/data/publicFeesApi";

export default function WantedRequestRenewalButton({
  reference,
  amountMinor,
  durationDays,
  onRenewed,
}: {
  reference: string;
  amountMinor: number;
  durationDays?: number;
  onRenewed: () => void;
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

  async function renew() {
    setBusy(true);
    setError("");
    try {
      await renewWantedRequest(reference);
      onRenewed();
    } catch (reason) {
      setError(reason instanceof ApiResponseError ? reason.message : "The wanted request could not be renewed.");
    } finally {
      setBusy(false);
    }
  }

  return <section className="rounded-lg border border-[#f1d8a9] bg-[#fffaf1] p-4"><p className="text-[9px] font-extrabold tracking-[.14em] text-[#9a6500]">REQUEST EXPIRED</p><h3 className="mt-1 text-sm font-extrabold text-[#0b1830]">Renew for another {period}</h3><p className="mt-1 text-xs leading-5 text-[#6b5a3d]">Renewal costs ₦{(amountMinor / 100).toLocaleString("en-NG")} and is paid from your confirmed Hollyway wallet.</p>{error && <p className="mt-3 rounded-md border border-[#f3c4c4] bg-white px-3 py-2 text-xs font-semibold text-[#a32929]" role="alert">{error}</p>}<div className="mt-3 flex flex-wrap gap-2"><button className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#1453bb] px-3 text-[10px] font-extrabold text-white disabled:cursor-wait disabled:opacity-60" disabled={busy} onClick={() => void renew()} type="button">{busy ? "Renewing…" : "Renew from wallet"} <Arrow /></button><Link className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#d9c28e] px-3 text-[10px] font-extrabold text-[#6b5a3d]" href="/dashboard/wallet">Fund wallet <Arrow /></Link></div></section>;
}
