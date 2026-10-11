import { apiFetch } from "../../../components/api/apiFetch";
import { ApiResponseError, responsePayload } from "../../../components/api/apiResponse";
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

export async function fetchEscrowTransactions(): Promise<EscrowRequest[]> {
  const response = await fetch(`${getCustomerApiBaseUrl()}/api/v1/escrow`, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  const payload = await responsePayload(response);
  const data = record(payload.data) ? payload.data.transactions : [];
  return Array.isArray(data) ? data.map(parseTransaction) : [];
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
