import { apiFetch } from "../../../components/api/apiFetch";
import { ApiResponseError, responsePayload } from "../../../components/api/apiResponse";
import { getCustomerApiBaseUrl } from "../../../components/config/customerApi";

export type PublicTestimonial = {
  id: string;
  category: string;
  headline: string;
  quote: string;
  display_name: string;
  business_name: string | null;
  city: string | null;
  published_at: string | null;
};

export type CustomerTestimonial = PublicTestimonial & {
  status: "pending" | "approved" | "rejected";
  admin_note: string | null;
  created_at: string;
  updated_at: string;
};

export type TestimonialPage<T> = {
  items: T[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
};

export const testimonialCategories = [
  { value: "marketplace", label: "Marketplace" },
  { value: "escrow", label: "Escrow" },
  { value: "logistics", label: "Deliveries" },
  { value: "professional", label: "Professional services" },
  { value: "events", label: "Events" },
  { value: "relocation", label: "Relocations" },
  { value: "other", label: "Another Hollyway experience" },
] as const;

function record(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

function page<T>(value: unknown, parse: (item: unknown) => T): TestimonialPage<T> {
  if (!record(value) || !Array.isArray(value.items)) {
    throw new ApiResponseError("Testimonial response returned an invalid page.", 502);
  }
  return {
    items: value.items.map(parse),
    page: Number(value.page || 1),
    page_size: Number(value.page_size || 12),
    total: Number(value.total || 0),
    total_pages: Number(value.total_pages || 0),
    has_next: value.has_next === true,
    has_previous: value.has_previous === true,
  };
}

function parsePublic(value: unknown): PublicTestimonial {
  if (!record(value) || typeof value.id !== "string") {
    throw new ApiResponseError("Testimonial response returned an invalid record.", 502);
  }
  return {
    id: value.id,
    category: String(value.category || "other"),
    headline: String(value.headline || ""),
    quote: String(value.quote || ""),
    display_name: String(value.display_name || "Verified Hollyway customer"),
    business_name: typeof value.business_name === "string" ? value.business_name : null,
    city: typeof value.city === "string" ? value.city : null,
    published_at: typeof value.published_at === "string" ? value.published_at : null,
  };
}

function parseCustomer(value: unknown): CustomerTestimonial {
  const parsed = parsePublic(value);
  if (!record(value)) throw new ApiResponseError("Testimonial response returned an invalid record.", 502);
  return {
    ...parsed,
    status: value.status === "approved" || value.status === "rejected" ? value.status : "pending",
    admin_note: typeof value.admin_note === "string" ? value.admin_note : null,
    created_at: String(value.created_at || ""),
    updated_at: String(value.updated_at || ""),
  };
}

export async function fetchPublicTestimonials(signal?: AbortSignal) {
  const response = await fetch(`${getCustomerApiBaseUrl()}/api/v1/content/testimonials?page_size=24`, {
    signal,
    headers: { Accept: "application/json" },
  });
  const payload = await responsePayload(response);
  return page(payload.data, parsePublic);
}

export async function fetchMyTestimonials(signal?: AbortSignal) {
  const response = await fetch(`${getCustomerApiBaseUrl()}/api/v1/testimonials/mine`, {
    signal,
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  const payload = await responsePayload(response);
  return page(payload.data, parseCustomer);
}

export async function submitTestimonial(input: {
  category: string;
  headline: string;
  quote: string;
  display_name: string;
  business_name: string;
  city: string;
  consent: boolean;
}) {
  const response = await apiFetch(
    `${getCustomerApiBaseUrl()}/api/v1/testimonials`,
    {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(input),
    },
    { successMessage: "Your testimonial was sent for review." },
  );
  const payload = await responsePayload(response);
  return parseCustomer(payload.data);
}
