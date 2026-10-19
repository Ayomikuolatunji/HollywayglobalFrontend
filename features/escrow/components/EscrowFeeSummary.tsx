import { formatNaira } from "../data/escrow";
import type { EscrowFeeQuote } from "../data/escrowApi";

function formatFee(quote: EscrowFeeQuote) {
  if (quote.escrow_fee_min_minor === null || quote.escrow_fee_max_minor === null) return "To be confirmed";
  const minimum = quote.escrow_fee_min_minor / 100;
  const maximum = quote.escrow_fee_max_minor / 100;
  return minimum === maximum ? formatNaira(minimum) : `${formatNaira(minimum)}–${formatNaira(maximum)}`;
}

export default function EscrowFeeSummary({ transactionValue, quote, loading, error }: { transactionValue?: number; quote: EscrowFeeQuote | null; loading: boolean; error: boolean }) {
  const value = transactionValue || 0;
  const fee = value >= 1_000 && quote ? formatFee(quote) : null;
  const minimum = quote?.escrow_fee_min_minor === null || quote?.escrow_fee_min_minor === undefined ? null : quote.escrow_fee_min_minor / 100;
  const maximum = quote?.escrow_fee_max_minor === null || quote?.escrow_fee_max_minor === undefined ? null : quote.escrow_fee_max_minor / 100;
  const total = minimum === null || maximum === null
    ? "—"
    : minimum === maximum
      ? formatNaira(value + minimum)
      : `${formatNaira(value + minimum)}–${formatNaira(value + maximum)}`;

  return <section className="rounded-xl border border-[#cfe0f7] bg-[#f4f8ff] p-4" aria-live="polite">
    <div className="flex items-start justify-between gap-4"><div><span className="text-[9px] font-extrabold tracking-[.14em] text-[#1453bb]">HOLLYWAY ESCROW FEE</span><h3 className="mt-1 text-sm font-extrabold text-[#0b1830]">See the fee before you pay</h3></div><strong className="shrink-0 font-[Manrope] text-lg font-extrabold text-[#1453bb]">{loading ? "Loading…" : error ? "Unavailable" : fee || "Enter a value"}</strong></div>
    {fee ? <dl className="mt-3 space-y-2 border-t border-[#dbe7f7] pt-3 text-xs"><div className="flex justify-between gap-4"><dt className="text-[#53627a]">Agreed value</dt><dd className="font-bold text-[#0b1830]">{formatNaira(value)}</dd></div><div className="flex justify-between gap-4"><dt className="text-[#53627a]">Hollyway escrow fee</dt><dd className="font-bold text-[#0b1830]">{fee}{quote?.loyalty_discount_percentage ? ` · ${quote.loyalty_discount_percentage}% loyalty discount` : ""}</dd></div><div className="flex justify-between gap-4"><dt className="font-extrabold text-[#0b1830]">Value + Hollyway fee</dt><dd className="font-extrabold text-[#1453bb]">{total}</dd></div></dl> : <p className="mt-3 text-[10px] leading-5 text-[#53627a]">{error ? "The current Hollyway fee could not be loaded. Try again before submitting." : "Enter an agreed transaction value from ₦1,000 to load Hollyway&apos;s current fee quote."}</p>}
    <p className="mt-3 text-[10px] leading-4 text-[#53627a]">The server quote is authoritative; the final transfer amount is repeated on the escrow request. Delivery or courier charges are separate and confirmed before fulfilment.</p>
  </section>;
}
