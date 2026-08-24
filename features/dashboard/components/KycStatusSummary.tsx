"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Arrow } from "../../../components/ui/Arrow";
import DashboardIcon from "./DashboardIcon";
import { kycStorageKey, type KycStatus } from "../data/kyc";

export default function KycStatusSummary() {
  const [status, setStatus] = useState<KycStatus>("not-started");

  useEffect(() => {
    const saved = window.localStorage.getItem(kycStorageKey);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as { status?: KycStatus };
      if (parsed.status === "draft" || parsed.status === "submitted") setStatus(parsed.status);
    } catch {
      window.localStorage.removeItem(kycStorageKey);
    }
  }, []);

  const submitted = status === "submitted";
  const inProgress = status === "draft";
  const title = submitted ? "KYC saved for review" : inProgress ? "KYC draft in progress" : "Not started";
  const action = submitted ? "Review verification" : inProgress ? "Continue verification" : "Start verification";

  return <article className={`flex items-start gap-4 rounded-xl border p-5 shadow-sm ${submitted ? "border-[#bfe5d0] bg-[#f5fcf7]" : "border-[#dfe4ed] bg-white"}`}><span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl [&>svg]:h-5 [&>svg]:w-5 ${submitted ? "bg-[#e3f7e9] text-[#168046]" : "bg-[#edf4ff] text-[#1453bb]"}`}><DashboardIcon name="shield" /></span><div className="min-w-0"><small className={`block text-[9px] font-extrabold tracking-[.12em] ${submitted ? "text-[#168046]" : "text-[#8b97a9]"}`}>KYC STATUS</small><strong className="mt-1 block text-lg font-extrabold tracking-[-.04em] text-[#0b1830]">{title}</strong><Link className={`mt-1 block text-[10px] font-extrabold hover:underline ${submitted ? "text-[#168046]" : "text-[#1453bb]"}`} href="/dashboard/profile/kyc">{action} <Arrow /></Link></div></article>;
}
