"use client";

import Link from "next/link";
import { Arrow } from "../../../components/ui/Arrow";
import DashboardIcon from "./DashboardIcon";
import type { BusinessUpgrade } from "../data/accountApi";
import {
  businessStatusDescription,
  businessStatusLabel,
} from "../data/businessUpgrade";

type ProfileBusinessAccountCardProps = {
  upgrade: BusinessUpgrade | null;
  loading: boolean;
};

function businessAction(status: string) {
  if (status === "verified_business") return "View business account";
  if (status === "verification_pending" || status === "additional_review") {
    return "View application";
  }
  if (status === "rejected") return "Correct application";
  if (status === "business_unverified") return "Continue upgrade";
  return "Start business upgrade";
}

function businessTitle(status: string) {
  if (status === "verified_business") return "Business account verified";
  if (status === "verification_pending") return "Business upgrade is under review";
  if (status === "additional_review") return "Business upgrade needs review";
  if (status === "rejected") return "Business upgrade needs corrections";
  return "Upgrade to a business account";
}

export default function ProfileBusinessAccountCard({
  upgrade,
  loading,
}: ProfileBusinessAccountCardProps) {
  const status = upgrade?.account_status || "individual";

  return (
    <section className="rounded-xl border border-[#cfe0f7] bg-[#f4f8ff] p-4 dark:border-[#334b72] dark:bg-[#14243d]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#dceaff] text-[#1453bb] dark:bg-[#202d44] dark:text-[#8bb8ff] [&>svg]:h-4 [&>svg]:w-4">
          <DashboardIcon name="store" />
        </span>
        <div className="flex-1">
          <span className="text-[9px] font-extrabold tracking-[.15em] text-[#1453bb] dark:text-[#8bb8ff]">
            BUSINESS ACCOUNT
          </span>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <h3 className="font-[Manrope] text-base font-extrabold tracking-[-.04em] text-[#0b1830] dark:text-[#f4f7fb]">
              {businessTitle(status)}
            </h3>
            {!loading && (
              <span className="rounded-full bg-white px-2 py-1 text-[9px] font-extrabold text-[#1453bb] dark:bg-[#202d44] dark:text-[#8bb8ff]">
                {businessStatusLabel(status)}
              </span>
            )}
          </div>
          <p className="mt-1 max-w-2xl text-[11px] leading-4 text-[#53627a] dark:text-[#b7c3d6]">
            {loading
              ? "Loading business account status…"
              : businessStatusDescription(status)}
          </p>
        </div>
        <Link
          className="inline-flex items-center gap-2 rounded-lg border border-[#1453bb] px-3 py-2 text-[11px] font-extrabold text-[#1453bb] hover:bg-white dark:border-[#8bb8ff] dark:text-[#8bb8ff] dark:hover:bg-[#202d44]"
          href="/dashboard/profile/business-upgrade"
        >
          {businessAction(status)} <Arrow />
        </Link>
      </div>
    </section>
  );
}
