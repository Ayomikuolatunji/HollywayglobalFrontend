"use client";

import Link from "next/link";
import { Arrow } from "../../../components/ui/Arrow";

export default function KycDraftBanner() {
  return <div className="mb-3 flex flex-col gap-1.5 rounded-lg border border-[#f0c9a0] bg-[#fbe9da] px-4 py-2 text-xs text-[#7a4a17] sm:flex-row sm:items-center sm:justify-between"><span><strong className="text-[#b8560d]">KYC not complete.</strong> New listings, requests and service work will remain Draft until verification is complete.</span><Link className="inline-flex shrink-0 items-center gap-1 font-bold text-[#b8560d] hover:underline" href="/dashboard/profile/kyc">Complete KYC <Arrow /></Link></div>;
}
