import type { ReactNode } from "react";

export default function AdvertisingHeader({ action }: { action?: ReactNode }) {
  return <div className="flex flex-col justify-between gap-5 border-b border-[#dfe4ed] pb-6 sm:flex-row sm:items-end"><div><span className="text-[10px] font-extrabold tracking-[.18em] text-[#ff8a00]">ADVERTISING & PROMOTIONS</span><h2 className="mt-2 font-[Manrope] text-3xl font-extrabold tracking-[-.06em] text-[#0b1830]">Put the right listing in front.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[#53627a]">Promote a listing, stock lot or business offer with a clear campaign brief.</p></div>{action}</div>;
}
