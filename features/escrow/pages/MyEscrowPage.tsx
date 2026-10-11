"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Arrow } from "../../../components/ui/Arrow";
import DashboardIcon from "../../dashboard/components/DashboardIcon";
import DashboardPageHeader from "../../dashboard/components/DashboardPageHeader";
import DashboardStatusTabs from "../../dashboard/components/DashboardStatusTabs";
import DashboardSummaryCard from "../../dashboard/components/DashboardSummaryCard";
import EscrowRequestCard from "../components/EscrowRequestCard";
import { fetchEscrowTransactions } from "../data/escrowApi";
import { showToast } from "../../../components/ui/ToastProvider";
import type { EscrowRequest } from "../data/escrow";

const statusFilters = [
  { label: "All escrow", value: "all" },
  { label: "Draft", value: "draft" },
  { label: "Pending review", value: "pending_review" },
  { label: "Approved", value: "approved" },
  { label: "Awaiting funder", value: "awaiting_funder" },
  { label: "Proof submitted", value: "payment_proof_submitted" },
  { label: "Payment received", value: "payment_received" },
  { label: "Inspection", value: "inspection" },
  { label: "Released", value: "released" },
  { label: "Disputed", value: "disputed" },
  { label: "Closed", value: "closed" },
] as const;

type StatusFilter = (typeof statusFilters)[number]["value"];

function filterTitle(filter: StatusFilter) {
  return statusFilters.find((item) => item.value === filter)?.label.toLowerCase() || "escrow";
}

export default function MyEscrowPage() {
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [requests, setRequests] = useState<EscrowRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetchEscrowTransactions()
      .then((items) => {
        if (active) setRequests(items);
      })
      .catch((reason) => {
        if (active) {
          const message = reason instanceof Error ? reason.message : "Your escrow requests could not be loaded.";
          setError(message);
          showToast("error", message);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const filteredRequests = useMemo(
    () => filter === "all" ? requests : requests.filter((request) => request.status === filter),
    [filter, requests],
  );
  const activeCount = requests.filter((request) => !["draft", "released", "closed"].includes(request.status)).length;
  const inspectionCount = requests.filter((request) => request.status === "inspection").length;
  const releasedCount = requests.filter((request) => ["released", "closed"].includes(request.status)).length;

  return (
    <div className="w-full space-y-4 p-4 sm:p-6 lg:p-8">
      <DashboardPageHeader
        action={<Link className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1453bb] px-3 text-xs font-extrabold text-white" href="/dashboard/escrow/new">Start escrow request <Arrow /></Link>}
        compact
        description="Follow payment, delivery, inspection, release and dispute stages for transactions protected through Hollyway."
        kicker="MY ESCROW"
        title="Keep protected transactions visible."
      />
      <section className="grid gap-3 sm:grid-cols-3">
        <DashboardSummaryCard compact icon="shield" label="ACTIVE" note="Requests moving through the flow" value={String(activeCount)} />
        <DashboardSummaryCard compact icon="clock" label="INSPECTION" note="Buyer confirmation pending" tone="purple" value={String(inspectionCount)} />
        <DashboardSummaryCard compact icon="check" label="RELEASED" note="Funds released or closed" tone="green" value={String(releasedCount)} />
      </section>
      <section className="rounded-lg border border-[#dfe4ed] bg-white p-4">
        <DashboardStatusTabs
          ariaLabel="Escrow status"
          items={statusFilters.map((item) => item.label)}
          active={statusFilters.find((item) => item.value === filter)?.label || "All escrow"}
          compact
          onChange={(label) => setFilter((statusFilters.find((item) => item.label === label)?.value || "all") as StatusFilter)}
        />
        {loading ? (
          <p className="border-t border-[#eef1f4] px-4 py-8 text-xs font-semibold text-[#8490a4]">Loading escrow requests…</p>
        ) : error ? (
          <div className="border-t border-[#eef1f4] px-4 py-8 text-xs font-semibold text-[#a32929]" role="alert">
            <p>{error}</p>
            <button className="mt-3 rounded-lg border border-[#cfe0f7] px-3 py-2 text-[10px] font-extrabold text-[#1453bb]" onClick={() => window.location.reload()} type="button">Retry</button>
          </div>
        ) : filteredRequests.length ? (
          <div className="mt-1 divide-y divide-[#eef1f4]">
            {filteredRequests.map((request) => <EscrowRequestCard key={request.reference} request={request} />)}
          </div>
        ) : (
          <div className="grid place-items-center border-t border-dashed border-[#cbd5e1] px-5 py-12 text-center">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#edf4ff] text-[#1453bb] [&>svg]:h-4 [&>svg]:w-4"><DashboardIcon name="shield" /></span>
            <h3 className="mt-3 font-[Manrope] text-base font-extrabold text-[#0b1830]">No {filterTitle(filter)} yet</h3>
            <p className="mt-1 max-w-md text-xs leading-5 text-[#8490a4]">Start a standalone escrow request to record the parties, agreed value, delivery arrangement and inspection terms in one place.</p>
            <Link className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg bg-[#1453bb] px-3 text-xs font-extrabold text-white" href="/dashboard/escrow/new">Create escrow request <Arrow /></Link>
          </div>
        )}
      </section>
      <p className="rounded-lg border border-[#f1d8a9] bg-[#fffaf1] p-3 text-[10px] leading-5 text-[#6b5a3d]"><strong>Payment safety:</strong> The paying party must accept funding responsibility and use the Hollyway bank details shown on the request. Upload the receipt here; Admin reviews it and marks the payment received or rejected.</p>
    </div>
  );
}
