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

function ProfileValue({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-extrabold tracking-[.12em] text-[#8b97a9] dark:text-[#8190a8]">
        {label}
      </dt>
      <dd className="mt-1 break-words text-sm font-semibold text-[#31425e] dark:text-[#d6deeb]">
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
      setStatusError(
        requestError instanceof Error
          ? requestError.message
          : "KYC status could not be loaded.",
      );
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
      setBusinessError(
        requestError instanceof Error
          ? requestError.message
          : "Business account status could not be loaded.",
      );
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
  const identityName =
    kycSubmission?.legal_full_name || "Not provided until KYC is verified";
  const identityPhone = kycSubmission?.phone_e164 || "Not returned by KYC yet";
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
    <div className="mx-auto w-full max-w-[1180px] space-y-6 p-5 sm:p-8">
      <DashboardPageHeader
        kicker="ACCOUNT"
        title="Profile & KYC"
        description="Review your account details, verification status and business account pathway."
        action={
          <Link
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#1453bb] px-4 text-xs font-extrabold text-white hover:bg-[#0b3f91]"
            href="/dashboard/profile/kyc"
          >
            {statusAction} <Arrow />
          </Link>
        }
      />

      {statusError && (
        <div
          className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#f1d8a9] bg-[#fffaf1] px-4 py-3 text-xs leading-5 text-[#6b5a3d] dark:border-[#604a29] dark:bg-[#2a2115] dark:text-[#e2c38e]"
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
          className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#f1d8a9] bg-[#fffaf1] px-4 py-3 text-xs leading-5 text-[#6b5a3d] dark:border-[#604a29] dark:bg-[#2a2115] dark:text-[#e2c38e]"
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

      <section className="grid gap-6 lg:grid-cols-[1fr_.85fr]">
        <article className="rounded-xl border border-[#dfe4ed] bg-white p-6 shadow-sm dark:border-[#2a374e] dark:bg-[#121d30]">
          <ProfilePhotoEditor
            accountName={identityName}
            accountPhotoUrl={accountPhotoUrl}
          />
          <div className="pt-5">
              <h3 className="font-[Manrope] text-lg font-extrabold text-[#0b1830] dark:text-[#f4f7fb]">
                {identityName}
              </h3>
              <p className="mt-1 text-xs text-[#8490a4] dark:text-[#8190a8]">KYC identity name</p>
          </div>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            <ProfileValue label="ACCOUNT NAME" value={identityName} />
            <ProfileValue label="EMAIL ADDRESS" value={accountEmail || "Not provided"} />
            <ProfileValue
              label="ACCOUNT TYPE"
              value={businessStatusLabel(businessUpgrade?.account_status || "individual")}
            />
            <ProfileValue label="KYC STATUS" value={statusTitle} />
          </dl>
          <p className="mt-6 rounded-lg bg-[#f8fafc] p-4 text-xs leading-5 text-[#53627a] dark:bg-[#18253a] dark:text-[#b7c3d6]">
            The account name shown here comes from your KYC identity result, not
            your social sign-in profile. Your email remains the sign-in address
            for this account.
          </p>
        </article>

        <article className={`rounded-xl border p-6 shadow-sm ${statusStyles.card}`}>
          <span
            className={`grid h-11 w-11 place-items-center rounded-xl [&>svg]:h-5 [&>svg]:w-5 ${statusStyles.icon}`}
          >
            <DashboardIcon name="shield" />
          </span>
          <span className={`mt-5 block text-[10px] font-extrabold tracking-[.15em] ${statusStyles.text}`}>
            VERIFICATION · {statusTitle.toUpperCase()}
          </span>
          <h3 className="mt-2 font-[Manrope] text-xl font-extrabold tracking-[-.04em] text-[#0b1830] dark:text-[#f4f7fb]">
            {statusTitle}
          </h3>
          <p className={`mt-2 text-xs leading-5 ${statusStyles.body}`}>
            {kycStatusDescription(kycStatus)}
          </p>
          <Link
            className={`mt-6 inline-flex items-center gap-2 text-xs font-extrabold hover:underline ${statusStyles.text}`}
            href="/dashboard/profile/kyc"
          >
            {submitted ? "View verification" : statusAction} <Arrow />
          </Link>
        </article>
      </section>

      <section className="rounded-xl border border-[#dfe4ed] bg-white p-6 shadow-sm dark:border-[#2a374e] dark:bg-[#121d30]">
        <div className="flex flex-col justify-between gap-4 border-b border-[#eef1f4] pb-5 dark:border-[#2a374e] sm:flex-row sm:items-start">
          <div>
            <span className="text-[10px] font-extrabold tracking-[.15em] text-[#1453bb] dark:text-[#8bb8ff]">
              IDENTITY DETAILS
            </span>
            <h3 className="mt-2 font-[Manrope] text-xl font-extrabold tracking-[-.04em] text-[#0b1830] dark:text-[#f4f7fb]">
              Details used for verification
            </h3>
            <p className="mt-2 max-w-2xl text-xs leading-5 text-[#53627a] dark:text-[#b7c3d6]">
              These details come from your KYC form. Correct them through the
              verification page before submitting.
            </p>
          </div>
          <Link
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg border border-[#1453bb] px-4 text-xs font-extrabold text-[#1453bb] hover:bg-[#f4f8ff] dark:border-[#8bb8ff] dark:text-[#8bb8ff] dark:hover:bg-[#202d44]"
            href="/dashboard/profile/kyc"
          >
            {rejected ? "Correct details" : submitted ? "Review details" : "Edit details"} <Arrow />
          </Link>
        </div>
        {loading ? (
          <p className="py-6 text-xs text-[#687895] dark:text-[#9eabc0]">Loading your verification details…</p>
        ) : (
          <dl className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
        <p className="mt-6 rounded-lg border border-[#cfe0f7] bg-[#f4f8ff] p-3 text-[10px] leading-5 text-[#53627a] dark:border-[#334b72] dark:bg-[#14243d] dark:text-[#b7c3d6]">
          For privacy, Hollyway shows only safe verification details here. Your
          full NIN or BVN is never displayed or saved in browser storage.
        </p>
      </section>

      <ProfileBusinessAccountCard upgrade={businessUpgrade} loading={businessLoading} />
    </div>
  );
}
