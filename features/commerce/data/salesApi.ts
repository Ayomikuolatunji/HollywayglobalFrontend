import { ApiResponseError, responsePayload } from "../../../components/api/apiResponse";
import { getCustomerApiBaseUrl } from "../../../components/config/customerApi";
import type { CommerceStatusEvent, OrderItem, Page } from "./commerceApi";

export type SaleBuyer = { id: string; email: string; name: string; phone: string };
export type SellerOrder = {
  id: string; reference: string; status: string; status_label: string;
  delivery_address: string; delivery_method: string; fee_terms: string;
  primary_phone_e164: string; backup_phone_e164: string; inspection_checks: string;
  subtotal_minor: number; delivery_fee_minor: number | null; escrow_fee_minor: number | null;
  admin_note: string | null; terms_accepted_at: string | null; created_at: string; updated_at: string;
  buyer: SaleBuyer | null; items: OrderItem[]; status_events: CommerceStatusEvent[];
};

function isRecord(value: unknown): value is Record<string, unknown> { return Boolean(value) && typeof value === "object"; }
function query(page: number, pageSize: number, status?: string) { const params = new URLSearchParams({ page: String(page), page_size: String(pageSize) }); if (status) params.set("status", status); return params; }
async function pageResponse(response: Response): Promise<Page<SellerOrder>> {
  const payload = await responsePayload(response);
  if (!isRecord(payload.data) || !Array.isArray(payload.data.items)) throw new ApiResponseError("Sales response was invalid.", 502);
  return payload.data as Page<SellerOrder>;
}

export async function fetchSales(page = 1, pageSize = 25, status?: string): Promise<Page<SellerOrder>> {
  return pageResponse(await fetch(`${getCustomerApiBaseUrl()}/api/v1/sales/orders?${query(page, pageSize, status)}`, { credentials: "include", headers: { Accept: "application/json" } }));
}

export async function fetchSale(reference: string): Promise<SellerOrder> {
  const payload = await responsePayload(await fetch(`${getCustomerApiBaseUrl()}/api/v1/sales/orders/${encodeURIComponent(reference)}`, { credentials: "include", headers: { Accept: "application/json" } }));
  if (!isRecord(payload.data) || typeof payload.data.reference !== "string") throw new ApiResponseError("Sale response was invalid.", 502);
  return payload.data as SellerOrder;
}
