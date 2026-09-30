import { escrowStatusLabels, type EscrowStatus } from "../data/escrow";

const statusClasses: Partial<Record<EscrowStatus, string>> = {
  draft: "bg-[#f8fafc] text-[#53627a]",
  pending_review: "bg-[#fff7e8] text-[#9a5a00]",
  approved: "bg-[#edf4ff] text-[#1453bb]",
  awaiting_party_acceptance: "bg-[#edf4ff] text-[#1453bb]",
  awaiting_funder: "bg-[#edf4ff] text-[#1453bb]",
  payment_pending: "bg-[#edf4ff] text-[#1453bb]",
  payment_verified: "bg-[#e3f7e9] text-[#168046]",
  payment_proof_submitted: "bg-[#fff7e8] text-[#9a5a00]",
  payment_received: "bg-[#e3f7e9] text-[#168046]",
  payment_rejected: "bg-[#fff4f2] text-[#a32929]",
  dispatch_booked: "bg-[#edf4ff] text-[#1453bb]",
  in_transit: "bg-[#edf4ff] text-[#1453bb]",
  delivered: "bg-[#edf4ff] text-[#1453bb]",
  inspection: "bg-[#f3edff] text-[#6b45c7]",
  buyer_confirmed: "bg-[#e3f7e9] text-[#168046]",
  released: "bg-[#e3f7e9] text-[#168046]",
  disputed: "bg-[#fff4f2] text-[#a32929]",
  refunded: "bg-[#e3f7e9] text-[#168046]",
  closed: "bg-[#e3f7e9] text-[#168046]",
  cancelled: "bg-[#f8fafc] text-[#53627a]",
  expired: "bg-[#f8fafc] text-[#53627a]",
};

export default function EscrowStatusPill({ status }: { status: EscrowStatus }) {
  return (
    <span className={"inline-flex rounded-full px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[.08em] " + (statusClasses[status] || "bg-[#f8fafc] text-[#53627a]")}>
      {escrowStatusLabels[status] || "Status update"}
    </span>
  );
}
