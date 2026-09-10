import DashboardIcon from "../../dashboard/components/DashboardIcon";

type ReferralCodeCardProps = {
  code: string;
  link: string;
  copied: boolean;
  onCopy: () => void;
  onShare: () => void;
};

export default function ReferralCodeCard({
  code,
  link,
  copied,
  onCopy,
  onShare,
}: ReferralCodeCardProps) {
  return (
    <section
      id="share"
      className="overflow-hidden rounded-xl bg-[#14213d] p-5 text-white shadow-[0_8px_24px_rgba(20,33,61,.12)] sm:p-6"
    >
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
        <div className="max-w-xl">
          <span className="text-[9px] font-bold uppercase tracking-[.16em] text-[#dd6b12]">
            YOUR HOLLYWAY CODE
          </span>
          <h2 className="mt-2 font-[Manrope] text-xl font-semibold tracking-[-.03em] sm:text-2xl">
            Invite people you trust.
          </h2>
          <p className="mt-2 text-xs leading-5 text-[#c9d0e2]">
            Share your link. When someone creates a new Hollyway account through it, the
            registration is recorded under your referral activity.
          </p>
        </div>
        <span
          className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white/10 text-[#dd6b12] [&>svg]:h-5 [&>svg]:w-5"
        >
          <DashboardIcon name="users" />
        </span>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-end">
        <div>
          <span className="block text-[9px] font-bold uppercase tracking-[.14em] text-[#9ea9bc]">
            REFERRAL PARTNER CODE
          </span>
          <strong className="mt-1 block font-[Manrope] text-2xl tracking-[.08em] text-white">
            {code || "—"}
          </strong>
        </div>
        <div className="min-w-0 rounded-lg border border-white/10 bg-white/[.06] px-3 py-2">
          <span className="block truncate text-[10px] text-[#c9d0e2]">
            {link || "Preparing your link…"}
          </span>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#dd6b12] px-3 text-[10px] font-bold text-white hover:bg-[#b8560d] disabled:cursor-not-allowed disabled:opacity-60"
          type="button"
          onClick={onCopy}
          disabled={!link}
        >
          {copied ? "Link copied" : "Copy referral link"}
        </button>
        <button
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/15 px-3 text-[10px] font-bold text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
          type="button"
          onClick={onShare}
          disabled={!link}
        >
          Share link
        </button>
      </div>
    </section>
  );
}
