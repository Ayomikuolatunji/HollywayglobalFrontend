import { responsePayload } from "../../../components/api/apiResponse";
import { getCustomerApiBaseUrl } from "../../../components/config/customerApi";

export const FEATURED_PACKAGE_IDS = ["none", "standard", "priority"] as const;
export type FeaturedPackageId = (typeof FEATURED_PACKAGE_IDS)[number];

export type PublicFeePolicy = {
  currency: "NGN";
  listing: { amount_minor: number; label: string };
  wanted_request: { amount_minor: number; renewal_amount_minor: number; duration_days: number };
  featured_packages: Array<{
    id: FeaturedPackageId;
    name: string;
    amount_minor: number;
    description: string;
  }>;
  escrow: {
    minimum_transaction_minor: number;
    bands: Array<{
      minimum_amount_minor: number;
      maximum_amount_minor: number | null;
      label: string;
      fee_min_minor: number;
      fee_max_minor: number | null;
      fee_rate_percentage?: number;
    }>;
  };
};

let feePolicyRequest: Promise<PublicFeePolicy> | null = null;

export function isFeaturedPackageId(value: string): value is FeaturedPackageId {
  return (FEATURED_PACKAGE_IDS as readonly string[]).includes(value);
}

export function fetchPublicFeePolicy(): Promise<PublicFeePolicy> {
  if (feePolicyRequest) return feePolicyRequest;
  feePolicyRequest = fetch(`${getCustomerApiBaseUrl()}/api/v1/public/fees`, {
    credentials: "include",
    headers: { Accept: "application/json" },
  })
    .then(responsePayload)
    .then((payload) => {
      if (!payload.data || typeof payload.data !== "object") {
        throw new Error("Hollyway fee policy response was invalid.");
      }
      return payload.data as PublicFeePolicy;
    })
    .catch((error) => {
      feePolicyRequest = null;
      throw error;
    });
  return feePolicyRequest;
}
