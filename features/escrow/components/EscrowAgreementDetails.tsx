import { formatMinorNaira, type EscrowRequest } from "../data/escrow";

function feeLabel(request: EscrowRequest) {
  if (request.escrow_fee_min_minor === null || request.escrow_fee_max_minor === null) return "To be confirmed";
  if (request.escrow_fee_min_minor === request.escrow_fee_max_minor) return formatMinorNaira(request.escrow_fee_min_minor);
  return `${formatMinorNaira(request.escrow_fee_min_minor)}–${formatMinorNaira(request.escrow_fee_max_minor)}`;
}

function roleLabel(role: string) {
  return role.replace("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function coverageLabel(value: string | null | undefined) {
  return value === "initiator" ? "Person who started the request" : value === "counterparty" ? "Other party" : value === "split" ? "Shared equally" : "To be agreed";
}

export default function EscrowAgreementDetails({ request }: { request: EscrowRequest }) {
  const parties = request.participants.filter((item) => item.role !== "funder");
  const funder = request.participants.find((item) => item.role === "funder");

  return (
    <div className="space-y-3">
      <section className="rounded-lg border border-[#dfe4ed] bg-white p-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="text-[9px] font-extrabold tracking-[.14em] text-[#1453bb]">AGREEMENT DETAILS</span>
            <h2 className="mt-1 font-[Manrope] text-lg font-extrabold tracking-[-.03em] text-[#0b1830]">
              {request.subject || "Untitled escrow agreement"}
            </h2>
            <p className="mt-1 text-[11px] text-[#687895]">{request.purpose_label} · {request.reference}</p>
          </div>
          <div className="rounded-lg bg-[#f4f8ff] px-3 py-2 text-right">
            <span className="block text-[9px] font-extrabold tracking-[.12em] text-[#687895]">PROTECTED VALUE</span>
            <strong className="mt-1 block font-[Manrope] text-base font-extrabold text-[#1453bb]">{formatMinorNaira(request.amount_minor)}</strong>
          </div>
        </div>
        <dl className="mt-4 grid gap-x-5 gap-y-3 border-t border-[#eef1f4] pt-4 text-xs sm:grid-cols-2">
          <Info label="Hollyway fee" value={feeLabel(request)} />
          <Info label="Fee paid by" value={coverageLabel(request.fee_coverage)} />
          <Info label="Delivery" value={request.delivery_required ? request.courier_method || "Method to be confirmed" : "Not included"} />
          {request.delivery_required && <Info label="Delivery fee paid by" value={coverageLabel(request.delivery_fee_coverage)} />}
          <Info label="Payment status" value={request.status_label} />
          {request.settlement_account && <Info label="Settlement account" value={`${request.settlement_account.bank_name} · •••• ${request.settlement_account.account_last4}`} />}
        </dl>
      </section>

      <section className="rounded-lg border border-[#dfe4ed] bg-white p-4">
        <h2 className="text-sm font-extrabold text-[#0b1830]">People involved</h2>
        <div className="mt-2 divide-y divide-[#eef1f4]">
          {parties.map((party) => (
            <div className="flex items-center justify-between gap-3 py-2 text-xs first:pt-0" key={party.id}>
              <span className="text-[#687895]">{roleLabel(party.role)}</span>
              <span className="text-right font-extrabold text-[#0b1830]">
                {party.name || party.email || "Hollyway user"}
                {party.name && <small className="block text-[10px] font-medium text-[#687895]">{party.email}</small>}
                {party.phone_e164 && <small className="block text-[10px] font-medium text-[#687895]">{party.phone_e164}</small>}
                {party.accepted_at && <small className="block text-[10px] font-medium text-[#8490a4]">Accepted</small>}
              </span>
            </div>
          ))}
        </div>
        {funder && <p className="mt-3 border-t border-[#eef1f4] pt-3 text-xs text-[#53627a]"><strong className="text-[#0b1830]">Funding party:</strong> {funder.name || funder.email || "Invited Hollyway account"}{funder.accepted_at ? " · Accepted" : " · Awaiting acceptance"}</p>}
      </section>

      <section className="rounded-lg border border-[#dfe4ed] bg-white p-4">
        <h2 className="text-sm font-extrabold text-[#0b1830]">Terms to review</h2>
        <p className="mt-2 whitespace-pre-wrap text-xs leading-5 text-[#53627a]">{request.description || "No description provided."}</p>
        <div className="mt-3 space-y-2 border-t border-[#eef1f4] pt-3 text-xs leading-5 text-[#53627a]">
          {request.item_condition && <p><strong className="text-[#0b1830]">Item condition:</strong> {request.item_condition}</p>}
          {request.inspection_terms && <p><strong className="text-[#0b1830]">Inspection:</strong> {request.inspection_terms}</p>}
          {request.scope && <p><strong className="text-[#0b1830]">Scope:</strong> {request.scope}</p>}
          {request.deliverables && <p><strong className="text-[#0b1830]">Deliverables:</strong> {request.deliverables}</p>}
          <p><strong className="text-[#0b1830]">Release conditions:</strong> {request.release_conditions || "To be confirmed."}</p>
          {request.delivery_address && <p><strong className="text-[#0b1830]">Delivery address:</strong> {request.delivery_address}</p>}
          {request.inspection && <p><strong className="text-[#0b1830]">Inspection status:</strong> {request.inspection.decision.replaceAll("_", " ")}{request.inspection.deadline_at ? ` · respond by ${new Date(request.inspection.deadline_at).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })}` : ""}</p>}
        </div>
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[9px] font-extrabold tracking-[.11em] text-[#8b97a9]">{label}</dt>
      <dd className="mt-1 font-extrabold text-[#0b1830]">{value}</dd>
    </div>
  );
}
