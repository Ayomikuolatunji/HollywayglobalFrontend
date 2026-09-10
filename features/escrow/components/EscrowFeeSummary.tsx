"use client";

import { useEffect, useState } from "react";

const money = (value: number) => `₦${value.toLocaleString("en-NG")}`;

export type EscrowFee = { label: string; minimum: number; maximum: number; needsConfirmation: boolean };

export function getEscrowFee(value: number): EscrowFee | null {
  if (value < 1_000) return null;
  if (value <= 10_000) return { label: "₦150–₦550", minimum: 150, maximum: 550, needsConfirmation: true };
  if (value <= 50_000) return { label: "₦1,100", minimum: 1_100, maximum: 1_100, needsConfirmation: false };
  if (value <= 100_000) return { label: "₦2,200", minimum: 2_200, maximum: 2_200, needsConfirmation: false };
  if (value <= 500_000) return { label: "₦3,300", minimum: 3_300, maximum: 3_300, needsConfirmation: false };
  if (value <= 1_000_000) return { label: "₦10,500", minimum: 10_500, maximum: 10_500, needsConfirmation: false };
  const fee = Math.round(value * 0.01);
  return { label: `${money(fee)} (1%)`, minimum: fee, maximum: fee, needsConfirmation: true };
}

export default function EscrowFeeSummary({ transactionValue }: { transactionValue?: number }) {
  const [formValue, setFormValue] = useState(0);

  useEffect(() => {
    if (transactionValue !== undefined) return;
    const input = document.querySelector<HTMLInputElement>('input[name="value"]');
    if (!input) return;
    const update = () => setFormValue(Number(input.value) || 0);
    update();
    input.addEventListener("input", update);
    return () => input.removeEventListener("input", update);
  }, [transactionValue]);

  const value = transactionValue ?? formValue;
  const fee = getEscrowFee(value);
  const total = fee && fee.minimum === fee.maximum ? money(value + fee.minimum) : fee ? `${money(value + fee.minimum)}–${money(value + fee.maximum)}` : "—";

  return <section className="rounded-xl border border-[#cfe0f7] bg-[#f4f8ff] p-4" aria-live="polite">
    <div className="flex items-start justify-between gap-4"><div><span className="text-[9px] font-extrabold tracking-[.14em] text-[#1453bb]">HOLLYWAY ESCROW FEE</span><h3 className="mt-1 text-sm font-extrabold text-[#0b1830]">See what you will pay</h3></div><strong className="shrink-0 font-[Manrope] text-lg font-extrabold text-[#1453bb]">{fee?.label || "Enter a value"}</strong></div>
    {fee ? <dl className="mt-3 space-y-2 border-t border-[#dbe7f7] pt-3 text-xs"><div className="flex justify-between gap-4"><dt className="text-[#53627a]">Transaction value</dt><dd className="font-bold text-[#0b1830]">{money(value)}</dd></div><div className="flex justify-between gap-4"><dt className="text-[#53627a]">Hollyway escrow fee</dt><dd className="font-bold text-[#0b1830]">{fee.label}</dd></div><div className="flex justify-between gap-4"><dt className="font-extrabold text-[#0b1830]">Amount paid into escrow</dt><dd className="font-extrabold text-[#1453bb]">{total}</dd></div></dl> : <p className="mt-3 text-[10px] leading-5 text-[#53627a]">Enter an agreed transaction value from ₦1,000 to see the official Hollyway fee.</p>}
    <p className="mt-3 text-[10px] leading-4 text-[#53627a]">{fee?.needsConfirmation ? "The final fee requires Hollyway confirmation under the approved fee schedule. " : ""}Delivery or courier charges are separate. Fee responsibility follows the buyer, seller or split option selected in the request.</p>
  </section>;
}
