"use client";

import Link from "next/link";
import { Arrow } from "../../../components/ui/Arrow";
import { kycStatusDescription, kycStatusLabel } from "../data/kyc";
import type { KycServerSubmission } from "../data/kycApi";
import DashboardIcon from "./DashboardIcon";

function formatDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-NG", { dateStyle: "medium" });
}

export default function KycStatusPanel({ submission, loading, onRefresh }: { submission: KycServerSubmission; loading: boolean; onRefresh: () => void }) {
  const status = submission.status;
  return (
    <section className="rounded-xl border border-[#bfe5d0] bg-[#f5fcf7] p-5 shadow-sm sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#20bd61] text-xl font-extrabold text-white">
          <DashboardIcon name="shield" />
        </span>
        <div className="min-w-0 flex-1">
          <span className="text-[10px] font-extrabold tracking-[.16em] text-[#168046]">
            {kycStatusLabel(status).toUpperCase()}
          </span>
          <h3 className="mt-2 font-[Manrope] text-2xl font-extrabold tracking-[-.05em] text-[#0b1830]">
            Your identity is verified.
          </h3>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#376957]">
            {kycStatusDescription(status)}
          </p>
          {submission.submitted_at && (
            <p className="mt-3 text-[10px] font-bold uppercase tracking-[.1em] text-[#5d8a70]">
              Completed {formatDate(submission.submitted_at)}
            </p>
          )}
        </div>
      </div>
      <dl className="mt-6 grid gap-3 border-t border-[#d7efdf] pt-5 text-xs sm:grid-cols-2">
        <div>
          <dt className="text-[10px] font-extrabold tracking-[.1em] text-[#6d9b7d]">LEGAL NAME</dt>
          <dd className="mt-1 font-semibold text-[#174f3d]">{submission.legal_full_name || "On file"}</dd>
        </div>
        <div>
          <dt className="text-[10px] font-extrabold tracking-[.1em] text-[#6d9b7d]">IDENTITY</dt>
          <dd className="mt-1 font-semibold text-[#174f3d]">
            {submission.identity_type || "Identity"} ending {submission.identity_last4 || "—"}
          </dd>
        </div>
      </dl>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#168046] px-4 text-xs font-extrabold text-white hover:bg-[#116537]" href="/dashboard/profile">
          Back to profile <Arrow />
        </Link>
        <button className="inline-flex h-10 items-center rounded-lg border border-[#bfe5d0] px-4 text-xs font-extrabold text-[#168046] disabled:opacity-50" type="button" onClick={onRefresh} disabled={loading}>
          {loading ? "Refreshing…" : "Refresh status"}
        </button>
      </div>
    </section>
  );
}
