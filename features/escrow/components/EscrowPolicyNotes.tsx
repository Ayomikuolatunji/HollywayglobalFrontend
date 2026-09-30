export default function EscrowPolicyNotes() {
  return (
    <section className="grid gap-3 sm:grid-cols-2" aria-label="Escrow policies">
      <article className="rounded-xl border border-[#dfe4ed] bg-white p-4">
        <span className="text-[9px] font-extrabold tracking-[.14em] text-[#1453bb]">IF THERE IS A DISPUTE</span>
        <h3 className="mt-1 font-[Manrope] text-sm font-extrabold text-[#0b1830]">Funds are frozen first</h3>
        <ol className="mt-3 space-y-2 text-[10px] leading-4 text-[#53627a]">
          <li><b className="text-[#0b1830]">01.</b> Report the issue and stop the release.</li>
          <li><b className="text-[#0b1830]">02.</b> Submit unboxing video, photos, waybill and written chat evidence within 24 hours.</li>
          <li><b className="text-[#0b1830]">03.</b> Hollyway reviews the original terms and issues a decision within 24–48 hours.</li>
        </ol>
      </article>
      <article className="rounded-xl border border-[#dfe4ed] bg-white p-4">
        <span className="text-[9px] font-extrabold tracking-[.14em] text-[#ff8a00]">RETURN AND RELEASE RULES</span>
        <h3 className="mt-1 font-[Manrope] text-sm font-extrabold text-[#0b1830]">Inspect before approving payout</h3>
        <p className="mt-3 text-[10px] leading-5 text-[#53627a]">A buyer change of mind follows the documented return-delivery rule. Seller misrepresentation or a faulty item can result in a full buyer refund. Once the buyer confirms satisfaction and funds are released, the transaction is permanently closed and non-refundable.</p>
      </article>
    </section>
  );
}
