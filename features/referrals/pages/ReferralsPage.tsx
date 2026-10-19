"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Arrow } from "../../../components/ui/Arrow";
import DashboardPageHeader from "../../dashboard/components/DashboardPageHeader";
import DashboardSummaryCard from "../../dashboard/components/DashboardSummaryCard";
import PartnershipPathways from "../components/PartnershipPathways";
import ReferralActivity from "../components/ReferralActivity";
import ReferralCodeCard from "../components/ReferralCodeCard";
import { fetchReferralSummary, type ReferralSummary } from "../data/referralsApi";
import { fetchReferralEarnings, type ReferralEarningsPage } from "../data/earningsApi";

function emptySummary(): ReferralSummary {
  return {
    referral_code: "",
    referral_link: "",
    total_referrals: 0,
    registered_referrals: 0,
    successful_transactions: 0,
    loyalty_discount_percentage: 0,
    trust_badge: null,
    referrals: [],
  };
}

export default function ReferralsPage() {
  const [summary, setSummary] = useState<ReferralSummary>(emptySummary);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [earnings, setEarnings] = useState<ReferralEarningsPage | null>(null);

  async function load(signal?: AbortSignal) {
    setError("");
    try {
      const [nextSummary, nextEarnings] = await Promise.all([fetchReferralSummary(signal), fetchReferralEarnings(signal)]);
      setSummary(nextSummary);
      setEarnings(nextEarnings);
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
        kicker="PARTNERSHIPS"
        title="Referrals & reseller"
        description="Invite customers or prepare reseller orders. Wallet & payouts is a separate finance area."
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
      <PartnershipPathways />
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
      <section className="grid gap-2 sm:grid-cols-3" aria-label="Loyalty status">
        <RewardCard label="SUCCESSFUL ESCROWS" value={loading ? "—" : String(summary.successful_transactions)} detail="Released transactions counted by Hollyway" />
        <RewardCard label="LOYALTY DISCOUNT" value={loading ? "—" : `${summary.loyalty_discount_percentage}%`} detail="Applied to a new escrow fee when eligible" />
        <RewardCard label="TRUST BADGE" value={loading ? "—" : summary.trust_badge || "Not yet"} detail="Earned after five successful escrow releases" />
      </section>
      <ReferralCodeCard
        code={summary.referral_code}
        link={summary.referral_link}
        copied={copied}
        onCopy={() => void copyLink()}
        onShare={() => void shareLink()}
      />
      <ReferralActivity records={summary.referrals} />
      <ReferralEarnings earnings={earnings} loading={loading} />
    </div>
  );
}

function RewardCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <article className="rounded-xl border border-[#e4e2da] bg-white p-3 shadow-[0_1px_2px_rgba(18,20,28,.03)]"><span className="block text-[9px] font-bold tracking-[.12em] text-[#9498a3]">{label}</span><strong className="mt-2 block truncate font-[Manrope] text-base font-extrabold text-[#12141c]">{value}</strong><span className="mt-1 block text-[10px] leading-4 text-[#5c5f6b]">{detail}</span></article>;
}

function ReferralEarnings({ earnings, loading }: { earnings: ReferralEarningsPage | null; loading: boolean }) {
  return <section className="rounded-xl border border-[#e4e2da] bg-white p-4 shadow-[0_1px_2px_rgba(18,20,28,.03)] sm:p-5"><div className="flex flex-wrap items-end justify-between gap-2"><div><span className="text-[9px] font-bold uppercase tracking-[.14em] text-[#9498a3]">PARTNER EARNINGS</span><h2 className="mt-1 font-[Manrope] text-lg font-semibold text-[#12141c]">Confirmed earnings</h2></div><strong className="text-lg font-extrabold text-[#168046]">{loading ? "—" : `₦${((earnings?.total_earned_minor || 0) / 100).toLocaleString("en-NG")}`}</strong></div>{earnings?.items.length ? <div className="mt-3 divide-y divide-[#eef1f4]">{earnings.items.map((item) => <div className="flex flex-wrap items-center justify-between gap-2 py-3 text-xs" key={item.id}><span className="min-w-0"><strong className="block text-[#12141c]">{item.description}</strong><small className="mt-1 block text-[#8995a8]">{new Date(item.created_at).toLocaleDateString("en-NG")} · {item.status}</small></span><strong className="text-[#168046]">₦{(item.amount_minor / 100).toLocaleString("en-NG")}</strong></div>)}</div> : <p className="mt-3 text-xs leading-5 text-[#5c5f6b]">No confirmed partner earnings yet. Earnings appear here after the qualifying customer payment is confirmed.</p>}</section>;
}
