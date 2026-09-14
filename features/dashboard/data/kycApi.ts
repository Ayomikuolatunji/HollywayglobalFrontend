import { getCustomerApiBaseUrl } from "../../../components/config/customerApi";
import type { KycServerStatus } from "./kyc";

const minimumSelfieConfidence = 70;

export type KycServerSubmission = {
  id?: string;
  user_id?: string;
  status: KycServerStatus;
  status_label?: string;
  legal_full_name?: string;
  date_of_birth?: string;
  phone_e164?: string;
  country_code?: string;
  identity_type?: string;
  identity_last4?: string;
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
  submission: KycServerSubmission | null;

  constructor(message: string, status: number, submission: KycServerSubmission | null = null) {
    super(message);
    this.name = "KycApiError";
    this.status = status;
    this.submission = submission;
  }
}

function normalizeServerStatus(value: unknown): KycServerStatus {
  if (value === "approved" || value === "pending_review") return "approved";
  if (value === "rejected" || value === "additional_review") return "rejected";
  return "not_submitted";
}

async function responsePayload(response: Response) {
  const payload = (await response.json().catch(() => ({}))) as { detail?: unknown } & Record<string, unknown>;
  if (response.ok) return payload;
  const data = payload.data && typeof payload.data === "object" && !Array.isArray(payload.data)
    ? payload.data as Record<string, unknown>
    : {};
  const rawSubmission = data.submission && typeof data.submission === "object" && !Array.isArray(data.submission)
    ? data.submission as Partial<KycServerSubmission>
    : null;
  const submission = rawSubmission
    ? { ...rawSubmission, status: normalizeServerStatus(rawSubmission.status) } as KycServerSubmission
    : null;
  const detail = payload.detail;
  const message = Array.isArray(detail)
    ? detail.map((item) => (item && typeof item === "object" && "msg" in item ? String(item.msg) : "")).filter(Boolean)[0]
    : typeof detail === "string" ? detail
    : typeof data.message === "string" ? data.message
    : "KYC request could not be completed.";
  throw new KycApiError(message, response.status, submission);
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
    status: normalizeServerStatus(data.status),
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
  if (!data.submission || typeof data.submission !== "object" || Array.isArray(data.submission)) {
    throw new KycApiError("Verification response was incomplete. Please try again.", response.status);
  }
  const submission = data.submission;
  const normalizedStatus = normalizeServerStatus(submission.status);
  if (
    normalizedStatus === "approved" &&
    (submission.liveness_passed !== true ||
      submission.selfie_match !== true ||
      typeof submission.selfie_confidence !== "number" ||
      submission.selfie_confidence < minimumSelfieConfidence)
  ) {
    throw new KycApiError("Verification did not pass the required face checks. Please try again.", response.status);
  }
  return {
    message: typeof data.message === "string" ? data.message : "Your identity verification result is available.",
    submission: {
      ...submission,
      status: normalizedStatus,
    } as KycServerSubmission,
  };
}
