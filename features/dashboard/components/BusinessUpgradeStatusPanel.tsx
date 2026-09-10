"use client";

import DashboardIcon from "./DashboardIcon";
import type { BusinessUpgrade } from "../data/accountApi";
import {
  businessStatusDescription,
  businessStatusLabel,
} from "../data/businessUpgrade";

type BusinessUpgradeStatusPanelProps = {
  upgrade: BusinessUpgrade;
};

function formatDate(value?: string) {
  if (!value) return "Not available";
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  return match ? `${match[3]}/${match[2]}/${match[1]}` : value;
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-extrabold tracking-[.12em] text-[#8b97a9] dark:text-[#8190a8]">
        {label}
      </dt>
      <dd className="mt-1 break-words text-xs font-semibold text-[#31425e] dark:text-[#d6deeb]">
        {value || "Not provided"}
      </dd>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const approved = status === "verified_business";
  const rejected = status === "rejected";
  const classes = approved
    ? "bg-[#e3f7e9] text-[#168046]"
    : rejected
      ? "bg-[#fde4e4] text-[#a32929]"
      : "bg-[#fff0d5] text-[#9a5a00]";
  return (
    <span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold ${classes}`}>
      {businessStatusLabel(status)}
    </span>
  );
}

function documentLabel(kind: string) {
  return kind === "certificate_of_incorporation"
    ? "Certificate of Incorporation"
    : "Director identification";
}

export default function BusinessUpgradeStatusPanel({
  upgrade,
}: BusinessUpgradeStatusPanelProps) {
  const settlementAccount = upgrade.settlement_account_last4
    ? `•••• ${upgrade.settlement_account_last4}`
    : "Not provided";

  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-[#cfe0f7] bg-[#f4f8ff] p-5 dark:border-[#334b72] dark:bg-[#14243d] sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white text-[#1453bb] shadow-sm dark:bg-[#202d44] dark:text-[#8bb8ff] [&>svg]:h-5 [&>svg]:w-5">
              <DashboardIcon name="shield" />
            </span>
            <div>
              <span className="text-[10px] font-extrabold tracking-[.15em] text-[#1453bb] dark:text-[#8bb8ff]">
                BUSINESS ACCOUNT
              </span>
              <h2 className="mt-1 font-[Manrope] text-xl font-extrabold tracking-[-.04em] text-[#0b1830] dark:text-[#f4f7fb]">
                {upgrade.status === "verified_business"
                  ? "Business account verified"
                  : "Business upgrade submitted"}
              </h2>
            </div>
          </div>
          <StatusBadge status={upgrade.status} />
        </div>
        <p className="mt-4 max-w-2xl text-xs leading-5 text-[#53627a] dark:text-[#b7c3d6]">
          {upgrade.status === "rejected" && upgrade.rejection_reason
            ? upgrade.rejection_reason
            : businessStatusDescription(upgrade.status)}
        </p>
      </section>

      <section className="rounded-xl border border-[#dfe4ed] bg-white p-5 shadow-sm dark:border-[#2a374e] dark:bg-[#121d30] sm:p-6">
        <div className="flex items-start justify-between gap-3 border-b border-[#eef1f4] pb-4 dark:border-[#2a374e]">
          <div>
            <span className="text-[10px] font-extrabold tracking-[.15em] text-[#b8560d]">
              APPLICATION RECORD
            </span>
            <h2 className="mt-1 font-[Manrope] text-lg font-extrabold text-[#0b1830] dark:text-[#f4f7fb]">
              {upgrade.company_name || "Business details"}
            </h2>
          </div>
          <span className="text-right text-[10px] leading-4 text-[#8995a8] dark:text-[#8190a8]">
            Updated
            <br />
            {formatDate(upgrade.updated_at)}
          </span>
        </div>
        <dl className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Detail label="CAC RC OR BN" value={upgrade.registration_number || "Not provided"} />
          <Detail label="COMPANY EMAIL" value={upgrade.company_email || "Not provided"} />
          <Detail label="COMPANY PHONE" value={upgrade.company_phone_e164 || "Not provided"} />
          <Detail label="YOUR POSITION" value={upgrade.position || "Not provided"} />
          <Detail
            label="BUSINESS ADDRESS"
            value={[
              upgrade.address_street,
              upgrade.address_city,
              upgrade.address_state,
            ]
              .filter(Boolean)
              .join(", ")}
          />
          <Detail
            label="SETTLEMENT ACCOUNT"
            value={`${upgrade.settlement_bank_name || "Bank not provided"} · ${settlementAccount}`}
          />
          <Detail label="SUBMITTED" value={formatDate(upgrade.submitted_at)} />
          <Detail label="ACCOUNT STATUS" value={businessStatusLabel(upgrade.account_status)} />
        </dl>
      </section>

      <section className="rounded-xl border border-[#dfe4ed] bg-white p-5 shadow-sm dark:border-[#2a374e] dark:bg-[#121d30] sm:p-6">
        <span className="text-[10px] font-extrabold tracking-[.15em] text-[#b8560d]">
          DOCUMENTS
        </span>
        <div className="mt-4 divide-y divide-[#eef1f4] dark:divide-[#2a374e]">
          {upgrade.documents?.length ? (
            upgrade.documents.map((document) => (
              <div className="flex items-center gap-3 py-3 first:pt-0 last:pb-0" key={document.kind}>
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#f5f4f0] text-[#53627a] dark:bg-[#202d44] dark:text-[#b7c3d6] [&>svg]:h-4 [&>svg]:w-4">
                  <DashboardIcon name="box" />
                </span>
                <div className="min-w-0">
                  <strong className="block text-xs font-bold text-[#31425e] dark:text-[#d6deeb]">
                    {documentLabel(document.kind)}
                  </strong>
                  <span className="mt-0.5 block truncate text-[10px] text-[#8995a8] dark:text-[#8190a8]">
                    {document.name}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-[#8995a8] dark:text-[#8190a8]">
              No document metadata is available.
            </p>
          )}
        </div>
        <p className="mt-5 rounded-lg border border-[#f1d8a9] bg-[#fffaf1] p-3 text-[10px] leading-5 text-[#6b5a3d] dark:border-[#604a29] dark:bg-[#2a2115] dark:text-[#e2c38e]">
          Documents and settlement details are private to the Hollyway account
          and available to Admin for verification. Account numbers are shown
          only in masked form here.
        </p>
      </section>
    </div>
  );
}
