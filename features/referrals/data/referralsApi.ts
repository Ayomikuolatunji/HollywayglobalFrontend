import { getCustomerApiBaseUrl } from "../../../components/config/customerApi";

export type ReferralActivity = {
  id: number;
  status: "registered" | "active";
  joined_at: string;
};

export type ReferralSummary = {
  referral_code: string;
  referral_link: string;
  total_referrals: number;
  registered_referrals: number;
  referrals: ReferralActivity[];
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
    data?: Partial<ReferralSummary>;
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
    if (typeof record.id !== "number" || typeof record.joined_at !== "string") {
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

export async function fetchReferralSummary(signal?: AbortSignal): Promise<ReferralSummary> {
  const response = await fetch(`${getCustomerApiBaseUrl()}/api/v1/referrals`, {
    credentials: "include",
    headers: { Accept: "application/json" },
    signal,
  });
  const data = await readResponse(response);
  return {
    referral_code:
      typeof data.referral_code === "string" ? data.referral_code : "",
    referral_link: typeof data.referral_link === "string" ? data.referral_link : "",
    total_referrals:
      typeof data.total_referrals === "number" ? data.total_referrals : 0,
    registered_referrals:
      typeof data.registered_referrals === "number" ? data.registered_referrals : 0,
    referrals: activityList(data.referrals),
  };
}
