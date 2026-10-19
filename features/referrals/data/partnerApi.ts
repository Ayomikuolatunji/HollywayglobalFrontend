import { apiFetch } from "../../../components/api/apiFetch";
import { getCustomerApiBaseUrl } from "../../../components/config/customerApi";

export type ReferralPartnerStatus =
  | "draft"
  | "pending_review"
  | "approved"
  | "rejected"
  | "additional_review";

export type ReferralPartnerApplication = {
  id: string;
  status: ReferralPartnerStatus;
  status_label: string;
  tier: "bronze" | "silver" | "gold";
  city: string;
  state: string;
  earning_options: string[];
  settlement_bank_name: string | null;
  settlement_account_last4: string | null;
  resolved_account_name: string | null;
  account_match_percentage: number | null;
  consent: boolean;
  submitted_at: string | null;
  reviewed_at: string | null;
  admin_note: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
};

export type ReferralPartnerState = {
  application: ReferralPartnerApplication | null;
  referral_code: string;
};

export type ReferralPartnerInput = {
  action: "draft" | "submit";
  city: string;
  state: string;
  earning_options: string[];
  settlement_bank_name: string;
  settlement_account_number: string;
  consent: boolean;
};

async function read<T>(response: Response, fallback: string): Promise<T> {
  const payload = (await response.json().catch(() => ({}))) as {
    data?: T;
    detail?: unknown;
  };
  if (!response.ok) {
    throw new Error(typeof payload.detail === "string" ? payload.detail : fallback);
  }
  return payload.data as T;
}

export async function fetchReferralPartner(signal?: AbortSignal): Promise<ReferralPartnerState> {
  const response = await fetch(`${getCustomerApiBaseUrl()}/api/v1/referral-partner`, {
    credentials: "include",
    headers: { Accept: "application/json" },
    signal,
  });
  return read<ReferralPartnerState>(response, "Referral-partner information could not be loaded.");
}

export async function saveReferralPartner(input: ReferralPartnerInput): Promise<ReferralPartnerState> {
  const response = await apiFetch(
    `${getCustomerApiBaseUrl()}/api/v1/referral-partner`,
    {
      method: "POST",
      credentials: "include",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(input),
    },
    { successMessage: input.action === "draft" ? "Referral-partner draft saved." : "Partner application sent for review." },
  );
  const payload = (await response.json().catch(() => ({}))) as {
    data?: ReferralPartnerApplication;
    referral_code?: string;
    detail?: unknown;
  };
  if (!response.ok || !payload.data) {
    throw new Error(typeof payload.detail === "string" ? payload.detail : "Referral-partner application could not be saved.");
  }
  return { application: payload.data, referral_code: typeof payload.referral_code === "string" ? payload.referral_code : "" };
}
