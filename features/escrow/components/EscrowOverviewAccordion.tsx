import { escrowProcessSteps } from "../data/escrow";

type EscrowOverviewAccordionProps = {
  draftSaved: boolean;
};

const summaryClass =
  "flex cursor-pointer list-none items-center gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden";

function PlusIcon() {
  return (
    <span className="text-lg leading-none text-[#8490a4] transition group-open:rotate-45" aria-hidden="true">
      +
    </span>
  );
}

export default function EscrowOverviewAccordion({ draftSaved }: EscrowOverviewAccordionProps) {
  return (
    <section
      aria-label="Standalone escrow information"
      className="overflow-hidden rounded-xl border border-[#dfe4ed] bg-white"
    >
      <details className="group border-b border-[#dfe4ed]">
        <summary className={summaryClass}>
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#edf4ff] text-[10px] font-extrabold text-[#1453bb]">
            01
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[9px] font-extrabold tracking-[.14em] text-[#1453bb]">
              FOR EXTERNAL DEALS
            </span>
            <span className="mt-0.5 block text-xs font-extrabold text-[#0b1830]">
              Protect a transaction found elsewhere
            </span>
          </span>
          <PlusIcon />
        </summary>
        <div className="px-4 pb-4 pl-14 text-[10px] leading-5 text-[#53627a]">
          Use standalone escrow when the buyer and seller met on Jiji, Instagram, X,
          Facebook Marketplace or offline. Hollyway records the agreement, coordinates
          tracked delivery and holds release until the agreed acceptance conditions are met.
        </div>
      </details>

      <details className="group border-b border-[#dfe4ed]">
        <summary className={summaryClass}>
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#fff3e5] text-[10px] font-extrabold text-[#c86600]">
            02
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[9px] font-extrabold tracking-[.14em] text-[#c86600]">
              THE PROTECTED FLOW
            </span>
            <span className="mt-0.5 block text-xs font-extrabold text-[#0b1830]">
              From agreement to payout
            </span>
          </span>
          <PlusIcon />
        </summary>
        <div className="grid gap-2 px-4 pb-4 pl-14 sm:grid-cols-2 lg:grid-cols-3">
          {escrowProcessSteps.map((step) => (
            <div className="rounded-lg bg-[#f7f9fc] p-3" key={step.number}>
              <span className="text-[9px] font-extrabold text-[#ff8a00]">{step.number}</span>
              <p className="mt-1 text-[10px] font-extrabold leading-4 text-[#0b1830]">{step.title}</p>
              <p className="mt-1 text-[10px] leading-4 text-[#8490a4]">{step.description}</p>
            </div>
          ))}
        </div>
      </details>

      <details className="group">
        <summary className={summaryClass}>
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#f3f5f8] text-[10px] font-extrabold text-[#53627a]">
            03
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[9px] font-extrabold tracking-[.14em] text-[#53627a]">
              DRAFT STATUS
            </span>
            <span className="mt-0.5 block text-xs font-extrabold text-[#0b1830]">
              Save your escrow request privately
            </span>
          </span>
          <span className="mr-2 shrink-0 rounded-full bg-[#f3f5f8] px-2 py-1 text-[9px] font-extrabold text-[#53627a]">
            {draftSaved ? "SAVED" : "PRIVATE · DRAFT"}
          </span>
          <PlusIcon />
        </summary>
        <div className="px-4 pb-4 pl-14 text-[10px] leading-5 text-[#53627a]">
          A draft is private, not published and not yet sent to Hollyway for review. Save
          at any point and return to finish it later.
          {draftSaved && (
            <p className="mt-2 font-extrabold text-[#168046]" role="status">
              Draft saved just now.
            </p>
          )}
        </div>
      </details>
    </section>
  );
}
