import { apiFetch } from "../../../components/api/apiFetch";
import { ApiResponseError, responsePayload } from "../../../components/api/apiResponse";
import { getCustomerApiBaseUrl } from "../../../components/config/customerApi";

export type EscrowParticipant = {
  email: string;
  name: string;
  phone: string;
  identityVerified: boolean;
};

function participantFromData(data: Record<string, unknown>) {
  const participant = (data.participant || data) as Record<string, unknown>;
  if (
    typeof participant.email !== "string" ||
    typeof participant.name !== "string"
  ) {
    throw new ApiResponseError("Participant lookup returned an invalid result.", 502);
  }
  const phone = typeof participant.phone_e164 === "string"
    ? participant.phone_e164
    : typeof participant.phone === "string"
      ? participant.phone
      : "";
  return {
    email: participant.email,
    name: participant.name,
    phone,
    identityVerified: participant.identity_verified === true,
  } satisfies EscrowParticipant;
}

export async function fetchCurrentEscrowParticipant(): Promise<EscrowParticipant> {
  const response = await fetch(`${getCustomerApiBaseUrl()}/api/v1/account/profile`, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  const payload = await responsePayload(response);
  const participant = participantFromData((payload.data || {}) as Record<string, unknown>);
  try {
    const kycResponse = await fetch(`${getCustomerApiBaseUrl()}/api/v1/kyc/status`, {
      credentials: "include",
      headers: { Accept: "application/json" },
    });
    const kycPayload = await responsePayload(kycResponse);
    const kyc = (kycPayload.data || {}) as Record<string, unknown>;
    if (kyc.status === "approved") {
      const legalName = typeof kyc.legal_full_name === "string" ? kyc.legal_full_name : "";
      const phone = typeof kyc.phone_e164 === "string" ? kyc.phone_e164 : "";
      return {
        ...participant,
        name: legalName,
        phone,
        identityVerified: Boolean(legalName && phone),
      };
    }
  } catch {
    // Do not use a social sign-in name as an escrow identity fallback.
  }
  return { ...participant, name: "", phone: "", identityVerified: false };
}

export async function findEscrowParticipant(searchTerm: string): Promise<EscrowParticipant> {
  const response = await apiFetch(
    `${getCustomerApiBaseUrl()}/api/v1/escrow/participants/resolve`,
    {
      method: "POST",
      credentials: "include",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ participant_search: searchTerm.trim() }),
    },
    { notify: false },
  );
  const payload = await responsePayload(response);
  return participantFromData((payload.data || {}) as Record<string, unknown>);
}
