"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Arrow } from "../../../components/ui/Arrow";
import DashboardIcon from "../components/DashboardIcon";
import DashboardPageHeader from "../components/DashboardPageHeader";
import { kycStorageKey, type KycStatus } from "../data/kyc";
import { useDashboard } from "../components/DashboardShell";

export default function ProfilePage() {
  const { accountName, accountEmail } = useDashboard();
  const [kycStatus, setKycStatus] = useState<KycStatus>("not-started");

  useEffect(() => {
    const saved = window.localStorage.getItem(kycStorageKey);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as { status?: KycStatus };
      if (parsed.status === "draft" || parsed.status === "submitted") setKycStatus(parsed.status);
    } catch {
      window.localStorage.removeItem(kycStorageKey);
    }
  }, []);

  const submitted = kycStatus === "submitted";
  const statusTitle = submitted ? "KYC saved for review" : kycStatus === "draft" ? "KYC draft in progress" : "KYC not started";
  const statusDescription = submitted ? "Your verification details are saved locally and ready for the secure API submission." : kycStatus === "draft" ? "Continue the saved verification draft when you are ready." : "Verify your identity to unlock higher-value transactions and stronger account trust.";

  return <div className="mx-auto max-w-[1180px] space-y-6 p-5 sm:p-8"><DashboardPageHeader kicker="ACCOUNT" title="Profile & KYC" description="Keep your account details current and complete verification before higher-value transactions." action={<Link className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#1453bb] px-4 text-xs font-extrabold text-white hover:bg-[#0b3f91]" href="/dashboard/profile/kyc">{submitted ? "Review KYC" : kycStatus === "draft" ? "Continue KYC" : "Start KYC"} <Arrow /></Link>} /><section className="grid gap-6 lg:grid-cols-[1fr_.85fr]"><article className="rounded-xl border border-[#dfe4ed] bg-white p-6 shadow-sm"><div className="flex items-center gap-4 border-b border-[#eef1f4] pb-5"><span className="grid h-14 w-14 place-items-center rounded-full bg-[#1453bb] text-lg font-extrabold text-white">{accountName.charAt(0).toUpperCase()}</span><div><h3 className="font-[Manrope] text-lg font-extrabold text-[#0b1830]">{accountName}</h3><p className="mt-1 text-xs text-[#8490a4]">Personal user account</p></div></div><dl className="mt-5 grid gap-4 sm:grid-cols-2"><div><dt className="text-[10px] font-extrabold tracking-[.12em] text-[#8b97a9]">FULL NAME</dt><dd className="mt-1 text-sm font-semibold text-[#31425e]">{accountName}</dd></div><div><dt className="text-[10px] font-extrabold tracking-[.12em] text-[#8b97a9]">EMAIL ADDRESS</dt><dd className="mt-1 break-all text-sm font-semibold text-[#31425e]">{accountEmail || "Not provided"}</dd></div></dl><p className="mt-6 rounded-lg bg-[#f8fafc] p-4 text-xs leading-5 text-[#53627a]">Profile editing will be connected to your Hollyway account service in the next backend integration step.</p></article><article className={`rounded-xl p-6 shadow-sm ${submitted ? "border border-[#bfe5d0] bg-[#f5fcf7]" : "border border-[#f1d8a9] bg-[#fffaf1]"}`}><span className={`grid h-11 w-11 place-items-center rounded-xl [&>svg]:h-5 [&>svg]:w-5 ${submitted ? "bg-[#e3f7e9] text-[#168046]" : "bg-[#ffefd0] text-[#d97706]"}`}><DashboardIcon name="shield" /></span><span className={`mt-5 block text-[10px] font-extrabold tracking-[.15em] ${submitted ? "text-[#168046]" : "text-[#b45309]"}`}>VERIFICATION</span><h3 className="mt-2 font-[Manrope] text-xl font-extrabold tracking-[-.04em] text-[#0b1830]">{statusTitle}</h3><p className={`mt-2 text-xs leading-5 ${submitted ? "text-[#53627a]" : "text-[#6b5a3d]"}`}>{statusDescription}</p><Link className={`mt-6 inline-flex items-center gap-2 text-xs font-extrabold hover:underline ${submitted ? "text-[#168046]" : "text-[#b45309]"}`} href="/dashboard/profile/kyc">{submitted ? "Open verification" : "Complete verification"} <Arrow /></Link></article></section><section className="rounded-xl border border-[#cfe0f7] bg-[#f4f8ff] p-6"><div className="flex flex-col gap-5 sm:flex-row sm:items-center"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#dceaff] text-[#1453bb] [&>svg]:h-5 [&>svg]:w-5"><DashboardIcon name="store" /></span><div className="flex-1"><span className="text-[10px] font-extrabold tracking-[.15em] text-[#1453bb]">FOR BUSINESSES & RESELLERS</span><h3 className="mt-2 font-[Manrope] text-xl font-extrabold tracking-[-.04em] text-[#0b1830]">Upgrade to a business account</h3><p className="mt-2 text-xs leading-5 text-[#53627a]">Unlock a clearer workspace for stock, team activity and repeat selling.</p></div><Link className="inline-flex items-center gap-2 rounded-lg border border-[#1453bb] px-4 py-3 text-xs font-extrabold text-[#1453bb] hover:bg-white" href="/dashboard/profile/business-upgrade">View upgrade path <Arrow /></Link></div></section></div>;
}
