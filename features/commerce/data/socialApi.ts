import { apiFetch } from "../../../components/api/apiFetch";
import { ApiResponseError, responsePayload } from "../../../components/api/apiResponse";
import { getCustomerApiBaseUrl } from "../../../components/config/customerApi";
import { fetchAllPages } from "../../../components/api/pagination";

export type SocialPlatform = "whatsapp" | "facebook" | "instagram" | "x" | "linkedin" | "tiktok";
export type SocialPublishRequest = {
  id: string;
  reference: string;
  listing_reference: string;
  listing_name: string;
  platforms: SocialPlatform[];
  caption: string;
  scheduled_for: string | null;
  status: "pending_approval" | "approved" | "scheduled" | "publishing" | "published" | "failed" | "rejected" | "cancelled";
  admin_note: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type SocialPublishPage = {
  items: SocialPublishRequest[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
};

export const socialPlatformOptions: Array<{ value: SocialPlatform; label: string }> = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "x", label: "X" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "tiktok", label: "TikTok" },
];

function record(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

function parse(value: unknown): SocialPublishRequest {
  if (!record(value) || typeof value.id !== "string" || typeof value.reference !== "string") {
    throw new ApiResponseError("Social publishing response was invalid.", 502);
  }
  return {
    id: value.id,
    reference: value.reference,
    listing_reference: String(value.listing_reference || ""),
    listing_name: String(value.listing_name || "Listing"),
    platforms: Array.isArray(value.platforms) ? value.platforms as SocialPlatform[] : [],
    caption: String(value.caption || ""),
    scheduled_for: typeof value.scheduled_for === "string" ? value.scheduled_for : null,
    status: ["approved", "scheduled", "publishing", "published", "failed", "rejected", "cancelled"].includes(String(value.status)) ? value.status as SocialPublishRequest["status"] : "pending_approval",
    admin_note: typeof value.admin_note === "string" ? value.admin_note : null,
    published_at: typeof value.published_at === "string" ? value.published_at : null,
    created_at: String(value.created_at || ""),
    updated_at: String(value.updated_at || ""),
  };
}

export async function submitSocialPublishRequest(reference: string, input: { platforms: SocialPlatform[]; caption: string; scheduled_for?: string }) {
  const response = await apiFetch(
    `${getCustomerApiBaseUrl()}/api/v1/listings/${encodeURIComponent(reference)}/social-publish`,
    { method: "POST", credentials: "include", body: JSON.stringify(input) },
    { successMessage: "Social publishing request sent for review." },
  );
  const payload = await responsePayload(response);
  return parse(payload.data);
}

export async function fetchSocialPublishRequests(page = 1, pageSize = 25): Promise<SocialPublishPage> {
  const response = await fetch(`${getCustomerApiBaseUrl()}/api/v1/social-publish-requests?page=${page}&page_size=${pageSize}`, { credentials: "include", headers: { Accept: "application/json" } });
  const payload = await responsePayload(response);
  if (!record(payload.data) || !Array.isArray(payload.data.items)) throw new ApiResponseError("Social publishing response was invalid.", 502);
  const data = payload.data as Record<string, unknown>;
  return {
    items: payload.data.items.map(parse),
    page: Number(data.page || page),
    page_size: Number(data.page_size || pageSize),
    total: Number(data.total || 0),
    total_pages: Number(data.total_pages || 0),
    has_next: Boolean(data.has_next),
    has_previous: Boolean(data.has_previous),
  };
}

export async function fetchAllSocialPublishRequests() {
  return fetchAllPages(async (page, pageSize) => {
    const result = await fetchSocialPublishRequests(page, pageSize);
    return { items: result.items, hasNext: Boolean(result.has_next) };
  });
}
