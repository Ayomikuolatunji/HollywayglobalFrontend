"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Arrow } from "../../../components/ui/Arrow";
import PaginationControls from "../../../components/ui/PaginationControls";
import DashboardEmptyState from "../../dashboard/components/DashboardEmptyState";
import DashboardPageHeader from "../../dashboard/components/DashboardPageHeader";
import DashboardStatusTabs from "../../dashboard/components/DashboardStatusTabs";
import { fetchWantedRequests, type Page, type WantedRequest } from "../data/commerceApi";

const statuses = ["All requests", "Draft", "Pending review", "Published", "Completed", "Cancelled"] as const;
const statusMap: Record<string, string | undefined> = { "All requests": undefined, Draft: "draft", "Pending review": "pending_review", Published: "published", Completed: "completed", Cancelled: "cancelled" };

export default function MyRequestsPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<(typeof statuses)[number]>("All requests");
  const [page, setPage] = useState<Page<WantedRequest> | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [error, setError] = useState("");
  useEffect(() => { const requested = searchParams.get("status"); const match = statuses.find((item) => item.toLowerCase() === requested?.toLowerCase()); if (match) setStatus(match); }, [searchParams]);
  useEffect(() => { setError(""); void fetchWantedRequests(pageNumber, 25, statusMap[status]).then(setPage).catch((reason) => setError(reason instanceof Error ? reason.message : "Requests could not be loaded.")); }, [pageNumber, status]);
  const items = page?.items || [];
  return (
    <div className="w-full space-y-4 p-4 sm:p-6">
      <DashboardPageHeader compact kicker="MY REQUESTS" title="Track what you are looking for." description="Your saved wanted requests and their review or broadcast status are stored here." action={<Link className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1453bb] px-3 text-xs font-extrabold text-white" href="/dashboard/requests/new">Request an item <Arrow /></Link>} />
      {error && <p className="rounded-lg border border-[#f1c8c3] bg-[#fff5f3] p-3 text-xs font-semibold text-[#a32929]">{error}</p>}
      <section className="rounded-lg border border-[#dfe4ed] bg-white p-4">
        <div className="mb-4 flex items-center justify-between gap-3"><div><span className="text-[10px] font-extrabold tracking-[.14em] text-[#1453bb]">REQUEST RECORDS</span><h2 className="mt-1 text-lg font-extrabold text-[#0b1830]">{page?.total ?? 0} request{page?.total === 1 ? "" : "s"}</h2></div><span className="text-[10px] font-semibold text-[#687895]">Server records</span></div>
        <DashboardStatusTabs compact items={statuses} active={status} onChange={(value) => { setStatus(value as (typeof statuses)[number]); setPageNumber(1); }} ariaLabel="Request status" />
        {items.length ? <div className="mt-4 divide-y divide-[#eef1f4]">{items.map((item) => <Link className="block py-4 first:pt-0 hover:bg-[#f8fafc]" href={`/dashboard/requests/${encodeURIComponent(item.reference)}`} key={item.reference}><div className="flex flex-wrap items-center justify-between gap-2"><strong className="text-sm text-[#0b1830]">{item.item_name}</strong><span className="rounded-full bg-[#eef5ff] px-2 py-1 text-[10px] font-extrabold text-[#1453bb]">{item.status_label}</span></div><p className="mt-1 text-xs text-[#53627a]">{item.reference} · {item.delivery_location} · {item.preferred_condition}</p><p className="mt-1 text-[10px] text-[#8290a8]">Updated {new Date(item.updated_at).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })}</p></Link>)}</div> : <DashboardEmptyState icon="search" title={`No ${status.toLowerCase()} yet`} description="New wanted requests will appear here after they are saved through Hollyway." actionHref="/dashboard/requests/new" actionLabel="Create wanted request" compact />}{page && <PaginationControls page={page.page} totalPages={page.total_pages} hasPrevious={page.has_previous} hasNext={page.has_next} onPageChange={setPageNumber} />}
      </section>
    </div>
  );
}
