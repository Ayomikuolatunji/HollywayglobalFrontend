import { apiFetch } from "../../../components/api/apiFetch";
import { ApiResponseError, responsePayload } from "../../../components/api/apiResponse";
import { fetchAllPages } from "../../../components/api/pagination";
import { getCustomerApiBaseUrl } from "../../../components/config/customerApi";
import type {
  EscrowFeeCoverage,
  EscrowFundingParty,
  EscrowPartyRole,
  EscrowPurpose,
  EscrowRequest,
} from "./escrow";

export type EscrowSaveInput = {
  action: "draft" | "submit";
  purpose: EscrowPurpose;
  initiatorRole: EscrowPartyRole;
  subject: string;
  description: string;
  itemCondition: string;
  inspectionTerms: string;
  scope: string;
  deliverables: string;
  amountMinor: number | null;
  feeCoverage: EscrowFeeCoverage | null;
  deliveryRequired: boolean;
  deliveryFeeCoverage: EscrowFeeCoverage | null;
  courierMethod: string;
  deliveryAddress: string;
  releaseConditions: string;
  counterpartyEmail: string;
  fundingParty: EscrowFundingParty;
  fundingPartyEmail: string;
  termsAccepted: boolean;
};

export type EscrowFeeQuote = {
  amount_minor: number;
  escrow_fee_min_minor: number | null;
  escrow_fee_max_minor: number | null;
  loyalty_discount_percentage: number;
  currency: string;
};

function record(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

function parseTransaction(value: unknown): EscrowRequest {
  if (!record(value) || typeof value.id !== "string" || typeof value.reference !== "string") {
    throw new ApiResponseError("Escrow response returned an invalid transaction.", 502);
  }
  return {
    ...(value as EscrowRequest),
    purpose: String(value.purpose || "goods_sale") as EscrowPurpose,
    purpose_label: String(value.purpose_label || "Escrow agreement"),
    status: String(value.status || "draft") as EscrowRequest["status"],
    status_label: String(value.status_label || "Draft"),
    loyalty_discount_percentage: typeof value.loyalty_discount_percentage === "number" ? value.loyalty_discount_percentage : 0,
    counterparty_email: typeof value.counterparty_email === "string" ? value.counterparty_email : null,
    participants: Array.isArray(value.participants)
      ? value.participants as EscrowRequest["participants"]
      : [],
    payments: Array.isArray(value.payments) ? value.payments as EscrowRequest["payments"] : [],
    funding_invitation: record(value.funding_invitation)
      ? value.funding_invitation as EscrowRequest["funding_invitation"]
      : null,
    status_events: Array.isArray(value.status_events)
      ? value.status_events as EscrowRequest["status_events"]
      : [],
    fulfilment: record(value.fulfilment) ? value.fulfilment as EscrowRequest["fulfilment"] : null,
    inspection: record(value.inspection) ? value.inspection as EscrowRequest["inspection"] : null,
    disputes: Array.isArray(value.disputes) ? value.disputes as EscrowRequest["disputes"] : [],
    evidence: Array.isArray(value.evidence) ? value.evidence as EscrowRequest["evidence"] : [],
    payout: record(value.payout) ? value.payout as EscrowRequest["payout"] : null,
    release_requests: Array.isArray(value.release_requests)
      ? value.release_requests as EscrowRequest["release_requests"]
      : [],
    settlement_account: record(value.settlement_account)
      ? value.settlement_account as EscrowRequest["settlement_account"]
      : null,
    viewer: record(value.viewer) ? value.viewer as EscrowRequest["viewer"] : undefined,
  };
}

function payloadFor(input: EscrowSaveInput) {
  return {
    action: input.action,
    purpose: input.purpose,
    initiator_role: input.initiatorRole,
    subject: input.subject,
    description: input.description,
    item_condition: input.itemCondition || null,
    inspection_terms: input.inspectionTerms || null,
    scope: input.scope || null,
    deliverables: input.deliverables || null,
    amount_minor: input.amountMinor,
    fee_coverage: input.feeCoverage,
    delivery_required: input.deliveryRequired,
    delivery_fee_coverage: input.deliveryRequired ? input.deliveryFeeCoverage : null,
    courier_method: input.deliveryRequired ? input.courierMethod || null : null,
    delivery_address: input.deliveryRequired ? input.deliveryAddress : null,
    release_conditions: input.releaseConditions,
    counterparty_email: input.counterpartyEmail || null,
    funding_party: input.fundingParty,
    funding_party_email: input.fundingParty === "other" ? input.fundingPartyEmail : null,
    terms_accepted: input.termsAccepted,
  };
}

async function saveResponse(response: Response) {
  const payload = await responsePayload(response);
  return parseTransaction(payload.data);
}

export async function saveEscrow(input: EscrowSaveInput, reference?: string) {
  const endpoint = reference
    ? `${getCustomerApiBaseUrl()}/api/v1/escrow/${encodeURIComponent(reference)}`
    : `${getCustomerApiBaseUrl()}/api/v1/escrow`;
  const response = await apiFetch(
    endpoint,
    {
      method: reference ? "PATCH" : "POST",
      credentials: "include",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(payloadFor(input)),
    },
    { notify: false },
  );
  return saveResponse(response);
}

export async function fetchEscrowFeeQuote(amountMinor: number, signal?: AbortSignal): Promise<EscrowFeeQuote> {
  const response = await fetch(
    `${getCustomerApiBaseUrl()}/api/v1/escrow/fee-quote?amount_minor=${amountMinor}`,
    { credentials: "include", headers: { Accept: "application/json" }, signal },
  );
  const payload = await responsePayload(response);
  const value = payload.data;
  if (!record(value) || typeof value.amount_minor !== "number") {
    throw new ApiResponseError("Hollyway fee quote returned an invalid response.", 502);
  }
  return {
    amount_minor: value.amount_minor,
    escrow_fee_min_minor: typeof value.escrow_fee_min_minor === "number" ? value.escrow_fee_min_minor : null,
    escrow_fee_max_minor: typeof value.escrow_fee_max_minor === "number" ? value.escrow_fee_max_minor : null,
    loyalty_discount_percentage: typeof value.loyalty_discount_percentage === "number" ? value.loyalty_discount_percentage : 0,
    currency: typeof value.currency === "string" ? value.currency : "NGN",
  };
}

export async function fetchEscrowTransactions(): Promise<EscrowRequest[]> {
  return fetchAllPages(async (page, pageSize) => {
    const response = await fetch(`${getCustomerApiBaseUrl()}/api/v1/escrow?page=${page}&page_size=${pageSize}`, {
      credentials: "include",
      headers: { Accept: "application/json" },
    });
    const payload = await responsePayload(response);
    const data = record(payload.data) ? payload.data : {};
    const items = Array.isArray(data.items) ? data.items.map(parseTransaction) : [];
    return { items, hasNext: data.has_next === true };
  });
}

export async function fetchEscrowTransaction(reference: string) {
  const response = await fetch(
    `${getCustomerApiBaseUrl()}/api/v1/escrow/${encodeURIComponent(reference)}`,
    { credentials: "include", headers: { Accept: "application/json" } },
  );
  const payload = await responsePayload(response);
  return parseTransaction(payload.data);
}

export async function sendFundingInvitation(reference: string, email: string) {
  const response = await apiFetch(
    `${getCustomerApiBaseUrl()}/api/v1/escrow/${encodeURIComponent(reference)}/funding-invitation`,
    {
      method: "POST",
      credentials: "include",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    },
    { notify: false },
  );
  const payload = await responsePayload(response);
  return payload.data;
}

export async function fetchFundingInvitation(token: string) {
  const response = await fetch(
    `${getCustomerApiBaseUrl()}/api/v1/escrow/invitations/${encodeURIComponent(token)}`,
    { headers: { Accept: "application/json" } },
  );
  const payload = await responsePayload(response);
  return payload.data as Record<string, unknown>;
}

export async function acceptFundingInvitation(token: string) {
  const response = await apiFetch(
    `${getCustomerApiBaseUrl()}/api/v1/escrow/invitations/${encodeURIComponent(token)}/accept`,
    {
      method: "POST",
      credentials: "include",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ terms_accepted: true }),
    },
    { notify: false },
  );
  const payload = await responsePayload(response);
  return parseTransaction(payload.data);
}

export async function acceptFundingForEscrow(reference: string, termsAccepted: boolean) {
  const response = await apiFetch(
    `${getCustomerApiBaseUrl()}/api/v1/escrow/${encodeURIComponent(reference)}/funding-acceptance`,
    {
      method: "POST",
      credentials: "include",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ terms_accepted: termsAccepted }),
    },
    { notify: false },
  );
  const payload = await responsePayload(response);
  return parseTransaction(payload.data);
}

export async function submitEscrowPaymentProof(
  reference: string,
  input: {
    idempotencyKey: string;
    amountMinor: number;
    receipt: File;
    transferReference: string;
    transferredAt: string;
    senderName: string;
    submittedNote: string;
  },
) {
  const form = new FormData();
  form.set("idempotency_key", input.idempotencyKey);
  form.set("amount_minor", String(input.amountMinor));
  form.set("transfer_reference", input.transferReference);
  form.set("transferred_at", input.transferredAt);
  form.set("sender_name", input.senderName);
  form.set("submitted_note", input.submittedNote);
  form.set("receipt", input.receipt, input.receipt.name);
  const response = await apiFetch(
    `${getCustomerApiBaseUrl()}/api/v1/escrow/${encodeURIComponent(reference)}/payment-proof`,
    {
      method: "POST",
      credentials: "include",
      headers: { Accept: "application/json" },
      body: form,
    },
    { notify: false },
  );
  const payload = await responsePayload(response);
  const responseBody = payload as typeof payload & { payment?: unknown };
  return {
    transaction: parseTransaction(payload.data),
    payment: responseBody.payment as EscrowRequest["payments"][number],
  };
}

export async function updateEscrowFulfilment(
  reference: string,
  input: {
    action: "book_dispatch" | "mark_in_transit" | "mark_delivered" | "start_inspection";
    carrierName?: string;
    trackingReference?: string;
    note?: string;
  },
) {
  const response = await apiFetch(
    `${getCustomerApiBaseUrl()}/api/v1/escrow/${encodeURIComponent(reference)}/fulfilment`,
    {
      method: "POST",
      credentials: "include",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        action: input.action,
        carrier_name: input.carrierName || null,
        tracking_reference: input.trackingReference || null,
        note: input.note || null,
      }),
    },
    { notify: false },
  );
  const payload = await responsePayload(response);
  return parseTransaction(payload.data);
}

export async function updateEscrowInspection(reference: string, decision: "accepted" | "disputed", note: string) {
  const response = await apiFetch(
    `${getCustomerApiBaseUrl()}/api/v1/escrow/${encodeURIComponent(reference)}/inspection`,
    {
      method: "POST",
      credentials: "include",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ decision, note }),
    },
    { notify: false },
  );
  const payload = await responsePayload(response);
  return parseTransaction(payload.data);
}

export async function requestEscrowRelease(reference: string, details: string) {
  const response = await apiFetch(
    `${getCustomerApiBaseUrl()}/api/v1/escrow/${encodeURIComponent(reference)}/release-requests`,
    {
      method: "POST",
      credentials: "include",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ details }),
    },
    { notify: false },
  );
  const payload = await responsePayload(response);
  return parseTransaction(payload.data);
}

export async function openEscrowDispute(reference: string, reason: string, details: string) {
  const response = await apiFetch(
    `${getCustomerApiBaseUrl()}/api/v1/escrow/${encodeURIComponent(reference)}/disputes`,
    {
      method: "POST",
      credentials: "include",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ reason, details }),
    },
    { notify: false },
  );
  const payload = await responsePayload(response);
  return parseTransaction(payload.data);
}

export async function uploadEscrowEvidence(
  reference: string,
  disputeId: string,
  input: { kind: string; file: File },
) {
  const form = new FormData();
  form.set("kind", input.kind);
  form.set("evidence", input.file, input.file.name);
  const response = await apiFetch(
    `${getCustomerApiBaseUrl()}/api/v1/escrow/${encodeURIComponent(reference)}/disputes/${encodeURIComponent(disputeId)}/evidence`,
    {
      method: "POST",
      credentials: "include",
      headers: { Accept: "application/json" },
      body: form,
    },
    { notify: false },
  );
  const payload = await responsePayload(response);
  return payload.data;
}
