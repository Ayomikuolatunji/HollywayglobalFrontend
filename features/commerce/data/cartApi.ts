import { apiFetch } from "../../../components/api/apiFetch";
import { ApiResponseError, responsePayload } from "../../../components/api/apiResponse";
import { getCustomerApiBaseUrl } from "../../../components/config/customerApi";

export type RemoteCartItem = { code: string; name: string; price: number; quantity: number; availableQuantity: number };

function record(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

function parseItems(value: unknown): RemoteCartItem[] {
  if (!record(value) || !Array.isArray(value.items)) throw new ApiResponseError("Cart response returned an invalid record.", 502);
  return value.items.flatMap((entry) => {
    if (!record(entry) || !record(entry.listing)) return [];
    const listing = entry.listing;
    if (typeof listing.reference !== "string" || typeof listing.item_name !== "string") return [];
    const priceMinor = typeof listing.unit_price_minor === "number" ? listing.unit_price_minor : 0;
    const quantity = typeof entry.quantity === "number" ? entry.quantity : 0;
    if (quantity < 1) return [];
    return [{ code: listing.reference, name: listing.item_name, price: priceMinor / 100, quantity, availableQuantity: typeof listing.quantity === "number" ? Math.max(0, Math.floor(listing.quantity)) : quantity }];
  });
}

export async function fetchCart(): Promise<RemoteCartItem[]> {
  const response = await fetch(`${getCustomerApiBaseUrl()}/api/v1/cart`, { credentials: "include", headers: { Accept: "application/json" } });
  const payload = await responsePayload(response);
  return parseItems(payload.data);
}

export async function addCartItem(code: string, quantity = 1) {
  const response = await apiFetch(`${getCustomerApiBaseUrl()}/api/v1/cart/items`, { method: "POST", credentials: "include", headers: { Accept: "application/json" }, body: JSON.stringify({ listing_code: code, quantity }) }, { notify: false });
  const payload = await responsePayload(response);
  return parseItems(payload.data);
}

export async function updateCartItem(code: string, quantity: number) {
  const response = await apiFetch(`${getCustomerApiBaseUrl()}/api/v1/cart/items/${encodeURIComponent(code)}`, { method: "PATCH", credentials: "include", headers: { Accept: "application/json" }, body: JSON.stringify({ listing_code: code, quantity }) }, { notify: false });
  const payload = await responsePayload(response);
  return parseItems(payload.data);
}

export async function removeCartItem(code: string) {
  const response = await apiFetch(`${getCustomerApiBaseUrl()}/api/v1/cart/items/${encodeURIComponent(code)}`, { method: "DELETE", credentials: "include", headers: { Accept: "application/json" } }, { notify: false });
  const payload = await responsePayload(response);
  return parseItems(payload.data);
}

export async function clearCart() {
  const response = await apiFetch(`${getCustomerApiBaseUrl()}/api/v1/cart`, { method: "DELETE", credentials: "include", headers: { Accept: "application/json" } }, { notify: false });
  await responsePayload(response);
}
