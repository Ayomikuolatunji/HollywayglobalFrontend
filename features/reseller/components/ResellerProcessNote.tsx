import Link from "next/link";
import { Arrow } from "../../../components/ui/Arrow";
import DashboardIcon from "../../dashboard/components/DashboardIcon";

export default function ResellerProcessNote() {
  return (
    <section className="rounded-xl border border-[#cfe0f7] bg-[#f4f8ff] p-4">
      <div className="flex items-start gap-3">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white text-[#1453bb] [&>svg]:h-4 [&>svg]:w-4">
          <DashboardIcon name="store" />
        </span>
        <div className="min-w-0">
          <h2 className="text-xs font-bold text-[#14213d]">How reseller orders work</h2>
          <p className="mt-1 text-[10px] leading-4 text-[#31527f]">
            Use a published listing code, enter the customer details and add your approved markup.
            Hollyway confirms the final order, fees, payment and delivery before anything is paid.
          </p>
          <p className="mt-2 text-[10px] font-semibold leading-4 text-[#31527f]">
            This page does not open or fund Wallet &amp; payouts. Wallet funding and payouts stay
            in Finance.
          </p>
          <Link
            className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-[#1453bb] hover:underline"
            href="/dashboard/marketplace"
          >
            Browse published listings <Arrow />
          </Link>
        </div>
      </div>
    </section>
  );
}
