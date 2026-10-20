"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Arrow } from "../../../components/ui/Arrow";
import CommercePageHeader from "../components/CommercePageHeader";
import WalletPromotionPaymentButton from "../components/WalletPromotionPaymentButton";
import WantedRequestFeeButton from "../components/WantedRequestFeeButton";
import WantedRequestRenewalButton from "../components/WantedRequestRenewalButton";
import { fetchWantedRequest, type WantedRequest } from "../data/commerceApi";

export default function WantedRequestDetailsPage({ reference }: { reference: string }) {
  const [record, setRecord] = useState<WantedRequest | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    void fetchWantedRequest(reference)
      .then(setRecord)
      .catch((reason) => setError(reason instanceof Error ? reason.message : "The request could not be loaded."));
  }, [reference]);

  if (error) return <div className="p-6"><p className="rounded-lg border border-[#f1c8c3] bg-[#fff5f3] p-4 text-xs font-semibold text-[#a32929]">{error}</p></div>;
  if (!record) return <div className="grid min-h-56 place-items-center p-6 text-xs font-semibold text-[#687895]">Loading request…</div>;

  const editable = record.status === "draft" || record.status === "cancelled";
  const budget = `${record.budget_min_minor ? `₦${(record.budget_min_minor / 100).toLocaleString("en-NG")}` : "Not set"} – ${record.budget_max_minor ? `₦${(record.budget_max_minor / 100).toLocaleString("en-NG")}` : "Not set"}`;
  const details = [
    ["SPECIFICATIONS", record.specification || "Not supplied"],
    ["QUANTITY", String(record.quantity)],
    ["CONDITION", record.preferred_condition],
    ["DELIVERY", record.delivery_location],
    ["URGENCY", record.urgency],
    ["BUDGET", budget],
  ];

  return (
    <div className="w-full space-y-4 p-4 sm:p-6">
      <CommercePageHeader compact kicker="WANTED REQUEST" title={record.item_name} description={`${record.reference} · ${record.status_label}`} action={<Link className="inline-flex items-center gap-2 text-xs font-extrabold text-[#1453bb]" href="/dashboard/requests">Back to requests <Arrow /></Link>} />
      <section className="grid gap-4 lg:grid-cols-[1fr_300px]">
        <section className="rounded-xl border border-[#dfe4ed] bg-white p-5">
          <dl className="grid gap-4 sm:grid-cols-2">
            {details.map(([label, value]) => <div key={label}><dt className="text-[9px] font-extrabold tracking-[.12em] text-[#8995a8]">{label}</dt><dd className="mt-1 text-sm font-semibold text-[#31425e]">{value}</dd></div>)}
          </dl>
          <p className="mt-5 border-t border-[#eef1f4] pt-4 text-xs leading-6 text-[#53627a]">{record.details || "No additional specifications supplied."}</p>
        </section>
        <aside className="space-y-4 rounded-xl border border-[#dfe4ed] bg-white p-5">
          <span className="rounded-full bg-[#eef5ff] px-3 py-1 text-[10px] font-extrabold text-[#1453bb]">{record.status_label}</span>
          {editable && <Link className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[#1453bb] px-3 text-[10px] font-extrabold text-white" href={`/dashboard/requests/new?reference=${encodeURIComponent(record.reference)}`}>Continue editing <Arrow /></Link>}
          {record.status === "expired" && <WantedRequestRenewalButton reference={record.reference} amountMinor={record.renewal_fee_minor} onRenewed={() => void fetchWantedRequest(record.reference).then(setRecord)} />}
          <WantedRequestFeeButton reference={record.reference} amountMinor={record.request_fee_minor} paymentStatus={record.request_payment_status} onPaid={() => setRecord({ ...record, request_payment_status: "paid" })} />
          <WalletPromotionPaymentButton targetType="wanted_request" reference={record.reference} packageId={record.featured_package} paymentStatus={record.featured_payment_status} onPaid={() => setRecord({ ...record, featured_payment_status: "paid" })} />
          <div>
            <h2 className="text-sm font-extrabold text-[#0b1830]">Activity</h2>
            <div className="mt-3 space-y-3">{record.status_events.map((event) => <div className="border-l-2 border-[#cfe0f7] pl-3" key={event.id}><p className="text-xs font-extrabold text-[#0b1830]">{event.to_status_label}</p><p className="mt-1 text-[10px] text-[#687895]">{event.reason || "Workflow update"} · {new Date(event.created_at).toLocaleString("en-NG")}</p></div>)}</div>
          </div>
        </aside>
      </section>
    </div>
  );
}
