import DashboardIcon from "../../dashboard/components/DashboardIcon";
import type { ReferralActivity as ReferralActivityRecord } from "../data/referralsApi";

function joinedDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return new Intl.DateTimeFormat("en-NG", { dateStyle: "medium" }).format(date);
}

export default function ReferralActivity({ records }: { records: ReferralActivityRecord[] }) {
  return (
    <section
      className="rounded-xl border border-[#e4e2da] bg-white p-4 shadow-[0_1px_2px_rgba(18,20,28,.03)] sm:p-5"
    >
      <div className="flex items-end justify-between gap-3 border-b border-[#e4e2da] pb-3">
        <div>
          <span className="text-[9px] font-bold uppercase tracking-[.14em] text-[#9498a3]">
            REFERRAL ACTIVITY
          </span>
          <h2 className="mt-1 font-[Manrope] text-lg font-semibold text-[#12141c]">
            Registrations from your link
          </h2>
        </div>
        <span className="text-[10px] text-[#9498a3]">
          {records.length ? `${records.length} shown` : "No records"}
        </span>
      </div>
      {records.length ? (
        <div className="divide-y divide-[#e4e2da]">
          {records.map((record) => (
            <div
              className="grid gap-3 py-3 sm:grid-cols-[1fr_auto_auto] sm:items-center"
              key={record.id}
            >
              <div className="flex items-center gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#edf4ff] text-[#1453bb] [&>svg]:h-4 [&>svg]:w-4">
                  <DashboardIcon name="users" />
                </span>
                <span>
                  <strong className="block text-xs font-semibold text-[#12141c]">
                    Referred registration
                  </strong>
                  <span className="mt-0.5 block text-[10px] text-[#9498a3]">
                    Referral record #{String(record.id).padStart(6, "0")}
                  </span>
                </span>
              </div>
              <span className="text-[10px] text-[#5c5f6b]">
                {joinedDate(record.joined_at)}
              </span>
              <span
                className="justify-self-start rounded-full bg-[#e3f7e9] px-2 py-1 text-[9px] font-bold text-[#168046] sm:justify-self-end"
              >
                {record.status === "active" ? "Active" : "Registered"}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex min-h-32 items-center gap-3 rounded-lg bg-[#f8f7f3] p-4">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-[#14213d] [&>svg]:h-4 [&>svg]:w-4">
            <DashboardIcon name="users" />
          </span>
          <div>
            <strong className="block text-xs text-[#12141c]">No registrations yet</strong>
            <p className="mt-1 max-w-lg text-[10px] leading-4 text-[#5c5f6b]">
              Copy your referral link and share it with someone who should join Hollyway.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
