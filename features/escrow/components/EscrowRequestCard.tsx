import Link from "next/link";
import { Arrow } from "../../../components/ui/Arrow";
import { formatMinorNaira, type EscrowRequest } from "../data/escrow";
import EscrowStatusPill from "./EscrowStatusPill";

function dateLabel(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-NG", { dateStyle: "medium" });
}

export default function EscrowRequestCard({ request }: { request: EscrowRequest }) {
  const href = request.status === "draft"
    ? "/dashboard/escrow/new?draft=" + encodeURIComponent(request.reference)
    : "/dashboard/escrow/" + encodeURIComponent(request.reference);
  const partyCount = request.participants.filter((item) => item.role !== "funder").length;

  return (
    <article className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#edf4ff] text-[9px] font-extrabold text-[#1453bb]">HWE</span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-sm font-extrabold text-[#0b1830]">{request.subject || "Untitled escrow agreement"}</h3>
            <EscrowStatusPill status={request.status} />
          </div>
          <p className="mt-1 text-[10px] text-[#687895]">{request.reference} · {dateLabel(request.updated_at)} · {request.purpose_label}</p>
          <p className="mt-1 text-[10px] text-[#8490a4]">{request.amount_minor ? formatMinorNaira(request.amount_minor) : "Value not entered"} · {partyCount} participant{partyCount === 1 ? "" : "s"} · {request.delivery_required ? "Delivery included" : "No delivery selected"}</p>
        </div>
      </div>
      <Link className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg border border-[#cfe0f7] px-3 text-[10px] font-extrabold text-[#1453bb] hover:bg-[#edf4ff]" href={href}>{request.status === "draft" ? "Continue draft" : "View request"} <Arrow /></Link>
    </article>
  );
}
