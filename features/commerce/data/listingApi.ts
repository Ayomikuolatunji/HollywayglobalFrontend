import { apiFetch } from "../../../components/api/apiFetch";
import { ApiResponseError, responsePayload } from "../../../components/api/apiResponse";
import { fetchAllPages } from "../../../components/api/pagination";
import { getCustomerApiBaseUrl } from "../../../components/config/customerApi";
import type { Listing as MarketplaceCardListing } from "../data";

export type ListingStatus = "draft" | "pending_review" | "approved" | "published" | "rejected" | "sold" | "closed";
export type ListingMedia = { id: string; kind: "photo" | "video"; name: string; mime_type: string; byte_size: number; download_path: string };
export type ListingAdditionalItem = { id: string; item_name: string; category: string; quantity: number; unit_price_minor: number | null; sort_order: number };
export type ListingStatusEvent = { id: string; from_status: string | null; to_status: string; to_status_label: string; reason: string | null; created_at: string };
export type Listing = {
  id: string; reference: string; listing_code: string; status: ListingStatus; status_label: string;
  selling_route: string; category: string; item_name: string; brand: string; model_specifications: string;
  year: number | null; quantity: number; unit: string; unit_price_minor: number | null; bulk_price_minor: number | null;
  area: string; city: string; state: string; condition: string; item_source: string; repaired_before: string;
  repair_details: string; ownership_reason: string; proof_available: string; proof_type: string;
  preferred_delivery_method: string; delivery_fee_coverage: string; escrow_fee_coverage: string; description: string;
  visibility_package: string; featured_payment_status: "not_required" | "pending_payment" | "paid"; rejection_reason: string | null; media: ListingMedia[]; additional_items: ListingAdditionalItem[]; status_events: ListingStatusEvent[];
  terms_accepted_at: string | null;
  created_at: string; updated_at: string;
};

export type ListingFormValues = Record<string, string | boolean | File | null | undefined>;
export type ListingPage = { items: Listing[]; page: number; page_size: number; total: number; total_pages: number; has_next: boolean; has_previous: boolean };
export type MarketplacePage = { items: MarketplaceCardListing[]; page: number; page_size: number; total: number; total_pages: number; has_next: boolean; has_previous: boolean };

function record(value: unknown): value is Record<string, unknown> { return Boolean(value) && typeof value === "object"; }

function parseListing(value: unknown): Listing {
  if (!record(value) || typeof value.id !== "string" || typeof value.reference !== "string") {
    throw new ApiResponseError("Listing response returned an invalid record.", 502);
  }
  return {
    ...(value as Listing),
    media: Array.isArray(value.media) ? value.media as ListingMedia[] : [],
    additional_items: Array.isArray(value.additional_items) ? value.additional_items as ListingAdditionalItem[] : [],
    status_events: Array.isArray(value.status_events) ? value.status_events as ListingStatusEvent[] : [],
  };
}

async function readListing(response: Response) {
  const payload = await responsePayload(response);
  return parseListing(payload.data);
}

function formData(values: ListingFormValues) {
  const data = new FormData();
  Object.entries(values).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    if (value instanceof File) data.append(key, value);
    else data.append(key, String(value));
  });
  return data;
}

export async function saveListing(values: ListingFormValues, reference?: string) {
  const pageReference = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("reference") || undefined : undefined;
  const resolvedReference = reference || pageReference;
  const endpoint = `${getCustomerApiBaseUrl()}/api/v1/listings${resolvedReference ? `/${encodeURIComponent(resolvedReference)}` : ""}`;
  const action = String(values.action || "draft");
  const response = await apiFetch(endpoint, {
    method: resolvedReference ? "PATCH" : "POST",
    credentials: "include",
    headers: { Accept: "application/json" },
    body: formData(values),
  }, { successMessage: action === "draft" ? "Listing Draft saved." : "Listing submitted for Hollyway review." });
  return readListing(response);
}

export async function fetchListings(page = 1, pageSize = 25, status?: string) {
  const query = new URLSearchParams({ page: String(page), page_size: String(pageSize) });
  if (status) query.set("status", status);
  const response = await fetch(`${getCustomerApiBaseUrl()}/api/v1/listings?${query.toString()}`, { credentials: "include", headers: { Accept: "application/json" } });
  const payload = await responsePayload(response);
  if (!record(payload.data) || !Array.isArray(payload.data.items)) throw new ApiResponseError("Listings response returned an invalid page.", 502);
  return { ...(payload.data as ListingPage), items: payload.data.items.map(parseListing) };
}

export async function fetchListing(reference: string) {
  return readListing(await fetch(`${getCustomerApiBaseUrl()}/api/v1/listings/${encodeURIComponent(reference)}`, { credentials: "include", headers: { Accept: "application/json" } }));
}

export type MarketplaceFilters = {
  page?: number;
  pageSize?: number;
  signal?: AbortSignal;
  query?: string;
  category?: string;
  route?: string;
  condition?: string;
  location?: string;
  deliveryMethod?: string;
  minimumPriceMinor?: number;
  maximumPriceMinor?: number;
  featured?: boolean;
  sort?: "newest" | "price_asc" | "price_desc";
};

export function cardListing(value: unknown): MarketplaceCardListing {
  if (!record(value) || typeof value.reference !== "string" || typeof value.item_name !== "string") {
    throw new ApiResponseError("Marketplace response returned an invalid listing.", 502);
  }
  const priceMinor = typeof value.unit_price_minor === "number" ? value.unit_price_minor : 0;
  const location = typeof value.location === "string" ? value.location : [value.area, value.city, value.state].filter((part) => typeof part === "string" && part).join(", ");
  const media = Array.isArray(value.media) ? value.media as ListingMedia[] : [];
  const photo = media.find((item) => item.kind === "photo");
  return {
    code: value.reference,
    name: value.item_name,
    category: typeof value.category === "string" ? value.category : "Other",
    price: priceMinor / 100,
    quantity: typeof value.quantity === "number" ? value.quantity : undefined,
    location,
    condition: typeof value.condition === "string" ? value.condition : "Not stated",
    date: typeof value.created_at === "string" ? new Date(value.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short" }) : "",
    views: 0,
    mark: typeof value.category === "string" ? value.category.slice(0, 5).toUpperCase() : "ITEM",
    tone: "from-[#173d75] to-[#081a38]",
    featured: value.featured === true,
    market: typeof value.market_label === "string" ? value.market_label : undefined,
    deliveryMethod: typeof value.preferred_delivery_method === "string" ? value.preferred_delivery_method : undefined,
    imageUrl: photo ? `${getCustomerApiBaseUrl()}${photo.download_path}` : undefined,
    description: typeof value.description === "string" ? value.description : undefined,
    media,
  };
}

export async function fetchMarketplaceListings(filters: MarketplaceFilters = {}): Promise<MarketplacePage> {
  const query = new URLSearchParams({ page: String(filters.page || 1), page_size: String(filters.pageSize || 24) });
  const values: Record<string, string | undefined> = { query: filters.query, category: filters.category, route: filters.route, condition: filters.condition, location: filters.location, delivery_method: filters.deliveryMethod, minimum_price_minor: filters.minimumPriceMinor === undefined ? undefined : String(filters.minimumPriceMinor), maximum_price_minor: filters.maximumPriceMinor === undefined ? undefined : String(filters.maximumPriceMinor), featured: filters.featured ? "true" : undefined, sort: filters.sort || "newest" };
  Object.entries(values).forEach(([key, value]) => { if (value) query.set(key, value); });
  const response = await fetch(`${getCustomerApiBaseUrl()}/api/v1/marketplace/listings?${query.toString()}`, { signal: filters.signal, credentials: "include", headers: { Accept: "application/json" } });
  const payload = await responsePayload(response);
  if (!record(payload.data) || !Array.isArray(payload.data.items)) throw new ApiResponseError("Marketplace response returned an invalid page.", 502);
  return { ...(payload.data as Omit<MarketplacePage, "items">), items: payload.data.items.map(cardListing) };
}

export function fetchAllMarketplaceListings(filters: Omit<MarketplaceFilters, "page" | "pageSize"> = {}): Promise<MarketplaceCardListing[]> {
  return fetchAllPages(async (page, pageSize) => {
    const result = await fetchMarketplaceListings({ ...filters, page, pageSize });
    return { items: result.items, hasNext: result.has_next };
  }, 100);
}

export async function fetchMarketplaceListing(reference: string) {
  const response = await fetch(`${getCustomerApiBaseUrl()}/api/v1/marketplace/listings/${encodeURIComponent(reference)}`, { credentials: "include", headers: { Accept: "application/json" } });
  const payload = await responsePayload(response);
  return { raw: parseListing(payload.data), card: cardListing(payload.data) };
}

export async function reportMarketplaceListing(reference: string, reason: string, details: string) {
  const response = await apiFetch(`${getCustomerApiBaseUrl()}/api/v1/marketplace/listings/${encodeURIComponent(reference)}/reports`, { method: "POST", credentials: "include", headers: { Accept: "application/json", "Content-Type": "application/json" }, body: JSON.stringify({ reason, details }) }, { successMessage: "Listing report sent to Hollyway review." });
  const payload = await responsePayload(response);
  if (!record(payload.data) || typeof payload.data.id !== "string") throw new ApiResponseError("Listing report response was invalid.", 502);
  return payload.data as { id: string; status: string };
}

export function listingMediaUrl(media: ListingMedia) { return `${getCustomerApiBaseUrl()}${media.download_path}`; }
export function formatListingMoney(value: number | null) { return value === null ? "Not set" : `₦${(value / 100).toLocaleString("en-NG")}`; }
