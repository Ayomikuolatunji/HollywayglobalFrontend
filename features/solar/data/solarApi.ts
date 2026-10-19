import { responsePayload } from "../../../components/api/apiResponse";
import { apiFetch } from "../../../components/api/apiFetch";
import { getCustomerApiBaseUrl } from "../../../components/config/customerApi";

export type SolarPackage = {
  id: string;
  package_key: string;
  tier_label: string;
  name: string;
  summary: string;
  price_min_minor: number;
  price_max_minor: number | null;
  price_label: string;
  inverter: string;
  battery: string;
  panels: string;
  best_for: string[];
  included_items: string[];
  load_notes: string[];
  warranty_notes: string[];
  status: "draft" | "published" | "archived";
  sort_order: number;
};

export type SolarLead = {
  id: string;
  reference: string;
  name: string;
  whatsapp_e164: string;
  location: string;
  property_type: string;
  energy_focus: string;
  appliances: string[];
  inverter_need: string;
  selected_package_key: string | null;
  recommendation_key: string;
  recommendation_reason: string;
  source: "public" | "dashboard";
  status: string;
  admin_note: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
  whatsapp_url: string | null;
  status_events?: Array<{
    id: string;
    from_status: string | null;
    to_status: string;
    actor_admin_email: string | null;
    created_at: string;
  }>;
};

export type SolarLeadInput = Omit<SolarLead, "id" | "reference" | "recommendation_key" | "recommendation_reason" | "status" | "admin_note" | "reviewed_at" | "created_at" | "updated_at" | "whatsapp_url">;

export async function fetchSolarPackages(signal?: AbortSignal): Promise<SolarPackage[]> {
  const response = await fetch(`${getCustomerApiBaseUrl()}/api/v1/solar/packages`, { credentials: "include", headers: { Accept: "application/json" }, signal });
  const payload = await responsePayload(response);
  return Array.isArray(payload.data) ? payload.data as SolarPackage[] : [];
}

export async function submitSolarLead(input: SolarLeadInput): Promise<SolarLead> {
  const response = await apiFetch(
    `${getCustomerApiBaseUrl()}/api/v1/solar/leads`,
    { method: "POST", credentials: "include", headers: { Accept: "application/json" }, body: JSON.stringify(input) },
    { successMessage: "Solar enquiry saved. Hollyway will confirm the next step." },
  );
  const payload = await responsePayload(response);
  return payload.data as SolarLead;
}

export async function fetchMySolarLeads(signal?: AbortSignal): Promise<SolarLead[]> {
  const response = await fetch(`${getCustomerApiBaseUrl()}/api/v1/solar/leads/mine?page=1&page_size=100`, { credentials: "include", headers: { Accept: "application/json" }, signal });
  const payload = await responsePayload(response);
  const data = payload.data && typeof payload.data === "object" ? payload.data as { items?: SolarLead[] } : {};
  return Array.isArray(data.items) ? data.items : [];
}

export function packageByKey(packages: SolarPackage[], key: string) {
  return packages.find((item) => item.package_key === key);
}
