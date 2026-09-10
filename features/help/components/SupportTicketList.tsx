import type { HelpTicket } from "../data/helpApi";
import HelpIcon from "./HelpIcon";

const statusLabels: Record<HelpTicket["status"], string> = {
  open: "Open",
  in_progress: "In progress",
  resolved: "Resolved",
  closed: "Closed",
};

function formatDate(value?: string) {
  if (!value) return "Recently";
  const date = new Date(value);
  return Number.isNaN(date.valueOf())
    ? "Recently"
    : date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
}

export default function SupportTicketList({
  tickets,
  categoryLabels,
  loading,
  error,
}: {
  tickets: HelpTicket[];
  categoryLabels: Map<string, string>;
  loading: boolean;
  error: string;
}) {
  return (
    <section className="rounded-xl border border-[#e4e2da] bg-white p-5 shadow-[0_1px_2px_rgba(18,20,28,.03)]">
      <div className="flex items-start gap-3 border-b border-[#eef1f4] pb-4">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#edf4ff] text-[#1453bb] [&>svg]:h-4 [&>svg]:w-4">
          <HelpIcon name="ticket" />
        </span>
        <div>
          <h2 className="font-[Manrope] text-base font-semibold text-[#12141c]">
            Your support requests
          </h2>
          <p className="mt-1 text-xs leading-5 text-[#5c5f6b]">
            Track requests sent from your Hollyway account.
          </p>
        </div>
      </div>
      {loading ? (
        <p className="py-5 text-xs text-[#8995a8]">Loading your requests…</p>
      ) : error ? (
        <p className="py-5 text-xs leading-5 text-[#6b5a3d]" role="alert">
          {error}
        </p>
      ) : !tickets.length ? (
        <p className="py-5 text-xs leading-5 text-[#8995a8]">No support requests yet.</p>
      ) : (
        <div className="divide-y divide-[#eef1f4]">
          {tickets.map((ticket) => (
            <article className="py-4 first:pt-5 last:pb-0" key={ticket.reference}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[9px] font-bold uppercase tracking-[.1em] text-[#b8560d]">
                    {categoryLabels.get(ticket.category) || "Other"}
                  </span>
                  <h3 className="mt-1 text-sm font-semibold text-[#12141c]">
                    {ticket.subject}
                  </h3>
                </div>
                <span className="shrink-0 rounded-full bg-[#f3f4f7] px-2 py-1 text-[9px] font-bold text-[#53627a]">
                  {statusLabels[ticket.status] || "Open"}
                </span>
              </div>
              <p className="mt-2 text-[10px] text-[#8995a8]">
                {ticket.reference} · {formatDate(ticket.created_at)}
              </p>
              {ticket.support_response && (
                <div className="mt-3 rounded-lg bg-[#f8f7f3] p-3 text-xs leading-5 text-[#5c5f6b]">
                  <strong className="block text-[10px] uppercase tracking-[.08em] text-[#14213d]">
                    Hollyway response
                  </strong>
                  {ticket.support_response}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
