"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Arrow } from "../../../components/ui/Arrow";
import DashboardIcon from "../components/DashboardIcon";
import DashboardPageHeader from "../components/DashboardPageHeader";
import ProfileBusinessAccountCard from "../components/ProfileBusinessAccountCard";
import ProfilePhotoEditor from "../components/ProfilePhotoEditor";
import { useDashboard } from "../components/DashboardShell";
import { fetchBusinessUpgrade, type BusinessUpgrade } from "../data/accountApi";
import { businessStatusLabel } from "../data/businessUpgrade";
import { fetchKycStatus, type KycServerSubmission } from "../data/kycApi";
import {
  getKycStorageKey,
  hasKycSubmission,
  isKycComplete,
  kycStatusAction,
  kycStatusDescription,
  kycStatusLabel,
  readKycLocalState,
  resolveKycStatus,
  type KycDraft,
  type KycStatus,
} from "../data/kyc";

function formatDate(value?: string) {
  if (!value) return "Not provided";
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  return match ? `${match[3]}/${match[2]}/${match[1]}` : value;
}

function requestErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && /failed to fetch/i.test(error.message)) return fallback;
  return error instanceof Error ? error.message : fallback;
}

function ProfileValue({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-extrabold tracking-[.12em] text-[#8b97a9] dark:text-[#8190a8]">
        {label}
      </dt>
      <dd className="mt-1 break-words text-xs font-semibold text-[#31425e] dark:text-[#d6deeb]">
        {value}
      </dd>
    </div>
  );
}

export default function ProfilePage() {
  const { accountEmail, accountPhotoUrl } = useDashboard();
  const storageKey = getKycStorageKey(accountEmail);
  const [kycStatus, setKycStatus] = useState<KycStatus>("not-started");
  const [kycSubmission, setKycSubmission] = useState<KycServerSubmission | null>(null);
  const [kycDraft, setKycDraft] = useState<KycDraft>(readKycLocalState().draft);
  const [businessUpgrade, setBusinessUpgrade] = useState<BusinessUpgrade | null>(null);
  const [loading, setLoading] = useState(true);
  const [businessLoading, setBusinessLoading] = useState(true);
  const [statusError, setStatusError] = useState("");
  const [businessError, setBusinessError] = useState("");

  const loadKyc = useCallback(async () => {
    if (!accountEmail) return;
    const local = readKycLocalState(storageKey);
    setKycDraft(local.draft);
    setKycStatus(local.status);
    setStatusError("");
    setLoading(true);
    try {
      const remote = await fetchKycStatus();
      setKycSubmission(remote.status === "not_submitted" ? null : remote);
      setKycStatus(resolveKycStatus(remote.status, local.status));
    } catch (requestError) {
      setStatusError(requestErrorMessage(requestError, "Verification status is unavailable."));
    } finally {
      setLoading(false);
    }
  }, [accountEmail, storageKey]);

  const loadBusiness = useCallback(async () => {
    if (!accountEmail) return;
    setBusinessLoading(true);
    setBusinessError("");
    try {
      const remote = await fetchBusinessUpgrade();
      setBusinessUpgrade(remote.status === "not_submitted" ? null : remote);
    } catch (requestError) {
      setBusinessError(requestErrorMessage(requestError, "Business account status is unavailable."));
    } finally {
      setBusinessLoading(false);
    }
  }, [accountEmail]);

  useEffect(() => {
    void loadKyc();
  }, [loadKyc]);

  useEffect(() => {
    void loadBusiness();
  }, [loadBusiness]);

  const complete = isKycComplete(kycStatus);
  const rejected = kycStatus === "rejected";
  const submitted = hasKycSubmission(kycStatus);
  const statusTitle = kycStatusLabel(kycStatus);
  const statusAction = kycStatusAction(kycStatus);
  const unavailableIdentityDetail = rejected
    ? "Unavailable — verification unsuccessful"
    : "Not provided until KYC is verified";
  const identityName = kycSubmission?.legal_full_name || unavailableIdentityDetail;
  const displayName = kycSubmission?.legal_full_name?.trim() || "Hollyway user";
  const identityPhone = kycSubmission?.phone_e164 || unavailableIdentityDetail;
  const identityAddress =
    [kycDraft.address, kycDraft.city, kycDraft.state].filter(Boolean).join(", ") ||
    "Not provided";
  const statusStyles = complete
    ? {
        card: "border-[#bfe5d0] bg-[#f5fcf7] dark:border-[#315c4a] dark:bg-[#142b25]",
        icon: "bg-[#e3f7e9] text-[#168046] dark:bg-[#19372a] dark:text-[#9be1b9]",
        text: "text-[#168046] dark:text-[#9be1b9]",
        body: "text-[#53627a] dark:text-[#b7c3d6]",
      }
    : rejected
      ? {
          card: "border-[#f3caca] bg-[#fff5f5] dark:border-[#6f3a46] dark:bg-[#2a1723]",
          icon: "bg-[#fde4e4] text-[#a32929] dark:bg-[#4b2632] dark:text-[#ffb9bd]",
          text: "text-[#a32929] dark:text-[#ffb9bd]",
          body: "text-[#8d2c2c] dark:text-[#ffb9bd]",
        }
      : {
          card: "border-[#f1d8a9] bg-[#fffaf1] dark:border-[#604a29] dark:bg-[#2a2115]",
          icon: "bg-[#ffefd0] text-[#b45309] dark:bg-[#4a3420] dark:text-[#e2c38e]",
          text: "text-[#b45309] dark:text-[#e2c38e]",
          body: "text-[#6b5a3d] dark:text-[#e2c38e]",
        };
  return (
    <div className="mx-auto w-full max-w-[1080px] space-y-3 p-4 sm:p-5 lg:p-6">
      <DashboardPageHeader
        kicker="ACCOUNT"
        title="Profile & KYC"
        description="Manage identity details and business access."
        compact
        action={
          <Link
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#1453bb] px-3 text-[11px] font-extrabold text-white hover:bg-[#0b3f91]"
            href="/dashboard/profile/kyc"
          >
            {statusAction} <Arrow />
          </Link>
        }
      />

      {statusError && (
        <div
          className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[#f1d8a9] bg-[#fffaf1] px-3 py-2 text-[11px] leading-4 text-[#6b5a3d] dark:border-[#604a29] dark:bg-[#2a2115] dark:text-[#e2c38e]"
          role="alert"
        >
          <span>{statusError}</span>
          <button
            className="font-extrabold text-[#b8560d] hover:underline dark:text-[#f1b578]"
            type="button"
            onClick={() => void loadKyc()}
          >
            Retry
          </button>
        </div>
      )}
      {businessError && (
        <div
          className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[#f1d8a9] bg-[#fffaf1] px-3 py-2 text-[11px] leading-4 text-[#6b5a3d] dark:border-[#604a29] dark:bg-[#2a2115] dark:text-[#e2c38e]"
          role="alert"
        >
          <span>{businessError}</span>
          <button
            className="font-extrabold text-[#b8560d] hover:underline dark:text-[#f1b578]"
            type="button"
            onClick={() => void loadBusiness()}
          >
            Retry
          </button>
        </div>
      )}

      <section className="grid gap-3 lg:grid-cols-[1.1fr_.9fr]">
        <article className="rounded-xl border border-[#dfe4ed] bg-white p-4 shadow-sm dark:border-[#2a374e] dark:bg-[#121d30]">
          <ProfilePhotoEditor
            accountName={displayName}
            accountPhotoUrl={accountPhotoUrl}
          />
          <dl className="mt-4 grid gap-3 border-t border-[#eef1f4] pt-4 dark:border-[#2a374e] sm:grid-cols-2">
            <ProfileValue label="ACCOUNT NAME" value={displayName} />
            <ProfileValue label="EMAIL ADDRESS" value={accountEmail || "Not provided"} />
            <ProfileValue
              label="ACCOUNT TYPE"
              value={businessStatusLabel(businessUpgrade?.account_status || "individual")}
            />
            <ProfileValue label="KYC STATUS" value={statusTitle} />
          </dl>
        </article>

        <article className={`rounded-xl border p-4 shadow-sm ${statusStyles.card}`}>
          <span
            className={`grid h-9 w-9 place-items-center rounded-lg [&>svg]:h-4 [&>svg]:w-4 ${statusStyles.icon}`}
          >
            <DashboardIcon name="shield" />
          </span>
          <span className={`mt-3 block text-[9px] font-extrabold tracking-[.15em] ${statusStyles.text}`}>
            VERIFICATION · {statusTitle.toUpperCase()}
          </span>
          <h3 className="mt-1 font-[Manrope] text-base font-extrabold tracking-[-.04em] text-[#0b1830] dark:text-[#f4f7fb]">
            {statusTitle}
          </h3>
          <p className={`mt-1 text-[11px] leading-4 ${statusStyles.body}`}>
            {kycStatusDescription(kycStatus)}
          </p>
          <Link
            className={`mt-4 inline-flex items-center gap-2 text-[11px] font-extrabold hover:underline ${statusStyles.text}`}
            href="/dashboard/profile/kyc"
          >
            {submitted ? "View verification" : statusAction} <Arrow />
          </Link>
        </article>
      </section>

      <section className="rounded-xl border border-[#dfe4ed] bg-white p-4 shadow-sm dark:border-[#2a374e] dark:bg-[#121d30]">
        <div className="flex flex-col justify-between gap-3 border-b border-[#eef1f4] pb-3 dark:border-[#2a374e] sm:flex-row sm:items-center">
          <div>
            <span className="text-[9px] font-extrabold tracking-[.15em] text-[#1453bb] dark:text-[#8bb8ff]">
              IDENTITY DETAILS
            </span>
            <h3 className="mt-1 font-[Manrope] text-base font-extrabold tracking-[-.04em] text-[#0b1830] dark:text-[#f4f7fb]">
              Details used for verification
            </h3>
            <p className="mt-1 max-w-2xl text-[11px] leading-4 text-[#53627a] dark:text-[#b7c3d6]">
              Verified identity details returned by KYC.
            </p>
          </div>
          <Link
            className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg border border-[#1453bb] px-3 text-[11px] font-extrabold text-[#1453bb] hover:bg-[#f4f8ff] dark:border-[#8bb8ff] dark:text-[#8bb8ff] dark:hover:bg-[#202d44]"
            href="/dashboard/profile/kyc"
          >
            {rejected ? "Correct details" : submitted ? "Review details" : "Edit details"} <Arrow />
          </Link>
        </div>
        {loading ? (
          <p className="py-6 text-xs text-[#687895] dark:text-[#9eabc0]">Loading your verification details…</p>
        ) : (
          <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <ProfileValue label="LEGAL FULL NAME" value={identityName} />
            <ProfileValue
              label="DATE OF BIRTH"
              value={formatDate(kycSubmission?.date_of_birth)}
            />
            <ProfileValue label="REACHABLE PHONE" value={identityPhone} />
            <ProfileValue
              label="IDENTITY RECORD"
              value={kycSubmission?.identity_type || kycDraft.identityType || "Not provided"}
            />
            <ProfileValue label="ADDRESS" value={identityAddress} />
          </dl>
        )}
        <p className="mt-4 rounded-lg border border-[#cfe0f7] bg-[#f4f8ff] p-2.5 text-[10px] leading-4 text-[#53627a] dark:border-[#334b72] dark:bg-[#14243d] dark:text-[#b7c3d6]">
          Full NIN or BVN numbers are never displayed or saved in browser storage.
        </p>
      </section>

      <ProfileBusinessAccountCard upgrade={businessUpgrade} loading={businessLoading} />
    </div>
  );
}
