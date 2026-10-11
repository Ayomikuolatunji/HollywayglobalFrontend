import Link from "next/link";
import { Arrow } from "../../../components/ui/Arrow";
import OrderCopyActions, { type OrderCopyDetails } from "../../commerce/components/OrderCopyActions";
import { formatMinorNaira, type EscrowRequest } from "../data/escrow";
import EscrowStatusPill from "./EscrowStatusPill";

function dateLabel(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" });
}

function feeLabel(request: EscrowRequest) {
  if (request.escrow_fee_min_minor === null || request.escrow_fee_max_minor === null) return "To be confirmed";
  if (request.escrow_fee_min_minor === request.escrow_fee_max_minor) return formatMinorNaira(request.escrow_fee_min_minor);
  return formatMinorNaira(request.escrow_fee_min_minor) + "–" + formatMinorNaira(request.escrow_fee_max_minor);
}

function coverageLabel(value: string | null) {
  return value === "initiator" ? "Request creator" : value === "counterparty" ? "Other party" : value === "split" ? "Shared by both parties" : "To be agreed";
}

export default function EscrowRequestConfirmation({ request, onCreateAnother }: {
  request: EscrowRequest;
  onCreateAnother: () => void;
}) {
  const parties = request.participants.filter((item) => item.role !== "funder").map((item) => item.email || item.role).join(" · ") || "Verified parties recorded";
  const copy: OrderCopyDetails = {
    title: "Hollyway escrow request",
    reference: request.reference,
    status: request.status_label.toUpperCase(),
    createdAt: dateLabel(request.created_at),
    fields: [
      { label: "Purpose", value: request.purpose_label },
      { label: "Subject", value: request.subject || "Not provided" },
      { label: "Agreed value", value: formatMinorNaira(request.amount_minor) },
      { label: "Hollyway fee", value: feeLabel(request) },
      { label: "Fee coverage", value: coverageLabel(request.fee_coverage) },
      { label: "Parties", value: parties },
      { label: "Release conditions", value: request.release_conditions || "To be confirmed" },
    ],
    note: "No payment was taken when this request was submitted. The paying party sees the official Hollyway bank instructions after accepting responsibility, then uploads the transfer proof for Admin review.",
  };

  return (
    <section className="rounded-xl border border-[#bfe5d0] bg-[#f5fcf7] p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#20bd61] text-lg font-extrabold text-white">✓</span>
          <h3 className="mt-4 font-[Manrope] text-xl font-extrabold tracking-[-.04em] text-[#0b1830]">Escrow request submitted</h3>
          <p className="mt-1 max-w-xl text-xs leading-5 text-[#53627a]">Hollyway has recorded the agreement. Keep the HWE reference; the paying party must accept responsibility and use the official payment details shown on the request.</p>
        </div>
        <EscrowStatusPill status={request.status} />
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-[#dfeee3] bg-white p-3"><span className="text-[9px] font-extrabold tracking-[.12em] text-[#8b97a9]">REQUEST REFERENCE</span><strong className="mt-1 block font-[Manrope] text-base font-extrabold text-[#1453bb]">{request.reference}</strong></div>
        <div className="rounded-lg border border-[#dfeee3] bg-white p-3"><span className="text-[9px] font-extrabold tracking-[.12em] text-[#8b97a9]">SUBMITTED</span><strong className="mt-1 block text-xs font-extrabold text-[#0b1830]">{dateLabel(request.created_at)}</strong></div>
      </div>
      <p className="mt-4 rounded-lg border border-[#f1d8a9] bg-[#fffaf1] p-3 text-[10px] font-semibold leading-5 text-[#6b5a3d]">No payment was initiated. The paying party will see the Hollyway account details after accepting funding responsibility. Upload the bank receipt on the escrow page; Admin reviews the receipt and marks the payment received or rejected.</p>
      <OrderCopyActions copy={copy} />
      <div className="mt-5 flex flex-wrap gap-2">
        <Link className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1453bb] px-4 text-xs font-extrabold text-white" href={"/dashboard/escrow/" + encodeURIComponent(request.reference)}>View request <Arrow /></Link>
        <button className="inline-flex h-10 items-center rounded-lg border border-[#b9d9c4] px-4 text-xs font-extrabold text-[#14733d]" onClick={onCreateAnother} type="button">Create another request</button>
      </div>
    </section>
  );
}
