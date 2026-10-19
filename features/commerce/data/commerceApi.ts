import { apiFetch } from "../../../components/api/apiFetch";
import { ApiResponseError, responsePayload } from "../../../components/api/apiResponse";
import { getCustomerApiBaseUrl } from "../../../components/config/customerApi";
import type { OrderCartItem } from "./orderCart";

export type CommerceStatusEvent = { id: string; from_status: string | null; to_status: string; to_status_label: string; reason: string | null; created_at: string };
export type WantedRequest = {
  id: string; reference: string; status: string; status_label: string; item_name: string; specification: string; quantity: number;
  preferred_condition: string; budget_min_minor: number | null; budget_max_minor: number | null; delivery_location: string;
  urgency: string; details: string; referral_code: string; duration_days?: number; request_fee_minor: number; request_payment_status: "pending_payment" | "paid"; renewal_fee_minor: number; expires_at: string | null; featured_package: string; featured_fee_minor: number; featured_payment_status: "not_required" | "pending_payment" | "paid";
  rejection_reason: string | null; created_at: string; updated_at: string; status_events: CommerceStatusEvent[];
};
export type OrderItem = { id: string; listing_code: string; item_name: string; quantity: number; unit_price_minor: number; subtotal_minor: number };
export type CustomerOrder = {
  id: string; reference: string; status: string; status_label: string; delivery_address: string; delivery_method: string;
  fee_terms: string; primary_phone_e164: string; backup_phone_e164: string; inspection_checks: string; referral_code: string;
  subtotal_minor: number; delivery_fee_minor: number | null; escrow_fee_minor: number | null; admin_note: string | null;
  created_at: string; updated_at: string; items: OrderItem[]; status_events: CommerceStatusEvent[];
};
export type Page<T> = { items: T[]; page: number; page_size: number; total: number; total_pages: number; has_next: boolean; has_previous: boolean };

function isRecord(value: unknown): value is Record<string, unknown> { return Boolean(value) && typeof value === "object"; }
function parse<T>(value: unknown, message: string): T {
  if (!isRecord(value) || typeof value.id !== "string" || typeof value.reference !== "string") throw new ApiResponseError(message, 502);
  return value as T;
}
async function read<T>(response: Response, message: string): Promise<T> {
  const payload = await responsePayload(response);
  return parse<T>(payload.data, message);
}
function query(page: number, pageSize: number, status?: string) { const params = new URLSearchParams({ page: String(page), page_size: String(pageSize) }); if (status) params.set("status", status); return params; }

export async function saveWantedRequest(input: Record<string, unknown>, reference?: string) {
  const endpoint = `${getCustomerApiBaseUrl()}/api/v1/wanted-requests${reference ? `/${encodeURIComponent(reference)}` : ""}`;
  const response = await apiFetch(endpoint, { method: reference ? "PATCH" : "POST", credentials: "include", headers: { Accept: "application/json", "Content-Type": "application/json" }, body: JSON.stringify(input) }, { successMessage: input.action === "draft" ? "Wanted request Draft saved." : "Wanted request submitted." });
  return read<WantedRequest>(response, "Wanted request response was invalid.");
}
export async function fetchWantedRequests(page = 1, pageSize = 25, status?: string): Promise<Page<WantedRequest>> {
  const response = await fetch(`${getCustomerApiBaseUrl()}/api/v1/wanted-requests?${query(page, pageSize, status)}`, { credentials: "include", headers: { Accept: "application/json" } });
  const payload = await responsePayload(response);
  if (!isRecord(payload.data) || !Array.isArray(payload.data.items)) throw new ApiResponseError("Wanted requests response was invalid.", 502);
  return payload.data as Page<WantedRequest>;
}
export async function fetchWantedRequest(reference: string) { return read<WantedRequest>(await fetch(`${getCustomerApiBaseUrl()}/api/v1/wanted-requests/${encodeURIComponent(reference)}`, { credentials: "include", headers: { Accept: "application/json" } }), "Wanted request response was invalid."); }

export async function saveOrder(input: { action: "draft" | "submit"; listing_items: Array<{ code: string; quantity: number }>; delivery_address: string; delivery_method: string; fee_terms: string; primary_phone_e164: string; backup_phone_e164: string; inspection_checks: string; referral_code: string; terms_accepted: boolean }, reference?: string) {
  const endpoint = `${getCustomerApiBaseUrl()}/api/v1/orders${reference ? `/${encodeURIComponent(reference)}` : ""}`;
  const response = await apiFetch(endpoint, { method: reference ? "PATCH" : "POST", credentials: "include", headers: { Accept: "application/json", "Content-Type": "application/json" }, body: JSON.stringify(input) }, { successMessage: input.action === "draft" ? "Order Draft saved." : "Order request submitted." });
  return read<CustomerOrder>(response, "Order response was invalid.");
}
export async function fetchOrders(page = 1, pageSize = 25, status?: string): Promise<Page<CustomerOrder>> {
  const response = await fetch(`${getCustomerApiBaseUrl()}/api/v1/orders?${query(page, pageSize, status)}`, { credentials: "include", headers: { Accept: "application/json" } });
  const payload = await responsePayload(response);
  if (!isRecord(payload.data) || !Array.isArray(payload.data.items)) throw new ApiResponseError("Orders response was invalid.", 502);
  return payload.data as Page<CustomerOrder>;
}
export async function fetchOrder(reference: string) { return read<CustomerOrder>(await fetch(`${getCustomerApiBaseUrl()}/api/v1/orders/${encodeURIComponent(reference)}`, { credentials: "include", headers: { Accept: "application/json" } }), "Order response was invalid."); }
export function orderInput(items: OrderCartItem[], values: Record<string, string>, action: "draft" | "submit") { return { action, listing_items: items.map((item) => ({ code: item.code, quantity: item.quantity })), delivery_address: values.deliveryAddress || "", delivery_method: values.deliveryMethod || "", fee_terms: values.feeTerms || "", primary_phone_e164: values.primaryPhone || "", backup_phone_e164: values.backupPhone || "", inspection_checks: values.inspectionChecks || "", referral_code: values.referralCode || "", terms_accepted: values.termsAccepted === "true" }; }
