import { getCustomerApiBaseUrl } from "../../../components/config/customerApi";
import type { KycServerStatus } from "./kyc";

export type KycServerSubmission = {
  id?: number;
  status: KycServerStatus;
  status_label?: string;
  legal_full_name?: string;
  date_of_birth?: string;
  phone_e164?: string;
  country_code?: string;
  identity_type?: string;
  identity_last4?: string;
  provider?: string;
  provider_status?: string;
  liveness_passed?: boolean;
  selfie_match?: boolean;
  selfie_confidence?: number;
  document_type?: string;
  document_name?: string;
  rejection_reason?: string | null;
  submitted_at?: string;
  updated_at?: string;
};

export class KycApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "KycApiError";
    this.status = status;
  }
}

function isServerStatus(value: unknown): value is KycServerStatus {
  return ["not_submitted", "pending_review", "approved", "rejected", "additional_review"].includes(String(value));
}

async function responsePayload(response: Response) {
  const payload = (await response.json().catch(() => ({}))) as { detail?: unknown } & Record<string, unknown>;
  if (response.ok) return payload;
  const detail = payload.detail;
  const message = Array.isArray(detail)
    ? detail.map((item) => (item && typeof item === "object" && "msg" in item ? String(item.msg) : "")).filter(Boolean)[0]
    : typeof detail === "string" ? detail : "KYC request could not be completed.";
  throw new KycApiError(message, response.status);
}

export async function fetchKycStatus(signal?: AbortSignal): Promise<KycServerSubmission> {
  const response = await fetch(`${getCustomerApiBaseUrl()}/api/v1/kyc/status`, {
    credentials: "include",
    headers: { Accept: "application/json" },
    signal,
  });
  const payload = await responsePayload(response);
  const data = (payload.data || {}) as Partial<KycServerSubmission>;
  return {
    ...data,
    status: isServerStatus(data.status) ? data.status : "not_submitted",
  };
}

export async function verifyKyc(input: {
  identityType: string;
  identityNumber: string;
  selfie: File;
}) {
  const form = new FormData();
  form.set("identity_type", input.identityType);
  form.set("identity_number", input.identityNumber);
  form.set("file", input.selfie, input.selfie.name);

  const response = await fetch(`${getCustomerApiBaseUrl()}/api/v1/kyc/verify`, {
    method: "POST",
    credentials: "include",
    body: form,
  });
  const payload = await responsePayload(response);
  const data = (payload.data || {}) as { message?: unknown; submission?: Partial<KycServerSubmission> };
  const submission = data.submission || { status: "pending_review" as const };
  return {
    message: typeof data.message === "string" ? data.message : "Your KYC submission was received.",
    submission: {
      ...submission,
      status: isServerStatus(submission.status) ? submission.status : "pending_review",
    } as KycServerSubmission,
  };
}
