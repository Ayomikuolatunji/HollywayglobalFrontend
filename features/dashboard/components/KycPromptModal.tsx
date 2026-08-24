"use client";

import Link from "next/link";
import { Arrow } from "../../../components/ui/Arrow";

export default function KycPromptModal({ onSkip }: { onSkip: () => void }) {
  return <div className="fixed inset-0 z-50 grid place-items-center bg-[#061936]/55 p-5" role="dialog" aria-modal="true" aria-labelledby="kyc-prompt-title"><section className="w-full max-w-md rounded-2xl border border-[#dfe4ed] bg-white p-6 shadow-2xl sm:p-8"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#edf4ff] text-lg font-extrabold text-[#1453bb]">✓</span><span className="mt-5 block text-[10px] font-extrabold tracking-[.18em] text-[#ff8a00]">ACCOUNT VERIFICATION</span><h2 id="kyc-prompt-title" className="mt-2 font-[Manrope] text-2xl font-extrabold tracking-[-.05em] text-[#0b1830]">Complete KYC when you’re ready</h2><p className="mt-3 text-sm leading-6 text-[#53627a]">You can continue creating listings, requests and service enquiries. Until verification is complete, new work stays in Draft and cannot be published, paid out or used for higher-value transactions.</p><div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button className="h-11 rounded-lg border border-[#dfe4ed] px-4 text-xs font-extrabold text-[#53627a] hover:border-[#1453bb]" type="button" onClick={onSkip}>Skip for now</button><Link className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#1453bb] px-4 text-xs font-extrabold text-white hover:bg-[#0b3f91]" href="/dashboard/profile/kyc">Start KYC <Arrow /></Link></div></section></div>;
}
