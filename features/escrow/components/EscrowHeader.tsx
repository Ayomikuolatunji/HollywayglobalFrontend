import type { ReactNode } from "react";

export default function EscrowHeader({ action }: { action?: ReactNode }) {
  return <header className="flex flex-col justify-between gap-4 border-b border-[#dfe4ed] pb-5 sm:flex-row sm:items-end"><div><p className="text-[10px] font-extrabold text-[#ff8a00]">Escrow request</p><h1 className="mt-2 font-[Manrope] text-2xl font-extrabold tracking-[-.06em] text-[#0b1830] sm:text-3xl">Protect the agreement.</h1><p className="mt-2 max-w-2xl text-xs leading-5 text-[#53627a] sm:text-sm sm:leading-6">Record an item sale, service agreement or protected deposit with clear parties, terms and release conditions.</p></div>{action}</header>;
}
