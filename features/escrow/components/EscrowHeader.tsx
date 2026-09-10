import type { ReactNode } from "react";
import EscrowFeeSummary from "./EscrowFeeSummary";

export default function EscrowHeader({ action }: { action?: ReactNode }) {
  return <><div className="flex flex-col justify-between gap-5 border-b border-[#dfe4ed] pb-6 sm:flex-row sm:items-end"><div><span className="text-[10px] font-extrabold tracking-[.18em] text-[#ff8a00]">STANDALONE THIRD-PARTY ESCROW</span><h2 className="mt-2 font-[Manrope] text-3xl font-extrabold tracking-[-.06em] text-[#0b1830]">Protect the transaction.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[#53627a]">Independent escrow transaction protection for buyers and sellers who met on Jiji, Instagram, X, Facebook Marketplace or offline.</p></div>{action}</div><EscrowFeeSummary /></>;
}
