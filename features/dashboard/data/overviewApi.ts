import { ApiResponseError, responsePayload } from "../../../components/api/apiResponse";
import { getCustomerApiBaseUrl } from "../../../components/config/customerApi";

export type DashboardActivity = {
  type: string; reference: string; title: string; status: string; status_label: string; updated_at: string; href: string;
};
export type DashboardOverview = {
  counts: { active_listings: number; open_requests: number; orders: number; sales: number; escrow: number; service_requests: number; unread_notifications: number };
  recent_activity: DashboardActivity[];
};

export async function fetchDashboardOverview(): Promise<DashboardOverview> {
  const response = await fetch(`${getCustomerApiBaseUrl()}/api/v1/dashboard/overview`, { credentials: "include", headers: { Accept: "application/json" } });
  const payload = await responsePayload(response);
  if (!payload.data || typeof payload.data !== "object" || !("counts" in payload.data) || !("recent_activity" in payload.data)) throw new ApiResponseError("Dashboard overview response was invalid.", 502);
  return payload.data as DashboardOverview;
}
