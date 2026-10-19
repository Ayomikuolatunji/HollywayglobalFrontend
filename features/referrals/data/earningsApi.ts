import { getCustomerApiBaseUrl } from "../../../components/config/customerApi";
import { fetchAllPages } from "../../../components/api/pagination";

export type ReferralEarning = {
  id: string;
  source_type: string;
  source_id: string;
  earning_type: string;
  amount_minor: number;
  status: "earned" | "reversed";
  description: string;
  created_at: string;
  reversed_at: string | null;
};

export type ReferralEarningsPage = {
  items: ReferralEarning[];
  total_earned_minor: number;
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
};

async function fetchPage(page: number, pageSize: number, signal?: AbortSignal): Promise<ReferralEarningsPage> {
  const response = await fetch(`${getCustomerApiBaseUrl()}/api/v1/referral-earnings?page=${page}&page_size=${pageSize}`, {
    credentials: "include",
    headers: { Accept: "application/json" },
    signal,
  });
  const payload = (await response.json().catch(() => ({}))) as { data?: ReferralEarningsPage; detail?: unknown };
  if (!response.ok || !payload.data) throw new Error(typeof payload.detail === "string" ? payload.detail : "Referral earnings could not be loaded.");
  return payload.data;
}

export async function fetchReferralEarnings(signal?: AbortSignal): Promise<ReferralEarningsPage> {
  const first = await fetchPage(1, 100, signal);
  const items = await fetchAllPages(async (page, pageSize) => {
    const result = page === 1 ? first : await fetchPage(page, pageSize, signal);
    return { items: result.items, hasNext: result.has_next };
  }, 100);
  return { ...first, items, page: 1, page_size: items.length || 100, total: items.length, total_pages: items.length ? 1 : 0, has_next: false, has_previous: false };
}
