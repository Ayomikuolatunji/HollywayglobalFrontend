"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ApiResponseError } from "../../../components/api/apiResponse";
import { Arrow } from "../../../components/ui/Arrow";
import { fetchPublicFeePolicy, type PublicFeePolicy } from "../../fees/data/publicFeesApi";
import { payForPromotion } from "../../dashboard/data/walletApi";

export default function WalletPromotionPaymentButton({
  targetType,
  reference,
  packageId,
  paymentStatus,
  onPaid,
}: {
  targetType: "listing" | "wanted_request";
  reference: string;
  packageId: string;
  paymentStatus?: "not_required" | "pending_payment" | "paid";
  onPaid?: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<PublicFeePolicy["featured_packages"][number] | null>(null);
  useEffect(() => {
    if (!packageId || packageId === "none") return;
    let active = true;
    void fetchPublicFeePolicy()
      .then((policy) => {
        if (!active) return;
        const next = policy.featured_packages.find((item) => item.id === packageId);
        if (next) setSelected(next);
        else setError("This visibility option is no longer available.");
      })
      .catch(() => { if (active) setError("The current visibility fee could not be loaded."); });
    return () => { active = false; };
  }, [packageId]);
  if (packageId === "none" || packageId === "") return null;
  if (paymentStatus === "paid") return <p className="rounded-lg border border-[#bfe5d0] bg-[#f5fcf7] p-3 text-xs font-semibold text-[#216b39]">Visibility payment confirmed from your Hollyway wallet. Admin can now review the placement.</p>;

  async function pay() {
    setBusy(true);
    setError("");
    try {
      await payForPromotion(targetType, reference);
      onPaid?.();
    } catch (reason) {
      setError(reason instanceof ApiResponseError ? reason.message : "The visibility payment could not be completed.");
    } finally {
      setBusy(false);
    }
  }

  return <section className="rounded-lg border border-[#f1d8a9] bg-[#fffaf1] p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-[9px] font-extrabold tracking-[.14em] text-[#9a6500]">VISIBILITY PAYMENT</p><h3 className="mt-1 text-sm font-extrabold text-[#0b1830]">{selected?.name || "Visibility option"}</h3><p className="mt-1 text-xs leading-5 text-[#6b5a3d]">{selected ? `Pay ₦${(selected.amount_minor / 100).toLocaleString("en-NG")} from your confirmed Hollyway wallet. Admin can review the placement after the payment is recorded.` : "Loading the current visibility fee…"}</p></div><strong className="text-lg font-extrabold text-[#1453bb]">{selected ? `₦${(selected.amount_minor / 100).toLocaleString("en-NG")}` : "…"}</strong></div>{error && <p className="mt-3 rounded-md border border-[#f3c4c4] bg-white px-3 py-2 text-xs font-semibold text-[#a32929]" role="alert">{error}</p>}<div className="mt-3 flex flex-wrap items-center gap-2"><button className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#1453bb] px-3 text-[10px] font-extrabold text-white disabled:cursor-wait disabled:opacity-60" disabled={busy || !selected} onClick={() => void pay()} type="button">{busy ? "Confirming…" : "Pay from wallet"} <Arrow /></button><Link className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#d9c28e] px-3 text-[10px] font-extrabold text-[#6b5a3d]" href="/dashboard/wallet">View wallet <Arrow /></Link></div></section>;
}
