"use client";

import Link from "next/link";
import { Arrow } from "../../../components/ui/Arrow";

export default function KycDraftBanner() {
  return <div className="flex flex-col gap-2 border-b border-[#f1d8a9] bg-[#fffaf1] px-5 py-3 text-xs text-[#6b5a3d] sm:flex-row sm:items-center sm:justify-between sm:px-8"><span><strong className="text-[#b45309]">KYC not complete.</strong> New listings, requests and service work will remain Draft until verification is complete.</span><Link className="inline-flex shrink-0 items-center gap-1 font-extrabold text-[#b45309] hover:underline" href="/dashboard/profile/kyc">Complete KYC <Arrow /></Link></div>;
}
