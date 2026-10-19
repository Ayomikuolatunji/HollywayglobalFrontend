import { apiFetch } from "../../../components/api/apiFetch";
import { ApiResponseError, responsePayload } from "../../../components/api/apiResponse";
import { fetchAllPages } from "../../../components/api/pagination";
import { getCustomerApiBaseUrl } from "../../../components/config/customerApi";
import { cardListing } from "./listingApi";
import type { Listing as MarketplaceListing } from "../data";

export type SavedListingPage = {
  items: MarketplaceListing[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
};

function record(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

export async function fetchSavedListingCodes() {
  const response = await fetch(`${getCustomerApiBaseUrl()}/api/v1/saved-listings?codes_only=true`, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  const payload = await responsePayload(response);
  if (!record(payload.data) || !Array.isArray(payload.data.codes)) {
    throw new ApiResponseError("Saved listings response returned an invalid record.", 502);
  }
  return payload.data.codes.filter((code): code is string => typeof code === "string").map((code) => code.toUpperCase());
}

export async function toggleSavedListing(code: string, saved: boolean) {
  const response = await apiFetch(
    `${getCustomerApiBaseUrl()}/api/v1/saved-listings/${encodeURIComponent(code)}`,
    { method: saved ? "DELETE" : "POST", credentials: "include", headers: { Accept: "application/json" } },
    { successMessage: saved ? "Listing removed from saved items." : "Listing saved." },
  );
  await responsePayload(response);
  return !saved;
}

export async function fetchSavedListings(page = 1, pageSize = 24): Promise<SavedListingPage> {
  const query = new URLSearchParams({ page: String(page), page_size: String(pageSize) });
  const response = await fetch(`${getCustomerApiBaseUrl()}/api/v1/saved-listings?${query}`, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  const payload = await responsePayload(response);
  if (!record(payload.data) || !Array.isArray(payload.data.items)) {
    throw new ApiResponseError("Saved listings response returned an invalid page.", 502);
  }
  return { ...(payload.data as Omit<SavedListingPage, "items">), items: payload.data.items.map(cardListing) };
}

export function fetchAllSavedListings(): Promise<MarketplaceListing[]> {
  return fetchAllPages(async (page, pageSize) => {
    const result = await fetchSavedListings(page, pageSize);
    return { items: result.items, hasNext: result.has_next };
  }, 100);
}
