"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Arrow } from "../../../components/ui/Arrow";
import { fetchKycStatus } from "../data/kycApi";
import { getKycStorageKey, isKycComplete, kycStatusAction, kycStatusLabel, readKycLocalState, resolveKycStatus, type KycStatus } from "../data/kyc";
import DashboardIcon from "./DashboardIcon";
import DashboardSummaryCard from "./DashboardSummaryCard";
import { useDashboard } from "./DashboardShell";

export default function KycStatusSummary({ compact = false, overviewStyle = false }: { compact?: boolean; overviewStyle?: boolean }) {
  const { accountEmail } = useDashboard();
  const storageKey = getKycStorageKey(accountEmail);
  const [status, setStatus] = useState<KycStatus>("not-started");

  useEffect(() => {
    if (!accountEmail) return;
    const controller = new AbortController();
    const localStatus = readKycLocalState(storageKey).status;
    setStatus(localStatus);
    fetchKycStatus(controller.signal).then((remote) => {
      setStatus(resolveKycStatus(remote.status, localStatus));
    }).catch((error) => {
      if (!(error instanceof DOMException && error.name === "AbortError")) return;
    });
    return () => controller.abort();
  }, [accountEmail, storageKey]);

  const complete = isKycComplete(status);
  const title = kycStatusLabel(status);
  const action = kycStatusAction(status);
  const iconStyle = complete ? "bg-[#e4f2ec] text-[#1f7a5c]" : "bg-[#f6efdc] text-[#7a5c00]";
  const borderStyle = complete ? "border-[#d7e2dc] border-t-[#1f7a5c]" : "border-[#e4e2da] border-t-[#7a5c00]";

  if (overviewStyle) return <Link className={`flex items-center gap-3 rounded-xl border border-t-[3px] bg-white p-3.5 shadow-[0_1px_2px_rgba(18,20,28,.03)] transition hover:-translate-y-0.5 hover:shadow-md ${borderStyle}`} href="/dashboard/profile/kyc"><span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg [&>svg]:h-4 [&>svg]:w-4 ${iconStyle}`}><DashboardIcon name="shield" /></span><span className="min-w-0 flex-1"><small className="block text-[9px] font-bold tracking-[.1em] text-[#9498a3]">KYC STATUS</small><strong className="mt-1 block truncate text-xs font-semibold text-[#12141c]">{title}</strong><span className="mt-0.5 block text-[10px] text-[#5c5f6b]">{action}</span></span><Arrow /></Link>;

  return <DashboardSummaryCard label="KYC STATUS" value={title} note={action} icon="shield" href="/dashboard/profile/kyc" tone={complete ? "green" : "blue"} compact={compact} />;
}
