export const kycStorageKey = "hollyway-kyc-draft";

export function getKycStorageKey(accountEmail?: string) {
  const normalizedEmail = typeof accountEmail === "string" ? accountEmail.trim().toLowerCase() : "";
  return normalizedEmail ? `${kycStorageKey}:${encodeURIComponent(normalizedEmail)}` : kycStorageKey;
}

export type KycServerStatus =
  | "not_submitted"
  | "pending_review"
  | "approved"
  | "rejected"
  | "additional_review";

export type KycStatus = "not-started" | "draft" | "submitted" | KycServerStatus;

export type KycDraft = {
  identityType: string;
  identityNumber: string;
  consent: boolean;
};

export const emptyKycDraft: KycDraft = {
  identityType: "NIN",
  identityNumber: "",
  consent: false,
};

export const kycSteps = ["Identity record", "Review"] as const;

export function normalizeKycStatus(value: unknown): KycStatus {
  if (value === "draft") return "draft";
  if (value === "not_submitted") return "not_submitted";
  if (value === "approved") return "approved";
  if (value === "rejected") return "rejected";
  // Legacy browser state is not proof of a server-side verification result.
  // The API remains the only authority for an approved account.
  if (value === "pending_review") return "pending_review";
  if (value === "additional_review") return "additional_review";
  // "submitted" was used by the old local-only screen. It was never sent to
  // Hollyway, so reopen it as a draft instead of showing a false review state.
  return value === "submitted" ? "draft" : "not-started";
}

export function resolveKycStatus(remoteStatus: KycServerStatus, localStatus: KycStatus): KycStatus {
  if (remoteStatus !== "not_submitted") return remoteStatus;
  return localStatus === "draft" ? "draft" : "not-started";
}

export function isKycComplete(status: KycStatus) {
  return status === "approved";
}

export function hasKycSubmission(status: KycStatus) {
  return status === "approved" || status === "rejected";
}

export function kycStatusLabel(status: KycStatus) {
  switch (status) {
    case "not_submitted":
    case "not-started":
      return "Not Submitted";
    case "draft":
      return "Draft";
    case "approved":
      return "Approved";
    case "rejected":
      return "Rejected";
    case "pending_review":
      return "Pending Review";
    case "additional_review":
      return "Additional Review";
    default:
      return "Not Submitted";
  }
}

export function kycStatusAction(status: KycStatus) {
  if (status === "rejected" || status === "additional_review") return "Review and resubmit";
  if (isKycComplete(status) || hasKycSubmission(status)) return "Review verification";
  if (status === "draft") return "Continue verification";
  return "Start verification";
}

export function kycStatusDescription(status: KycStatus) {
  switch (status) {
    case "approved":
      return "Your identity verification is complete and available for KYC-protected actions.";
    case "rejected":
      return "The last verification attempt was not successful. Check the details and resubmit.";
    case "pending_review":
      return "Your verification was received and is being processed.";
    case "additional_review":
      return "Hollyway needs another review before this verification can be completed.";
    case "draft":
      return "Continue the saved form. Your identity number is never saved in this browser.";
    default:
      return "Complete KYC before higher-value transactions and account actions that require verification.";
  }
}

export function readKycLocalState(storageKey = kycStorageKey): { draft: KycDraft; status: KycStatus } {
  if (typeof window === "undefined") return { draft: emptyKycDraft, status: "not-started" };
  const saved = window.localStorage.getItem(storageKey);
  if (!saved) return { draft: emptyKycDraft, status: "not-started" };
  try {
    const parsed = JSON.parse(saved) as { draft?: Record<string, unknown>; status?: unknown };
    const source = parsed.draft || {};
    const draft: KycDraft = {
      ...emptyKycDraft,
      identityType: source.identityType === "BVN" ? "BVN" : "NIN",
      // Never hydrate the raw identity number from an older local draft.
      identityNumber: "",
      consent: source.consent === true,
    };
    const storedStatus = normalizeKycStatus(parsed.status);
    // Approved status must come from the API. This prevents a cleared server
    // record or a failed status request from leaving a false local success.
    const localStatus = storedStatus === "approved" ? "not-started" : storedStatus;
    const status = localStatus;
    if ("identityNumber" in source || "documentNumber" in source || "documentName" in source) {
      persistKycLocalState(draft, status, storageKey);
    }
    return { draft, status };
  } catch {
    window.localStorage.removeItem(storageKey);
    return { draft: emptyKycDraft, status: "not-started" };
  }
}

export function persistKycLocalState(draft: KycDraft, status: KycStatus, storageKey = kycStorageKey) {
  if (typeof window === "undefined") return;
  // Keep only resumable, non-document fields in browser storage. NIN/BVN
  // remains in memory until the authenticated submission.
  const localStatus = status === "approved" ? "not-started" : status;
  window.localStorage.setItem(
    storageKey,
    JSON.stringify({
      status: localStatus,
      draft: {
        identityType: draft.identityType,
        consent: draft.consent,
      },
    }),
  );
}

export function clearKycLocalState(storageKey = kycStorageKey) {
  if (typeof window !== "undefined") window.localStorage.removeItem(storageKey);
}
