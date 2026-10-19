import Link from "next/link";
import { Arrow } from "../../../components/ui/Arrow";
import OrderCopyActions, {
  type OrderCopyDetails,
} from "../../commerce/components/OrderCopyActions";

export default function ResellerOrderReceipt({
  copy,
  onCreateAnother,
}: {
  copy: OrderCopyDetails;
  onCreateAnother: () => void;
}) {
  return (
    <div className="mx-auto max-w-[760px] p-5 sm:p-8">
      <section className="rounded-2xl border border-[#bfe5d0] bg-[#f5fcf7] p-8 text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#20bd61] text-xl font-extrabold text-white">
          ✓
        </span>
        <h2 className="mt-5 font-[Manrope] text-2xl font-extrabold tracking-[-.05em] text-[#0b1830]">
          Reseller order saved as Draft
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#53627a]">
          Your customer order and markup details are saved on Hollyway. Review status, payment and
          delivery are still controlled by the server workflow.
        </p>
        <OrderCopyActions copy={copy} />
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#1453bb] px-4 text-xs font-extrabold text-white"
            type="button"
            onClick={onCreateAnother}
          >
            Create another reseller order <Arrow />
          </button>
          <Link
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#cbd5e1] px-4 text-xs font-extrabold text-[#1453bb]"
            href="/dashboard/referrals"
          >
            Back to partnerships <Arrow />
          </Link>
        </div>
      </section>
    </div>
  );
}
