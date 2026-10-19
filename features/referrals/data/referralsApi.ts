import { fetchAllPages } from "../../../components/api/pagination";
import { getCustomerApiBaseUrl } from "../../../components/config/customerApi";

export type ReferralActivity = {
  id: string;
  status: "registered" | "active";
  joined_at: string;
};

export type ReferralSummary = {
  referral_code: string;
  referral_link: string;
  total_referrals: number;
  registered_referrals: number;
  successful_transactions: number;
  loyalty_discount_percentage: number;
  trust_badge: string | null;
  referrals: ReferralActivity[];
};

type ReferralPage = {
  items: ReferralActivity[];
  hasNext: boolean;
};

export class ReferralsApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ReferralsApiError";
    this.status = status;
  }
}

async function readResponse(response: Response) {
  const payload = (await response.json().catch(() => ({}))) as {
    detail?: unknown;
    data?: Record<string, unknown>;
  };
  if (!response.ok) {
    throw new ReferralsApiError(
      typeof payload.detail === "string"
        ? payload.detail
        : "Referral information could not be loaded.",
      response.status,
    );
  }
  return payload.data || {};
}

function activityList(value: unknown): ReferralActivity[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const record = item as Partial<ReferralActivity>;
    if (typeof record.id !== "string" || typeof record.joined_at !== "string") {
      return [];
    }
    return [
      {
        id: record.id,
        joined_at: record.joined_at,
        status: record.status === "active" ? "active" : "registered",
      },
    ];
  });
}

function referralPage(value: unknown): ReferralPage {
  if (Array.isArray(value)) {
    return { items: activityList(value), hasNext: false };
  }
  if (!value || typeof value !== "object") {
    return { items: [], hasNext: false };
  }
  const page = value as { items?: unknown; has_next?: unknown };
  return {
    items: activityList(page.items),
    hasNext: page.has_next === true,
  };
}

async function fetchReferralSummaryPage(
  page: number,
  pageSize: number,
  signal?: AbortSignal,
): Promise<{ summary: Omit<ReferralSummary, "referrals">; referrals: ReferralPage }> {
  const response = await fetch(
    `${getCustomerApiBaseUrl()}/api/v1/referrals?page=${page}&page_size=${pageSize}`,
    {
    credentials: "include",
    headers: { Accept: "application/json" },
    signal,
    },
  );
  const data = await readResponse(response);
  return {
    summary: {
      referral_code:
      typeof data.referral_code === "string" ? data.referral_code : "",
      referral_link: typeof data.referral_link === "string" ? data.referral_link : "",
      total_referrals:
      typeof data.total_referrals === "number" ? data.total_referrals : 0,
      registered_referrals:
      typeof data.registered_referrals === "number" ? data.registered_referrals : 0,
      successful_transactions:
      typeof data.successful_transactions === "number" ? data.successful_transactions : 0,
      loyalty_discount_percentage:
      typeof data.loyalty_discount_percentage === "number" ? data.loyalty_discount_percentage : 0,
      trust_badge: typeof data.trust_badge === "string" ? data.trust_badge : null,
    },
    referrals: referralPage(data.referrals),
  };
}

export async function fetchReferralSummary(signal?: AbortSignal): Promise<ReferralSummary> {
  const first = await fetchReferralSummaryPage(1, 100, signal);
  const referrals = await fetchAllPages(async (page, pageSize) => {
    if (page === 1) return first.referrals;
    return (await fetchReferralSummaryPage(page, pageSize, signal)).referrals;
  }, 100);
  return { ...first.summary, referrals };
}
