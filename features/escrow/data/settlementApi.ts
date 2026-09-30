import { apiFetch } from "../../../components/api/apiFetch";
import { ApiResponseError, responsePayload } from "../../../components/api/apiResponse";
import { getCustomerApiBaseUrl } from "../../../components/config/customerApi";

export type SellerSettlementVerification = {
  verified: true;
  bankName: string;
  accountName: string;
  matchPercentage: number;
};

export async function verifySellerSettlementAccount(input: {
  sellerEmail: string;
  sellerName: string;
  sellerPhone: string;
  bankName: string;
  accountNumber: string;
}): Promise<SellerSettlementVerification> {
  const response = await apiFetch(
    `${getCustomerApiBaseUrl()}/api/v1/escrow/verify-seller-account`,
    {
      method: "POST",
      credentials: "include",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        seller_email: input.sellerEmail,
        seller_name: input.sellerName,
        seller_phone_e164: input.sellerPhone.replace(/[\s()\-]/g, ""),
        bank_name: input.bankName,
        account_number: input.accountNumber.replace(/\D/g, ""),
      }),
    },
    {
      successMessage: "Seller settlement account verified.",
      errorMessage: "Seller settlement details could not be verified. Check the seller account and try again.",
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
    throw new ApiResponseError("Seller settlement verification returned an invalid result.", 502);
  }
  return {
    verified: true,
    bankName: data.bank_name,
    accountName: data.account_name,
    matchPercentage: data.match_percentage,
  };
}
