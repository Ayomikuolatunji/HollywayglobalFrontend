import Link from "next/link";
import { Arrow } from "../../../components/ui/Arrow";
import DashboardIcon from "../../dashboard/components/DashboardIcon";
import DashboardPageHeader from "../../dashboard/components/DashboardPageHeader";

const steps = [
  ["Share", "Copy your HWP referral link and send it to someone who should use Hollyway."],
  ["Join", "They create a new Hollyway account through your link by email or Google."],
  ["Track", "The registration appears in your referral activity after the account is created."],
] as const;

export default function ReferralGuidePage() {
  return (
    <div className="w-full space-y-4 px-4 pb-16 pt-1 sm:px-6 lg:px-8">
      <DashboardPageHeader
        kicker="REFERRAL PARTNER"
        title="How referrals work"
        description="A simple, traceable way to invite new customers to Hollyway Global."
        action={
          <Link className="inline-flex h-9 items-center gap-2 text-xs font-bold text-[#1453bb] hover:underline" href="/dashboard/referrals">
            Back to referrals <Arrow />
          </Link>
        }
      />
      <section className="grid gap-3 md:grid-cols-3">
        {steps.map(([title, description], index) => (
          <article
            className="rounded-xl border border-[#e4e2da] bg-white p-5 shadow-[0_1px_2px_rgba(18,20,28,.03)]"
            key={title}
          >
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#edf4ff] text-[#1453bb] [&>svg]:h-4 [&>svg]:w-4">
              <DashboardIcon name={index === 0 ? "share" : index === 1 ? "users" : "check"} />
            </span>
            <span className="mt-5 block text-[9px] font-bold uppercase tracking-[.14em] text-[#dd6b12]">0{index + 1}</span>
            <h2 className="mt-2 font-[Manrope] text-lg font-semibold text-[#12141c]">{title}</h2>
            <p className="mt-2 text-xs leading-5 text-[#5c5f6b]">{description}</p>
          </article>
        ))}
      </section>
      <section className="rounded-xl border border-[#cfe0f7] bg-[#f4f8ff] p-5">
        <h2 className="text-sm font-bold text-[#14213d]">What is recorded?</h2>
        <p className="mt-2 max-w-3xl text-xs leading-5 text-[#31527f]">
          Hollyway records only the referral code used and the new account registration status. The
          referral activity page does not expose the other customer&apos;s email, phone number or
          identity information.
        </p>
        <Link
          className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg bg-[#1453bb] px-3 text-[10px] font-bold text-white"
          href="/dashboard/referrals"
        >
          View my referral link <Arrow />
        </Link>
      </section>
    </div>
  );
}
