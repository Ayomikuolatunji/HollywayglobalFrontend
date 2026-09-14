import Link from "next/link";
import { Arrow } from "../../../components/ui/Arrow";
import DashboardIcon from "../../dashboard/components/DashboardIcon";

const pathways = [
  {
    title: "Referral partner",
    description: "Invite new customers with your HWP link and track registrations attributed to you.",
    action: "View referral activity",
    href: "/dashboard/referrals",
    icon: "users",
  },
  {
    title: "Reseller workspace",
    description: "Prepare a customer order, add your reseller markup and keep it separate from referral activity.",
    action: "Open reseller workspace",
    href: "/dashboard/reseller",
    icon: "store",
  },
] as const;

export default function PartnershipPathways() {
  return (
    <section
      className="rounded-xl border border-[#e4e2da] bg-white p-4 shadow-[0_1px_2px_rgba(18,20,28,.03)] sm:p-5"
      aria-labelledby="partnership-pathways-title"
    >
      <div className="flex flex-col gap-1 border-b border-[#e4e2da] pb-3 sm:flex-row sm:items-end sm:justify-between sm:gap-3">
        <div>
          <span className="text-[9px] font-bold uppercase tracking-[.14em] text-[#9498a3]">
            PARTNERSHIP PATHWAYS
          </span>
          <h2
            className="mt-1 font-[Manrope] text-lg font-semibold text-[#12141c]"
            id="partnership-pathways-title"
          >
            Choose what you want to do
          </h2>
        </div>
        <p className="text-[10px] text-[#5c5f6b]">Referral activity and reseller orders are separate.</p>
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {pathways.map((pathway) => (
          <article
            className="flex items-start gap-3 rounded-lg border border-[#e4e2da] bg-[#f8f7f3] p-3"
            key={pathway.title}
          >
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white text-[#14213d] shadow-sm [&>svg]:h-4 [&>svg]:w-4">
              <DashboardIcon name={pathway.icon} />
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="text-xs font-semibold text-[#12141c]">{pathway.title}</h3>
              <p className="mt-1 text-[10px] leading-4 text-[#5c5f6b]">{pathway.description}</p>
              <Link
                className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-[#1453bb] hover:underline"
                href={pathway.href}
              >
                {pathway.action} <Arrow />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
