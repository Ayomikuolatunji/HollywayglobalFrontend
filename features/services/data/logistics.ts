import { apiFetch } from "../../../components/api/apiFetch";
import { ApiResponseError, responsePayload } from "../../../components/api/apiResponse";
import { fetchAllPages } from "../../../components/api/pagination";
import { getCustomerApiBaseUrl } from "../../../components/config/customerApi";

export type LogisticsStatus = "draft" | "pending_review" | "needs_information" | "quoting" | "quoted" | "quote_accepted" | "payment_pending" | "booked" | "picked_up" | "in_transit" | "delivered" | "completed" | "cancelled";
export type LogisticsOption = "same_day_intracity" | "bulky_cargo_minibus" | "interstate_waybill" | "international_air_express";
export type SizeClass = "small_parcel" | "medium_box" | "heavy_furniture" | "bulk_sacks";

export type LogisticsQuote = {
  id: string;
  carrier_name: string;
  service_label: string;
  amount_minor: number;
  estimated_days: number | null;
  details: string;
  status: string;
  created_at: string;
  updated_at: string;
};
export type LogisticsDeliveryProof = {
  id: string;
  name: string;
  mime_type: string;
  byte_size: number;
  uploaded_by_admin_email: string;
  created_at: string;
  download_path: string;
};
export type LogisticsRequest = {
  id: string;
  reference: string;
  status: LogisticsStatus;
  status_label: string;
  sender_name: string;
  sender_phone_e164: string;
  pickup_address: string;
  receiver_name: string;
  receiver_phone_e164: string;
  delivery_address: string;
  item_name: string;
  item_description: string;
  size_class: SizeClass;
  size_class_label: string;
  fragile: boolean;
  declared_value_minor: number | null;
  logistics_option: LogisticsOption;
  logistics_option_label: string;
  transit_insurance: boolean;
  pickup_at: string | null;
  terms_accepted_at: string | null;
  carrier_name: string | null;
  tracking_reference: string | null;
  admin_note: string | null;
  proofs_of_delivery: LogisticsDeliveryProof[];
  quotes: LogisticsQuote[];
  status_events: Array<{ id: string; from_status: string | null; to_status: string; to_status_label: string; actor_admin_email: string | null; reason: string | null; created_at: string }>;
  created_at: string;
  updated_at: string;
};
export type LogisticsSaveInput = {
  action: "draft" | "submit";
  senderName: string;
  senderPhoneE164: string;
  pickupAddress: string;
  receiverName: string;
  receiverPhoneE164: string;
  deliveryAddress: string;
  itemName: string;
  itemDescription: string;
  sizeClass: SizeClass;
  fragile: boolean;
  declaredValueMinor: number | null;
  logisticsOption: LogisticsOption;
  transitInsurance: boolean;
  pickupAt: string | null;
  termsAccepted: boolean;
};

function record(value: unknown): value is Record<string, unknown> { return Boolean(value) && typeof value === "object"; }
function parse(value: unknown): LogisticsRequest {
  if (!record(value) || typeof value.id !== "string" || typeof value.reference !== "string") throw new ApiResponseError("Logistics response returned an invalid request.", 502);
  return {
    ...(value as LogisticsRequest),
    proofs_of_delivery: Array.isArray(value.proofs_of_delivery)
      ? value.proofs_of_delivery as LogisticsDeliveryProof[]
      : [],
    quotes: Array.isArray(value.quotes) ? value.quotes as LogisticsQuote[] : [],
    status_events: Array.isArray(value.status_events) ? value.status_events as LogisticsRequest["status_events"] : [],
  };
}
async function read(response: Response) { const payload = await responsePayload(response); return parse(payload.data); }
function body(input: LogisticsSaveInput) {
  return {
    action: input.action, sender_name: input.senderName, sender_phone_e164: input.senderPhoneE164,
    pickup_address: input.pickupAddress, receiver_name: input.receiverName, receiver_phone_e164: input.receiverPhoneE164,
    delivery_address: input.deliveryAddress, item_name: input.itemName, item_description: input.itemDescription,
    size_class: input.sizeClass, fragile: input.fragile, declared_value_minor: input.declaredValueMinor,
    logistics_option: input.logisticsOption, transit_insurance: input.transitInsurance, pickup_at: input.pickupAt,
    terms_accepted: input.termsAccepted,
  };
}

export async function saveLogistics(input: LogisticsSaveInput, reference?: string) {
  const endpoint = `${getCustomerApiBaseUrl()}/api/v1/logistics${reference ? `/${encodeURIComponent(reference)}` : ""}`;
  const response = await apiFetch(endpoint, {
    method: reference ? "PATCH" : "POST", credentials: "include",
    headers: { Accept: "application/json", "Content-Type": "application/json" }, body: JSON.stringify(body(input)),
  }, { successMessage: input.action === "draft" ? "Logistics Draft saved." : "Logistics request submitted." });
  return read(response);
}
export async function fetchLogistics() {
  return fetchAllPages(async (page, pageSize) => {
    const response = await fetch(`${getCustomerApiBaseUrl()}/api/v1/logistics?page=${page}&page_size=${pageSize}`, { credentials: "include", headers: { Accept: "application/json" } });
    const payload = await responsePayload(response);
    const data = record(payload.data) ? payload.data : {};
    const items = Array.isArray(data.items) ? data.items.map(parse) : [];
    return { items, hasNext: data.has_next === true };
  });
}
export async function fetchLogisticsRequest(reference: string) {
  const response = await fetch(`${getCustomerApiBaseUrl()}/api/v1/logistics/${encodeURIComponent(reference)}`, { credentials: "include", headers: { Accept: "application/json" } });
  return read(response);
}
export async function acceptLogisticsQuote(reference: string, quoteId: string) {
  const response = await apiFetch(`${getCustomerApiBaseUrl()}/api/v1/logistics/${encodeURIComponent(reference)}/accept-quote`, {
    method: "POST", credentials: "include", headers: { Accept: "application/json", "Content-Type": "application/json" }, body: JSON.stringify({ quote_id: quoteId }),
  }, { successMessage: "Logistics quotation accepted." });
  return read(response);
}
export function formatLogisticsMoney(value: number | null) { return value === null ? "Not set" : `₦${(value / 100).toLocaleString("en-NG")}`; }

export function logisticsProofUrl(proof: LogisticsDeliveryProof) {
  return `${getCustomerApiBaseUrl()}${proof.download_path}`;
}
