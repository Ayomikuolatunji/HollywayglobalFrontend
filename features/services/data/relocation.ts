import { apiFetch } from "../../../components/api/apiFetch";
import { ApiResponseError, responsePayload } from "../../../components/api/apiResponse";
import { fetchAllPages } from "../../../components/api/pagination";
import { getCustomerApiBaseUrl } from "../../../components/config/customerApi";

export const relocationApartmentSizes = [
  ["self_contained", "Self-contained"], ["two_bed", "2-bed"], ["three_bed", "3-bed"], ["duplex", "Duplex"], ["office", "Office"],
] as const;
export const relocationVehicleTypes = [
  ["minibus", "Minibus"], ["three_ton", "3-ton truck"], ["five_ton", "5-ton truck"], ["ten_ton_truck", "10-ton truck"],
] as const;
export type RelocationApartmentSize = (typeof relocationApartmentSizes)[number][0];
export type RelocationVehicleType = (typeof relocationVehicleTypes)[number][0];
export type RelocationStatus = "draft" | "pending_review" | "needs_information" | "quoting" | "quoted" | "quote_accepted" | "booked" | "confirmed" | "in_progress" | "completed" | "cancelled";
export type RelocationQuote = { id: string; carrier_name: string; service_label: string; amount_minor: number; estimated_days: number | null; details: string; status: string; created_at: string; updated_at: string };
export type RelocationStatusEvent = { id: string; from_status: string | null; to_status: string; to_status_label: string; actor_admin_email: string | null; reason: string | null; created_at: string };
export type RelocationRequest = {
  id: string; reference: string; status: RelocationStatus; status_label: string; full_name: string; phone_e164: string;
  pickup_address: string; destination_address: string; apartment_size: RelocationApartmentSize; apartment_size_label: string;
  floor_levels: string; vehicle_type: RelocationVehicleType; vehicle_type_label: string; loaders_packing: boolean;
  storage_required: boolean; storage_duration_days: number | null; bulky_items: string; moving_at: string | null;
  terms_accepted_at: string | null; vehicle_details: string | null; crew_details: string | null; tracking_reference: string | null;
  admin_note: string | null; quotes: RelocationQuote[]; status_events: RelocationStatusEvent[]; created_at: string; updated_at: string;
};
export type RelocationInput = {
  action: "draft" | "submit"; fullName: string; phoneE164: string; pickupAddress: string; destinationAddress: string;
  apartmentSize: RelocationApartmentSize; floorLevels: string; vehicleType: RelocationVehicleType; loadersPacking: boolean;
  storageRequired: boolean; storageDurationDays: number | null; bulkyItems: string; movingAt: string | null; termsAccepted: boolean;
};

function record(value: unknown): value is Record<string, unknown> { return Boolean(value) && typeof value === "object"; }
function parse(value: unknown): RelocationRequest {
  if (!record(value) || typeof value.id !== "string" || typeof value.reference !== "string") throw new ApiResponseError("Relocation response returned an invalid request.", 502);
  return {
    ...(value as RelocationRequest),
    quotes: Array.isArray(value.quotes) ? value.quotes as RelocationQuote[] : [],
    status_events: Array.isArray(value.status_events) ? value.status_events as RelocationStatusEvent[] : [],
  };
}
async function read(response: Response) { const payload = await responsePayload(response); return parse(payload.data); }
function body(input: RelocationInput) {
  return {
    action: input.action, full_name: input.fullName, phone_e164: input.phoneE164, pickup_address: input.pickupAddress,
    destination_address: input.destinationAddress, apartment_size: input.apartmentSize, floor_levels: input.floorLevels,
    vehicle_type: input.vehicleType, loaders_packing: input.loadersPacking, storage_required: input.storageRequired,
    storage_duration_days: input.storageDurationDays, bulky_items: input.bulkyItems, moving_at: input.movingAt,
    terms_accepted: input.termsAccepted,
  };
}
export async function saveRelocation(input: RelocationInput, reference?: string) {
  const endpoint = `${getCustomerApiBaseUrl()}/api/v1/relocations${reference ? `/${encodeURIComponent(reference)}` : ""}`;
  const response = await apiFetch(endpoint, { method: reference ? "PATCH" : "POST", credentials: "include", headers: { Accept: "application/json", "Content-Type": "application/json" }, body: JSON.stringify(body(input)) }, { successMessage: input.action === "draft" ? "Relocation Draft saved." : "Relocation request submitted." });
  return read(response);
}
export async function fetchRelocations() {
  return fetchAllPages(async (page, pageSize) => {
    const response = await fetch(`${getCustomerApiBaseUrl()}/api/v1/relocations?page=${page}&page_size=${pageSize}`, { credentials: "include", headers: { Accept: "application/json" } });
    const payload = await responsePayload(response);
    const data = record(payload.data) ? payload.data : {};
    const items = Array.isArray(data.items) ? data.items.map(parse) : [];
    return { items, hasNext: data.has_next === true };
  });
}
export async function fetchRelocation(reference: string) { return read(await fetch(`${getCustomerApiBaseUrl()}/api/v1/relocations/${encodeURIComponent(reference)}`, { credentials: "include", headers: { Accept: "application/json" } })); }
export async function acceptRelocationQuote(reference: string, quoteId: string) {
  const response = await apiFetch(`${getCustomerApiBaseUrl()}/api/v1/relocations/${encodeURIComponent(reference)}/accept-quote`, { method: "POST", credentials: "include", headers: { Accept: "application/json", "Content-Type": "application/json" }, body: JSON.stringify({ quote_id: quoteId }) }, { successMessage: "Relocation quotation accepted." });
  return read(response);
}
export function formatRelocationMoney(value: number | null) { return value === null ? "Not set" : `₦${(value / 100).toLocaleString("en-NG")}`; }
