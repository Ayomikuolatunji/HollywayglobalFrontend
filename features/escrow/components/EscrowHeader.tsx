import type { ReactNode } from "react";
import EscrowFeeSummary from "./EscrowFeeSummary";

export default function EscrowHeader({ action, transactionValue = 0 }: { action?: ReactNode; transactionValue?: number }) {
  return <><div className="flex flex-col justify-between gap-4 border-b border-[#dfe4ed] pb-5 sm:flex-row sm:items-end"><div><span className="text-[10px] font-extrabold tracking-[.18em] text-[#ff8a00]">STANDALONE ESCROW</span><h2 className="mt-2 font-[Manrope] text-2xl font-extrabold tracking-[-.06em] text-[#0b1830] sm:text-3xl">Protect the agreement.</h2><p className="mt-2 max-w-2xl text-xs leading-5 text-[#53627a] sm:text-sm sm:leading-6">Record an item sale, service agreement or protected deposit when the parties need Hollyway to coordinate the written terms and release conditions.</p></div>{action}</div><EscrowFeeSummary transactionValue={transactionValue} /></>;
}
