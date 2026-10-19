import { apiFetch } from "../../../components/api/apiFetch";
import { ApiResponseError, responsePayload } from "../../../components/api/apiResponse";
import { fetchAllPages } from "../../../components/api/pagination";
import { getCustomerApiBaseUrl } from "../../../components/config/customerApi";

export type EventStatus =
  | "draft"
  | "pending_review"
  | "needs_information"
  | "vendor_matching"
  | "quotations_ready"
  | "vendor_assigned"
  | "payment_pending"
  | "payment_proof_submitted"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled";
export type EventType = "wedding" | "birthday" | "corporate" | "funeral" | "housewarming";
export type EventServiceType =
  | "catering"
  | "bulk_drinks"
  | "planner"
  | "decorator"
  | "canopies_tents"
  | "tables_chairs"
  | "cooling_vans"
  | "sound_generator";

export type EventService = {
  id: string;
  service_type: EventServiceType;
  service_label: string;
  note: string;
};
export type EventQuote = {
  id: string;
  service_id: string;
  vendor_name: string;
  vendor_phone_e164: string;
  vendor_email: string | null;
  amount_minor: number;
  details: string;
  status: string;
  created_at: string;
  updated_at: string;
};
export type EventAssignment = {
  id: string;
  service_id: string;
  quote_id: string | null;
  vendor_name: string | null;
  vendor_phone_e164: string | null;
  vendor_email: string | null;
  amount_minor: number | null;
  note: string;
  status: string;
  assigned_at: string;
  completed_at: string | null;
};
export type EventPayment = {
  id: string;
  provider_reference: string;
  provider: string;
  amount_minor: number;
  currency: string;
  status: "pending" | "proof_submitted" | "received" | "rejected";
  transfer_reference: string | null;
  submitted_amount_minor: number | null;
  transferred_at: string | null;
  sender_name: string | null;
  submitted_note: string | null;
  reviewed_at: string | null;
  admin_note: string | null;
  failure_reason: string | null;
  paid_at: string | null;
  proof: { original_name: string; mime_type: string; byte_size: number } | null;
};
export type EventManualPayment = {
  configured: boolean;
  method?: "manual_bank_transfer";
  bank_name?: string;
  account_name?: string;
  account_number?: string;
  amount_minor?: number;
  currency?: string;
  instruction?: string;
  admin_whatsapp_number?: string | null;
  admin_whatsapp_url?: string | null;
};
export type EventRequest = {
  id: string;
  reference: string;
  status: EventStatus;
  status_label: string;
  event_type: EventType;
  event_type_label: string;
  event_at: string | null;
  venue_address: string;
  guest_count: number | null;
  requirements: string;
  target_budget_minor: number | null;
  terms_accepted_at: string | null;
  escrow_reference: string | null;
  proposal_status: "pending" | "accepted" | "declined";
  proposal_decided_at: string | null;
  proposal_note: string | null;
  services: EventService[];
  quotes: EventQuote[];
  assignments: EventAssignment[];
  status_events: Array<{
    id: string;
    from_status: string | null;
    to_status: string;
    to_status_label: string;
    actor_admin_email: string | null;
    reason: string | null;
    created_at: string;
  }>;
  review: { id: string; rating: number; comment: string; created_at: string } | null;
  payment: EventPayment | null;
  manual_payment?: EventManualPayment;
  created_at: string;
  updated_at: string;
  owner?: { id: string; email: string; name: string; phone: string };
};
export type EventSaveInput = {
  action: "draft" | "submit";
  eventType: EventType;
  eventAt: string | null;
  venueAddress: string;
  guestCount: number | null;
  services: Array<{ serviceType: EventServiceType; note: string }>;
  requirements: string;
  targetBudgetMinor: number | null;
  termsAccepted: boolean;
};

function record(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

function parseEvent(value: unknown): EventRequest {
  if (!record(value) || typeof value.id !== "string" || typeof value.reference !== "string") {
    throw new ApiResponseError("Event response returned an invalid request.", 502);
  }
  return {
    ...(value as EventRequest),
    services: Array.isArray(value.services) ? (value.services as EventService[]) : [],
    quotes: Array.isArray(value.quotes) ? (value.quotes as EventQuote[]) : [],
    assignments: Array.isArray(value.assignments) ? (value.assignments as EventAssignment[]) : [],
    status_events: Array.isArray(value.status_events)
      ? (value.status_events as EventRequest["status_events"])
      : [],
    review: record(value.review)
      ? (value.review as EventRequest["review"])
      : null,
    payment: record(value.payment) ? (value.payment as EventPayment) : null,
    manual_payment: record(value.manual_payment)
      ? (value.manual_payment as EventManualPayment)
      : undefined,
  };
}

async function read(response: Response): Promise<EventRequest> {
  const payload = await responsePayload(response);
  return parseEvent(payload.data);
}

function requestBody(input: EventSaveInput) {
  return {
    action: input.action,
    event_type: input.eventType,
    event_at: input.eventAt,
    venue_address: input.venueAddress,
    guest_count: input.guestCount,
    services: input.services.map((item) => ({ service_type: item.serviceType, note: item.note })),
    requirements: input.requirements,
    target_budget_minor: input.targetBudgetMinor,
    terms_accepted: input.termsAccepted,
  };
}

export async function saveEvent(input: EventSaveInput, reference?: string) {
  const endpoint = `${getCustomerApiBaseUrl()}/api/v1/events${reference ? `/${encodeURIComponent(reference)}` : ""}`;
  const response = await apiFetch(
    endpoint,
    {
      method: reference ? "PATCH" : "POST",
      credentials: "include",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(requestBody(input)),
    },
    { successMessage: input.action === "draft" ? "Event Draft saved." : "Event request submitted." },
  );
  return read(response);
}

export async function fetchEvents(): Promise<EventRequest[]> {
  return fetchAllPages(async (page, pageSize) => {
    const response = await fetch(`${getCustomerApiBaseUrl()}/api/v1/events?page=${page}&page_size=${pageSize}`, {
      credentials: "include",
      headers: { Accept: "application/json" },
    });
    const payload = await responsePayload(response);
    const data = record(payload.data) ? payload.data : {};
    const items = Array.isArray(data.items) ? data.items.map(parseEvent) : [];
    return { items, hasNext: data.has_next === true };
  });
}

export async function fetchEvent(reference: string) {
  const response = await fetch(`${getCustomerApiBaseUrl()}/api/v1/events/${encodeURIComponent(reference)}`, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  return read(response);
}

export async function reviewEvent(reference: string, rating: number, comment: string) {
  const response = await apiFetch(
    `${getCustomerApiBaseUrl()}/api/v1/events/${encodeURIComponent(reference)}/review`,
    {
      method: "POST",
      credentials: "include",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ rating, comment }),
    },
    { successMessage: "Event review saved." },
  );
  const payload = await responsePayload(response);
  return payload.data;
}

export async function decideEventProposal(
  reference: string,
  decision: "accept" | "decline",
  note: string,
) {
  const response = await apiFetch(
    `${getCustomerApiBaseUrl()}/api/v1/events/${encodeURIComponent(reference)}/proposal`,
    {
      method: "POST",
      credentials: "include",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ decision, note }),
    },
    { successMessage: decision === "accept" ? "Proposal accepted." : "Changes requested." },
  );
  return read(response);
}

export async function submitEventPaymentProof(
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
  form.set("receipt", input.receipt);
  form.set("transfer_reference", input.transferReference);
  form.set("transferred_at", input.transferredAt);
  form.set("sender_name", input.senderName);
  form.set("submitted_note", input.submittedNote);
  const response = await apiFetch(
    `${getCustomerApiBaseUrl()}/api/v1/events/${encodeURIComponent(reference)}/payment-proof`,
    { method: "POST", credentials: "include", headers: { Accept: "application/json" }, body: form },
    { successMessage: "Payment proof uploaded for Admin review." },
  );
  return read(response);
}

export function formatEventMoney(value: number | null) {
  return value === null ? "Not set" : `₦${(value / 100).toLocaleString("en-NG")}`;
}
