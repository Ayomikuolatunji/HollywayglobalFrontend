import { apiFetch } from "../../../components/api/apiFetch";
import { ApiResponseError, responsePayload } from "../../../components/api/apiResponse";
import { getCustomerApiBaseUrl } from "../../../components/config/customerApi";

export type EventStatus =
  | "draft"
  | "pending_review"
  | "needs_information"
  | "vendor_matching"
  | "quotations_ready"
  | "vendor_assigned"
  | "payment_pending"
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
  const response = await fetch(`${getCustomerApiBaseUrl()}/api/v1/events`, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  const payload = await responsePayload(response);
  const items = record(payload.data) && Array.isArray(payload.data.items) ? payload.data.items : [];
  return items.map(parseEvent);
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

export function formatEventMoney(value: number | null) {
  return value === null ? "Not set" : `₦${(value / 100).toLocaleString("en-NG")}`;
}
