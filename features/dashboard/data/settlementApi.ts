import { apiFetch } from "../../../components/api/apiFetch";
import { getCustomerApiBaseUrl } from "../../../components/config/customerApi";
import { AccountApiError, responsePayload } from "./accountApi";

export type SettlementAccountVerificationInput = {
  bankName: string;
  accountNumber: string;
  businessName: string;
};

export type SettlementAccountVerification = {
  verified: true;
  bankName: string;
  accountName: string;
  matchPercentage: number;
};

export async function verifySettlementAccount(
  input: SettlementAccountVerificationInput,
): Promise<SettlementAccountVerification> {
  const response = await apiFetch(
    `${getCustomerApiBaseUrl()}/api/v1/business-upgrade/verify-settlement-account`,
    {
      method: "POST",
      credentials: "include",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        bank_name: input.bankName,
        account_number: input.accountNumber,
        business_name: input.businessName,
      }),
    },
    {
      successMessage: "Settlement account verified.",
      errorMessage: "Settlement account could not be verified. Check the details and try again.",
    },
  );
  const payload = await responsePayload(response);
  const data = (payload.data || {}) as Record<string, unknown>;
  if (
    data.verified !== true ||
    typeof data.bank_name !== "string" ||
    typeof data.account_name !== "string" ||
    typeof data.match_percentage !== "number"
  ) {
    throw new AccountApiError("Settlement account verification returned an invalid result.", 502);
  }
  return {
    verified: true,
    bankName: data.bank_name,
    accountName: data.account_name,
    matchPercentage: data.match_percentage,
  };
}
