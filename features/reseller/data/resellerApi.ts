import { apiFetch } from "../../../components/api/apiFetch";
import { ApiResponseError, responsePayload } from "../../../components/api/apiResponse";
import { getCustomerApiBaseUrl } from "../../../components/config/customerApi";
import { fetchAllPages } from "../../../components/api/pagination";
import { fromApiStatus, toApiMarkupType, type ResellerMarkupType, type ResellerOrder } from "./reseller";

export type ResellerInput = { action: "draft" | "submit"; listingCode: string; quantity: string; markupType: ResellerMarkupType; markupValue: string; customerName: string; customerEmail: string; customerPhone: string; alternatePhone: string; deliveryAddress: string; notes: string; termsAccepted: boolean };
export type ResellerPage = { items: ResellerOrder[]; page: number; page_size: number; total: number; total_pages: number; has_next: boolean; has_previous: boolean };

function record(value: unknown): value is Record<string, unknown> { return Boolean(value) && typeof value === "object"; }
function number(value: unknown) { return typeof value === "number" && Number.isFinite(value) ? value / 100 : 0; }

function parse(value: unknown): ResellerOrder {
  if (!record(value) || typeof value.id !== "string" || typeof value.reference !== "string") throw new ApiResponseError("Reseller response returned an invalid order.", 502);
  return { id: value.id, reference: value.reference, listingCode: String(value.listing_code || ""), itemName: String(value.item_name || ""), quantity: Number(value.quantity || 1), baseUnitPrice: number(value.base_unit_price_minor), markupType: value.markup_type === "percentage" ? "Percentage" : "Fixed amount", markupValue: Number(value.markup_value || 0), subtotal: number(value.subtotal_minor), markupTotal: number(value.markup_total_minor), customerTotal: number(value.customer_total_minor), customerName: String(value.customer_name || ""), customerEmail: String(value.customer_email || ""), customerPhone: String(value.customer_phone || ""), alternatePhone: String(value.alternate_phone || ""), deliveryAddress: String(value.delivery_address || ""), notes: String(value.notes || ""), status: fromApiStatus(String(value.status || "draft")), statusLabel: String(value.status_label || "Draft"), adminNote: typeof value.admin_note === "string" ? value.admin_note : null, createdAt: String(value.created_at || ""), updatedAt: String(value.updated_at || "") };
}

export async function fetchResellerOrders(page = 1, pageSize = 25): Promise<ResellerPage> {
  const response = await fetch(`${getCustomerApiBaseUrl()}/api/v1/reseller/orders?page=${page}&page_size=${pageSize}`, { credentials: "include", headers: { Accept: "application/json" } });
  const payload = await responsePayload(response);
  if (!record(payload.data) || !Array.isArray(payload.data.items)) throw new ApiResponseError("Reseller response returned an invalid page.", 502);
  return { ...(payload.data as Omit<ResellerPage, "items">), items: payload.data.items.map(parse) };
}

export function fetchAllResellerOrders(): Promise<ResellerOrder[]> {
  return fetchAllPages(async (page, pageSize) => {
    const result = await fetchResellerOrders(page, pageSize);
    return { items: result.items, hasNext: result.has_next };
  }, 100);
}

export async function saveResellerOrder(input: ResellerInput, reference?: string) {
  const endpoint = `${getCustomerApiBaseUrl()}/api/v1/reseller/orders${reference ? `/${encodeURIComponent(reference)}` : ""}`;
  const response = await apiFetch(endpoint, { method: reference ? "PATCH" : "POST", credentials: "include", headers: { Accept: "application/json" }, body: JSON.stringify({ action: input.action, listing_code: input.listingCode, quantity: Number(input.quantity) || 1, markup_type: toApiMarkupType(input.markupType), markup_value: input.markupValue.replace(/,/g, ""), customer_name: input.customerName, customer_email: input.customerEmail, customer_phone: input.customerPhone, alternate_phone: input.alternatePhone, delivery_address: input.deliveryAddress, notes: input.notes, terms_accepted: input.termsAccepted }) }, { successMessage: input.action === "draft" ? "Reseller Draft saved." : "Reseller order submitted for review." });
  const payload = await responsePayload(response);
  return parse(payload.data);
}
