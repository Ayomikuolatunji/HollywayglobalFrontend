import { apiFetch } from "../../../components/api/apiFetch";
import { ApiResponseError, responsePayload } from "../../../components/api/apiResponse";
import { fetchAllPages } from "../../../components/api/pagination";
import { getCustomerApiBaseUrl } from "../../../components/config/customerApi";

export const professionalCategories = [
  ["cleaning", "Cleaning"],
  ["electrical", "Electrical"],
  ["plumbing", "Plumbing"],
  ["carpentry", "Carpentry"],
  ["ac", "AC"],
  ["tiling", "Tiling"],
  ["painting", "Painting"],
  ["solar", "Solar"],
  ["generator", "Generator"],
  ["decor", "Decor"],
] as const;

export type ProfessionalCategory = (typeof professionalCategories)[number][0];
export type ProfessionalStatus = "draft" | "pending_review" | "needs_information" | "matching" | "quotes_ready" | "quote_accepted" | "payment_pending" | "booked" | "in_progress" | "completed" | "cancelled";
export type ProfessionalRequest = {
  id: string;
  reference: string;
  status: ProfessionalStatus;
  status_label: string;
  client_full_name: string;
  client_phone_e164: string;
  category: ProfessionalCategory | null;
  category_label: string;
  service_street: string;
  service_area: string;
  service_city: string;
  service_state: string;
  task_description: string;
  move_in_status: string;
  move_in_status_label: string;
  materials_arrangement: string;
  materials_arrangement_label: string;
  preferred_at: string | null;
  target_budget_minor: number | null;
  terms_accepted_at: string | null;
  escrow_reference: string | null;
  admin_note: string | null;
  quotes: ProfessionalQuote[];
  status_events: ProfessionalStatusEvent[];
  review: { id: string; rating: number; comment: string; created_at: string } | null;
  created_at: string;
  updated_at: string;
};
export type ProfessionalQuote = { id: string; provider_id: string | null; provider_name: string; provider_phone_e164: string; amount_minor: number; details: string; status: string; created_at: string; updated_at: string };
export type ProfessionalStatusEvent = { id: string; from_status: string | null; to_status: string; to_status_label: string; actor_admin_email: string | null; reason: string | null; created_at: string };
export type ProfessionalRequestInput = {
  action: "draft" | "submit";
  clientFullName: string;
  clientPhoneE164: string;
  category: ProfessionalCategory | "";
  serviceStreet: string;
  serviceArea: string;
  serviceCity: string;
  serviceState: string;
  taskDescription: string;
  moveInStatus: "new_move_in" | "occupied";
  materialsArrangement: "client_supplies" | "artisan_supplies_all";
  preferredAt: string | null;
  targetBudgetMinor: number | null;
  termsAccepted: boolean;
};
export type ProfessionalProvider = {
  id: string;
  status: string;
  status_label: string;
  display_name: string;
  trade_specialization: string;
  whatsapp_phone_e164: string;
  base_address: string;
  coverage: string;
  years_experience: number;
  reference_one: string;
  reference_two: string;
  settlement_bank_name: string;
  settlement_account_last4: string;
  settlement_account_match_percentage: number | null;
  rating_average: number | null;
  review_count: number;
  portfolio: Array<{ id: string; name: string; mime_type: string; byte_size: number; created_at: string }>;
  rejection_reason: string | null;
  submitted_at: string | null;
  created_at: string;
  updated_at: string;
};
export type ProfessionalProviderInput = {
  action: "draft" | "submit";
  displayName: string;
  tradeSpecialization: string;
  whatsappPhoneE164: string;
  baseAddress: string;
  coverage: string;
  yearsExperience: number;
  referenceOne: string;
  referenceTwo: string;
  settlementBankName: string;
  settlementAccountNumber: string;
  termsAccepted: boolean;
  portfolio: File[];
};
export type ProfessionalProviderJob = ProfessionalRequest & { quotes: ProfessionalQuote[] };
export type ProfessionalDirectoryPortfolio = {
  id: string;
  name: string;
  mime_type: string;
  byte_size: number;
  created_at: string;
  download_path: string;
};
export type ProfessionalDirectoryProvider = {
  id: string;
  status: "approved";
  status_label: string;
  display_name: string;
  trade_specialization: string;
  base_address: string;
  coverage: string;
  years_experience: number;
  portfolio: ProfessionalDirectoryPortfolio[];
  rating_average: number | null;
  review_count: number;
};
export type ProfessionalDirectoryPage = {
  items: ProfessionalDirectoryProvider[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
};

function record(value: unknown): value is Record<string, unknown> { return Boolean(value) && typeof value === "object"; }
function parseRequest(value: unknown): ProfessionalRequest {
  if (!record(value) || typeof value.id !== "string" || typeof value.reference !== "string") throw new ApiResponseError("Professional request returned an invalid response.", 502);
  return { ...(value as ProfessionalRequest), quotes: Array.isArray(value.quotes) ? value.quotes as ProfessionalQuote[] : [], status_events: Array.isArray(value.status_events) ? value.status_events as ProfessionalStatusEvent[] : [] };
}
function parseProvider(value: unknown): ProfessionalProvider {
  if (!record(value) || typeof value.id !== "string") throw new ApiResponseError("Professional provider returned an invalid response.", 502);
  return { ...(value as ProfessionalProvider), portfolio: Array.isArray(value.portfolio) ? value.portfolio as ProfessionalProvider["portfolio"] : [] };
}
function parseDirectoryProvider(value: unknown): ProfessionalDirectoryProvider {
  if (!record(value) || typeof value.id !== "string" || typeof value.display_name !== "string") {
    throw new ApiResponseError("Professional directory returned an invalid provider.", 502);
  }
  const portfolio = Array.isArray(value.portfolio) ? value.portfolio : [];
  return {
    ...(value as ProfessionalDirectoryProvider),
    portfolio: portfolio.flatMap((item) => {
      if (!record(item) || typeof item.id !== "string" || typeof item.download_path !== "string") return [];
      return [item as unknown as ProfessionalDirectoryPortfolio];
    }),
  };
}
async function readRequest(response: Response) { const payload = await responsePayload(response); return parseRequest(payload.data); }
function requestBody(input: ProfessionalRequestInput) {
  return { action: input.action, client_full_name: input.clientFullName, client_phone_e164: input.clientPhoneE164, category: input.category, service_street: input.serviceStreet, service_area: input.serviceArea, service_city: input.serviceCity, service_state: input.serviceState, task_description: input.taskDescription, move_in_status: input.moveInStatus, materials_arrangement: input.materialsArrangement, preferred_at: input.preferredAt, target_budget_minor: input.targetBudgetMinor, terms_accepted: input.termsAccepted };
}

export async function saveProfessionalRequest(input: ProfessionalRequestInput, reference?: string) {
  const endpoint = `${getCustomerApiBaseUrl()}/api/v1/professional/requests${reference ? `/${encodeURIComponent(reference)}` : ""}`;
  const response = await apiFetch(endpoint, { method: reference ? "PATCH" : "POST", credentials: "include", headers: { Accept: "application/json", "Content-Type": "application/json" }, body: JSON.stringify(requestBody(input)) }, { successMessage: input.action === "draft" ? "Professional Draft saved." : "Professional request submitted." });
  return readRequest(response);
}
export async function fetchProfessionalRequests() {
  return fetchAllPages(async (page, pageSize) => {
    const response = await fetch(`${getCustomerApiBaseUrl()}/api/v1/professional/requests?page=${page}&page_size=${pageSize}`, { credentials: "include", headers: { Accept: "application/json" } });
    const payload = await responsePayload(response);
    const data = record(payload.data) ? payload.data : {};
    const items = Array.isArray(data.items) ? data.items.map(parseRequest) : [];
    return { items, hasNext: data.has_next === true };
  });
}
export async function fetchProfessionalRequest(reference: string) { return readRequest(await fetch(`${getCustomerApiBaseUrl()}/api/v1/professional/requests/${encodeURIComponent(reference)}`, { credentials: "include", headers: { Accept: "application/json" } })); }
export async function acceptProfessionalQuote(reference: string, quoteId: string) {
  const response = await apiFetch(`${getCustomerApiBaseUrl()}/api/v1/professional/requests/${encodeURIComponent(reference)}/accept-quote`, { method: "POST", credentials: "include", headers: { Accept: "application/json", "Content-Type": "application/json" }, body: JSON.stringify({ quote_id: quoteId }) }, { successMessage: "Professional quotation accepted." });
  return readRequest(response);
}
export async function reviewProfessionalRequest(reference: string, rating: number, comment: string) {
  const response = await apiFetch(`${getCustomerApiBaseUrl()}/api/v1/professional/requests/${encodeURIComponent(reference)}/review`, { method: "POST", credentials: "include", headers: { Accept: "application/json", "Content-Type": "application/json" }, body: JSON.stringify({ rating, comment }) }, { successMessage: "Professional review saved." });
  return readRequest(response);
}
export async function fetchProfessionalProvider() {
  const response = await fetch(`${getCustomerApiBaseUrl()}/api/v1/professional/providers/me`, { credentials: "include", headers: { Accept: "application/json" } });
  const payload = await responsePayload(response);
  return record(payload.data) && typeof payload.data.id === "string" ? parseProvider(payload.data) : null;
}
export async function fetchProfessionalDirectory(filters: { query?: string; trade?: string; location?: string; page?: number; pageSize?: number } = {}) {
  const params = new URLSearchParams({ page: String(filters.page || 1), page_size: String(filters.pageSize || 12) });
  if (filters.query?.trim()) params.set("query", filters.query.trim());
  if (filters.trade?.trim()) params.set("trade", filters.trade.trim());
  if (filters.location?.trim()) params.set("location", filters.location.trim());
  const response = await fetch(`${getCustomerApiBaseUrl()}/api/v1/professional/providers?${params.toString()}`, { headers: { Accept: "application/json" } });
  const payload = await responsePayload(response);
  if (!record(payload.data) || !Array.isArray(payload.data.items)) throw new ApiResponseError("Professional directory returned an invalid page.", 502);
  return { ...(payload.data as Omit<ProfessionalDirectoryPage, "items">), items: payload.data.items.map(parseDirectoryProvider) };
}
export function professionalPortfolioUrl(item: ProfessionalDirectoryPortfolio) {
  return `${getCustomerApiBaseUrl()}${item.download_path}`;
}
export async function fetchProfessionalProviderJobs() {
  return fetchAllPages(async (page, pageSize) => {
    const response = await fetch(`${getCustomerApiBaseUrl()}/api/v1/professional/provider/jobs?page=${page}&page_size=${pageSize}`, { credentials: "include", headers: { Accept: "application/json" } });
    const payload = await responsePayload(response);
    const data = record(payload.data) ? payload.data : {};
    const items = Array.isArray(data.items) ? data.items.map(parseRequest) : [];
    return { items, hasNext: data.has_next === true };
  }) as Promise<ProfessionalProviderJob[]>;
}
export async function submitProfessionalProviderQuote(reference: string, amountMinor: number, details: string) {
  const response = await apiFetch(`${getCustomerApiBaseUrl()}/api/v1/professional/provider/jobs/${encodeURIComponent(reference)}/quote`, { method: "POST", credentials: "include", headers: { Accept: "application/json", "Content-Type": "application/json" }, body: JSON.stringify({ amount_minor: amountMinor, details }) }, { successMessage: "Professional quotation submitted." });
  const payload = await responsePayload(response);
  return parseRequest(payload.data);
}
export async function saveProfessionalProvider(input: ProfessionalProviderInput) {
  const data = new FormData();
  data.set("action", input.action); data.set("display_name", input.displayName); data.set("trade_specialization", input.tradeSpecialization); data.set("whatsapp_phone_e164", input.whatsappPhoneE164); data.set("base_address", input.baseAddress); data.set("coverage", input.coverage); data.set("years_experience", String(input.yearsExperience)); data.set("reference_one", input.referenceOne); data.set("reference_two", input.referenceTwo); data.set("settlement_bank_name", input.settlementBankName); data.set("settlement_account_number", input.settlementAccountNumber); data.set("terms_accepted", String(input.termsAccepted)); input.portfolio.forEach((file) => data.append("portfolio", file));
  const response = await apiFetch(`${getCustomerApiBaseUrl()}/api/v1/professional/providers`, { method: "POST", credentials: "include", headers: { Accept: "application/json" }, body: data }, { successMessage: input.action === "draft" ? "Service-giver Draft saved." : "Service-giver registration submitted." });
  const payload = await responsePayload(response);
  return parseProvider(payload.data);
}
