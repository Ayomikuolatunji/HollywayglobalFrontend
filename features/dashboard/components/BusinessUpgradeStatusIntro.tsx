"use client";

import {
  businessStatusDescription,
  businessStatusLabel,
} from "../data/businessUpgrade";

type BusinessUpgradeStatusIntroProps = {
  accountStatus: string;
  rejected: boolean;
  rejectionReason?: string | null;
};

function statusTone(status: string) {
  return status === "verified_business"
    ? "border-[#bfe5d0] bg-[#f5fcf7] text-[#168046]"
    : "border-[#f1d8a9] bg-[#fffaf1] text-[#9a5a00]";
}

export default function BusinessUpgradeStatusIntro({
  accountStatus,
  rejected,
  rejectionReason,
}: BusinessUpgradeStatusIntroProps) {
  return (
    <>
      <section className="flex flex-col gap-4 rounded-xl border border-[#cfe0f7] bg-[#f4f8ff] p-5 dark:border-[#334b72] dark:bg-[#14243d] sm:flex-row sm:items-start sm:justify-between sm:p-6">
        <div>
          <span className="text-[10px] font-extrabold tracking-[.15em] text-[#1453bb] dark:text-[#8bb8ff]">
            ACCOUNT PATH
          </span>
          <h2 className="mt-2 font-[Manrope] text-lg font-extrabold tracking-[-.03em] text-[#0b1830] dark:text-[#f4f7fb]">
            Individual → Business Unverified → Verification Pending → Verified Business
          </h2>
          <p className="mt-2 max-w-3xl text-xs leading-5 text-[#53627a] dark:text-[#b7c3d6]">
            {businessStatusDescription(
              accountStatus === "individual" ? "not_submitted" : accountStatus,
            )}
          </p>
        </div>
        <span
          className={`w-fit shrink-0 rounded-full border px-3 py-1.5 text-[10px] font-extrabold ${statusTone(
            accountStatus,
          )}`}
        >
          {businessStatusLabel(accountStatus)}
        </span>
      </section>

      {rejected && (
        <section className="rounded-xl border border-[#f3caca] bg-[#fff5f5] p-5 dark:border-[#6f3a46] dark:bg-[#2a1723]">
          <span className="text-[10px] font-extrabold tracking-[.15em] text-[#a32929] dark:text-[#ffb9bd]">
            ADMIN REVIEW
          </span>
          <h2 className="mt-1 font-[Manrope] text-lg font-extrabold text-[#7e2020] dark:text-[#ffd5d5]">
            Corrections are needed before approval
          </h2>
          <p className="mt-2 text-xs leading-5 text-[#8d2c2c] dark:text-[#ffb9bd]">
            {rejectionReason ||
              "Review the details and documents below, then submit the corrected application."}
          </p>
        </section>
      )}
    </>
  );
}
