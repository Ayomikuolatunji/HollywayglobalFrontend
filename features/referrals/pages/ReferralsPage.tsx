"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Arrow } from "../../../components/ui/Arrow";
import DashboardIcon from "../../dashboard/components/DashboardIcon";
import DashboardPageHeader from "../../dashboard/components/DashboardPageHeader";
import DashboardSummaryCard from "../../dashboard/components/DashboardSummaryCard";
import ReferralActivity from "../components/ReferralActivity";
import ReferralCodeCard from "../components/ReferralCodeCard";
import { fetchReferralSummary, type ReferralSummary } from "../data/referralsApi";

function emptySummary(): ReferralSummary {
  return {
    referral_code: "",
    referral_link: "",
    total_referrals: 0,
    registered_referrals: 0,
    referrals: [],
  };
}

export default function ReferralsPage() {
  const [summary, setSummary] = useState<ReferralSummary>(emptySummary);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function load(signal?: AbortSignal) {
    setError("");
    try {
      setSummary(await fetchReferralSummary(signal));
    } catch (requestError) {
      if (requestError instanceof DOMException && requestError.name === "AbortError") return;
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Referral information could not be loaded.",
      );
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, []);

  async function copyLink() {
    if (!summary.referral_link) return;
    try {
      await navigator.clipboard.writeText(summary.referral_link);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("Your browser did not allow the link to be copied. Select and copy it from the link above.");
    }
  }

  async function shareLink() {
    if (!summary.referral_link) return;
    if (navigator.share) {
      await navigator.share({
        title: "Join Hollyway Global",
        text: "Join me on Hollyway Global.",
        url: summary.referral_link,
      }).catch(() => null);
      return;
    }
    await copyLink();
  }

  return (
    <div className="w-full space-y-3 px-4 pb-16 pt-1 sm:px-6 lg:px-8">
      <DashboardPageHeader
        kicker="PARTNERSHIPS & FINANCE"
        title="Referrals"
        description="Share your link and track registrations."
        compact
        action={
          <Link
            className="inline-flex h-8 items-center gap-2 rounded-lg border border-[#e4e2da] bg-white px-3 text-[11px] font-bold text-[#14213d] hover:border-[#14213d]"
            href="/dashboard/referrals/new"
          >
            How it works <Arrow />
          </Link>
        }
      />
      {error && (
        <div
          className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[#f1d8a9] bg-[#fffaf1] px-3 py-2 text-[11px] leading-4 text-[#6b5a3d]"
          role="alert"
        >
          <span>{error}</span>
          <button
            className="font-extrabold text-[#b8560d] hover:underline"
            type="button"
            onClick={() => {
              setLoading(true);
              void load();
            }}
          >
            Retry
          </button>
        </div>
      )}
      <section className="grid grid-cols-3 gap-2 sm:gap-3" aria-label="Referral summary">
        <DashboardSummaryCard
          label="TOTAL REFERRALS"
          value={loading ? "—" : String(summary.total_referrals)}
          note="New accounts attributed to you"
          icon="users"
          tone="blue"
          compact
          micro
        />
        <DashboardSummaryCard
          label="REGISTERED"
          value={loading ? "—" : String(summary.registered_referrals)}
          note="Registration activity recorded"
          icon="check"
          tone="green"
          compact
          micro
        />
        <DashboardSummaryCard
          label="PARTNER CODE"
          value={loading ? "—" : summary.referral_code || "—"}
          note="Server-generated and immutable"
          icon="shield"
          tone="purple"
          compact
          micro
        />
      </section>
      <ReferralCodeCard
        code={summary.referral_code}
        link={summary.referral_link}
        copied={copied}
        onCopy={() => void copyLink()}
        onShare={() => void shareLink()}
      />
      <ReferralActivity records={summary.referrals} />
      <section className="flex flex-col gap-3 rounded-xl border border-[#e4e2da] bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex items-start gap-3">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#f6efdc] text-[#b8560d] [&>svg]:h-4 [&>svg]:w-4">
            <DashboardIcon name="wallet" />
          </span>
          <div>
            <h2 className="text-xs font-bold text-[#12141c]">Reseller earnings and payouts</h2>
            <p className="mt-1 max-w-2xl text-[10px] leading-4 text-[#5c5f6b]">
              Order markups, commissions and payouts will be added after Hollyway&apos;s order,
              payment and wallet workflows are connected. No earnings are estimated from
              registrations.
            </p>
          </div>
        </div>
        <Link
          className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg border border-[#e4e2da] px-3 text-[10px] font-bold text-[#14213d] hover:border-[#14213d]"
          href="/dashboard/wallet"
        >
          Open wallet <Arrow />
        </Link>
      </section>
    </div>
  );
}
