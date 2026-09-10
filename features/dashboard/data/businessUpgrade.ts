import type { BusinessUpgrade } from "./accountApi";

export const businessUpgradeStorageKey = "hollyway-business-upgrade-draft";

export type BusinessUpgradeDraft = {
  companyName: string;
  registrationNumber: string;
  tin: string;
  companyEmail: string;
  companyPhone: string;
  position: string;
  addressStreet: string;
  addressCity: string;
  addressState: string;
};

export type BusinessSettlementField =
  | "settlementBankName"
  | "settlementAccountNumber"
  | "settlementAccountName";

export type BusinessDocumentKind = "certificate" | "directorIdentification";

export const emptyBusinessUpgradeDraft: BusinessUpgradeDraft = {
  companyName: "",
  registrationNumber: "",
  tin: "",
  companyEmail: "",
  companyPhone: "",
  position: "",
  addressStreet: "",
  addressCity: "",
  addressState: "",
};

export function draftFromBusinessUpgrade(
  upgrade: BusinessUpgrade,
): BusinessUpgradeDraft {
  return {
    companyName: upgrade.company_name || "",
    registrationNumber: upgrade.registration_number || "",
    tin: upgrade.tin || "",
    companyEmail: upgrade.company_email || "",
    companyPhone: upgrade.company_phone_e164 || "",
    position: upgrade.position || "",
    addressStreet: upgrade.address_street || "",
    addressCity: upgrade.address_city || "",
    addressState: upgrade.address_state || "",
  };
}

export function mergeBusinessUpgradeDraft(
  local: BusinessUpgradeDraft,
  remote: BusinessUpgradeDraft,
): BusinessUpgradeDraft {
  return {
    companyName: remote.companyName || local.companyName,
    registrationNumber: remote.registrationNumber || local.registrationNumber,
    tin: remote.tin || local.tin,
    companyEmail: remote.companyEmail || local.companyEmail,
    companyPhone: remote.companyPhone || local.companyPhone,
    position: remote.position || local.position,
    addressStreet: remote.addressStreet || local.addressStreet,
    addressCity: remote.addressCity || local.addressCity,
    addressState: remote.addressState || local.addressState,
  };
}

export function isBusinessUpgradeLocked(status?: string) {
  return (
    status === "verification_pending" ||
    status === "verified_business" ||
    status === "additional_review"
  );
}

export function hasBusinessUpgradeDocument(
  upgrade: BusinessUpgrade | null,
  kind: string,
) {
  return Boolean(upgrade?.documents?.some((document) => document.kind === kind));
}

export function getBusinessUpgradeStorageKey(accountEmail?: string) {
  const normalizedEmail = typeof accountEmail === "string" ? accountEmail.trim().toLowerCase() : "";
  return normalizedEmail
    ? `${businessUpgradeStorageKey}:${encodeURIComponent(normalizedEmail)}`
    : businessUpgradeStorageKey;
}

function text(value: unknown) {
  return typeof value === "string" ? value : "";
}

export function readBusinessUpgradeDraft(storageKey = businessUpgradeStorageKey) {
  if (typeof window === "undefined") return emptyBusinessUpgradeDraft;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(storageKey) || "{}") as Record<
      string,
      unknown
    >;
    return {
      companyName: text(parsed.companyName),
      registrationNumber: text(parsed.registrationNumber),
      tin: text(parsed.tin),
      companyEmail: text(parsed.companyEmail),
      companyPhone: text(parsed.companyPhone),
      position: text(parsed.position),
      addressStreet: text(parsed.addressStreet),
      addressCity: text(parsed.addressCity),
      addressState: text(parsed.addressState),
    };
  } catch {
    return emptyBusinessUpgradeDraft;
  }
}

export function persistBusinessUpgradeDraft(
  draft: BusinessUpgradeDraft,
  storageKey = businessUpgradeStorageKey,
) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(draft));
  } catch {
    // A full or restricted browser store must not interrupt form editing.
  }
}

export function clearBusinessUpgradeDraft(storageKey = businessUpgradeStorageKey) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(storageKey);
  } catch {
    // Ignore restricted browser storage during a successful submission.
  }
}

export function businessStatusLabel(status: string) {
  switch (status) {
    case "verification_pending":
      return "Verification Pending";
    case "verified_business":
      return "Verified Business";
    case "business_unverified":
      return "Business Unverified";
    case "rejected":
      return "Rejected";
    case "additional_review":
      return "Additional Review";
    case "draft":
      return "Draft";
    default:
      return "Individual";
  }
}

export function businessStatusDescription(status: string) {
  switch (status) {
    case "business_unverified":
      return "Your business details are saved privately. Complete and submit the upgrade when you are ready for Admin verification.";
    case "individual":
      return "You are currently using an Individual account. Submit company details to begin the upgrade.";
    case "verification_pending":
      return "Your company details and documents are waiting for Hollyway Admin review.";
    case "verified_business":
      return "Your company has been verified and can display the Verified Business badge.";
    case "rejected":
      return "Admin could not approve this submission. Review the reason and submit corrected details.";
    case "additional_review":
      return "Admin needs an additional review before the business status can be completed.";
    case "draft":
      return "Your business details are private and can be continued before submission.";
    case "not_submitted":
      return "You are currently using an Individual account. Submit company details to begin the upgrade.";
    default:
      return "You are currently using an Individual account. Submit company details to begin the upgrade.";
  }
}
