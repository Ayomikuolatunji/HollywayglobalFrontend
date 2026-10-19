import { apiFetch } from "../../../components/api/apiFetch";
import { ApiResponseError, responsePayload } from "../../../components/api/apiResponse";
import { getCustomerApiBaseUrl } from "../../../components/config/customerApi";

export type CustomerNotification = { id: string; type: string; title: string; message: string; reference: string | null; read_at: string | null; created_at: string };
export type NotificationPage = { items: CustomerNotification[]; unread_count: number; page: number; page_size: number; total: number; total_pages: number; has_next: boolean; has_previous: boolean };

function record(value: unknown): value is Record<string, unknown> { return Boolean(value) && typeof value === "object"; }

export async function fetchNotifications(filter: "all" | "unread" | "read" = "all", page = 1): Promise<NotificationPage> {
  const query = new URLSearchParams({ page: String(page), page_size: "25" });
  if (filter !== "all") query.set("unread", filter === "unread" ? "true" : "false");
  const response = await fetch(`${getCustomerApiBaseUrl()}/api/v1/notifications?${query}`, { credentials: "include", headers: { Accept: "application/json" } });
  const payload = await responsePayload(response);
  if (!record(payload.data) || !Array.isArray(payload.data.items)) throw new ApiResponseError("Notifications response returned an invalid page.", 502);
  return payload.data as unknown as NotificationPage;
}

export async function markNotificationRead(id: string) {
  const response = await apiFetch(`${getCustomerApiBaseUrl()}/api/v1/notifications/${encodeURIComponent(id)}/read`, { method: "POST", credentials: "include", headers: { Accept: "application/json" } }, { notify: false });
  const payload = await responsePayload(response);
  return payload.data as CustomerNotification;
}

export async function markAllNotificationsRead() {
  const response = await apiFetch(`${getCustomerApiBaseUrl()}/api/v1/notifications/read-all`, { method: "POST", credentials: "include", headers: { Accept: "application/json" } }, { notify: false });
  await responsePayload(response);
}
