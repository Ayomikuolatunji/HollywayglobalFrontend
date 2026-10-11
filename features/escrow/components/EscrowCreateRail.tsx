import EscrowFeeSummary from "./EscrowFeeSummary";
import { escrowProcessSteps } from "../data/escrow";

type EscrowCreateRailProps = {
  transactionValue: number;
  draftSaved: boolean;
};

export default function EscrowCreateRail({ transactionValue, draftSaved }: EscrowCreateRailProps) {
  return (
    <aside className="grid content-start gap-3 lg:sticky lg:top-6" aria-label="Escrow request guidance">
      <EscrowFeeSummary transactionValue={transactionValue} />

      <section className="rounded-xl border border-[#dfe4ed] bg-white p-4">
        <p className="text-[10px] font-extrabold text-[#1453bb]">What happens next</p>
        <h2 className="mt-1 font-[Manrope] text-base font-extrabold tracking-[-.03em] text-[#0b1830]">One clear record for both parties.</h2>
        <ol className="mt-4 grid gap-3">
          {escrowProcessSteps.slice(0, 4).map((step) => (
            <li className="flex gap-3" key={step.number}>
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#edf4ff] text-[9px] font-extrabold text-[#1453bb]">{step.number}</span>
              <span>
                <strong className="block text-[11px] font-extrabold text-[#0b1830]">{step.title}</strong>
                <span className="mt-0.5 block text-[10px] leading-4 text-[#687895]">{step.description}</span>
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-4 border-t border-[#eef1f4] pt-3 text-[10px] leading-4 text-[#687895]">After receipt review, fulfilment and release follow the written acceptance conditions.</p>
      </section>

      <section className="rounded-xl border border-[#dfe4ed] bg-[#f8fafc] p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[11px] font-extrabold text-[#0b1830]">Draft status</h2>
          <span className="rounded-full bg-white px-2 py-1 text-[9px] font-extrabold text-[#1453bb]">{draftSaved ? "Saved" : "Private"}</span>
        </div>
        <p className="mt-2 text-[10px] leading-4 text-[#687895]">A draft stays private until you submit it for Hollyway review.</p>
      </section>

      <p className="rounded-xl border border-[#f1d8a9] bg-[#fffaf1] p-4 text-[10px] leading-5 text-[#6b5a3d]"><strong>Payment safety:</strong> no payment is requested on this form. Transfer only after approval, using the Hollyway account shown to the accepted funding party.</p>
    </aside>
  );
}
