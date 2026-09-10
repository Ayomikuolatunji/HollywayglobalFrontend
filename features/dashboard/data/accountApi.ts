import { getCustomerApiBaseUrl } from "../../../components/config/customerApi";

export type AccountTheme = "light" | "dark";

export type AccountSettings = {
  theme: AccountTheme;
  email_updates: boolean;
  listing_activity: boolean;
  request_updates: boolean;
  order_updates: boolean;
  service_updates: boolean;
  updated_at?: string;
};

export type BusinessUpgradeStatus =
  | "not_submitted"
  | "draft"
  | "verification_pending"
  | "verified_business"
  | "rejected"
  | "additional_review";

export type BusinessAccountStatus =
  | "individual"
  | "business_unverified"
  | "verification_pending"
  | "verified_business"
  | "rejected"
  | "additional_review";

export type BusinessDocument = {
  kind: string;
  name: string;
  mime_type: string;
  byte_size: number;
};

export type BusinessUpgrade = {
  id?: number;
  status: BusinessUpgradeStatus;
  status_label?: string;
  account_status: BusinessAccountStatus;
  company_name?: string;
  registration_number?: string;
  tin?: string;
  company_email?: string;
  company_phone_e164?: string;
  position?: string;
  address_street?: string;
  address_city?: string;
  address_state?: string;
  settlement_bank_name?: string;
  settlement_account_last4?: string;
  documents?: BusinessDocument[];
  rejection_reason?: string | null;
  submitted_at?: string;
  updated_at?: string;
};

export class AccountApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AccountApiError";
    this.status = status;
  }
}

async function responsePayload(response: Response) {
  const payload = (await response.json().catch(() => ({}))) as {
    detail?: unknown;
    data?: unknown;
    message?: unknown;
  };
  if (response.ok) return payload;
  const detail = payload.detail;
  const message = Array.isArray(detail)
    ? detail
        .map((item) =>
          item && typeof item === "object" && "msg" in item ? String(item.msg) : "",
        )
        .filter(Boolean)[0]
    : typeof detail === "string"
      ? detail
      : "Account request could not be completed.";
  throw new AccountApiError(message, response.status);
}

function isTheme(value: unknown): value is AccountTheme {
  return value === "light" || value === "dark";
}

function isBusinessStatus(value: unknown): value is BusinessUpgradeStatus {
  return [
    "not_submitted",
    "draft",
    "verification_pending",
    "verified_business",
    "rejected",
    "additional_review",
  ].includes(String(value));
}

function isAccountStatus(value: unknown): value is BusinessAccountStatus {
  return [
    "individual",
    "business_unverified",
    "verification_pending",
    "verified_business",
    "rejected",
    "additional_review",
  ].includes(String(value));
}

export async function fetchAccountSettings(): Promise<AccountSettings> {
  const response = await fetch(`${getCustomerApiBaseUrl()}/api/v1/account/settings`, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  const payload = await responsePayload(response);
  const data = (payload.data || {}) as Partial<AccountSettings>;
  return {
    theme: isTheme(data.theme) ? data.theme : "light",
    email_updates: data.email_updates !== false,
    listing_activity: data.listing_activity !== false,
    request_updates: data.request_updates !== false,
    order_updates: data.order_updates !== false,
    service_updates: data.service_updates !== false,
    updated_at: typeof data.updated_at === "string" ? data.updated_at : undefined,
  };
}

export async function updateAccountSettings(
  changes: Partial<Omit<AccountSettings, "updated_at">>,
): Promise<AccountSettings> {
  const response = await fetch(`${getCustomerApiBaseUrl()}/api/v1/account/settings`, {
    method: "PATCH",
    credentials: "include",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(changes),
  });
  const payload = await responsePayload(response);
  const data = (payload.data || {}) as Partial<AccountSettings>;
  return {
    theme: isTheme(data.theme) ? data.theme : "light",
    email_updates: data.email_updates !== false,
    listing_activity: data.listing_activity !== false,
    request_updates: data.request_updates !== false,
    order_updates: data.order_updates !== false,
    service_updates: data.service_updates !== false,
    updated_at: typeof data.updated_at === "string" ? data.updated_at : undefined,
  };
}

export async function changePassword(input: {
  currentPassword: string;
  newPassword: string;
}): Promise<string> {
  const response = await fetch(`${getCustomerApiBaseUrl()}/auth/change-password`, {
    method: "POST",
    credentials: "include",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({
      current_password: input.currentPassword,
      new_password: input.newPassword,
    }),
  });
  const payload = await responsePayload(response);
  return typeof payload.message === "string" ? payload.message : "Your password has been changed.";
}

export async function fetchBusinessUpgrade(): Promise<BusinessUpgrade> {
  const response = await fetch(`${getCustomerApiBaseUrl()}/api/v1/business-upgrade`, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  const payload = await responsePayload(response);
  const data = (payload.data || {}) as Partial<BusinessUpgrade>;
  return {
    ...data,
    status: isBusinessStatus(data.status) ? data.status : "not_submitted",
    account_status: isAccountStatus(data.account_status) ? data.account_status : "individual",
    documents: Array.isArray(data.documents) ? data.documents : [],
  };
}

export type BusinessUpgradeInput = {
  action: "draft" | "submit";
  companyName: string;
  registrationNumber: string;
  tin: string;
  companyEmail: string;
  companyPhone: string;
  position: string;
  addressStreet: string;
  addressCity: string;
  addressState: string;
  settlementBankName: string;
  settlementAccountNumber: string;
  settlementAccountName: string;
  consent: boolean;
  certificate: File | null;
  directorIdentification: File | null;
};

export async function saveBusinessUpgrade(input: BusinessUpgradeInput) {
  const form = new FormData();
  const fields: Record<string, string> = {
    action: input.action,
    company_name: input.companyName,
    registration_number: input.registrationNumber,
    tin: input.tin,
    company_email: input.companyEmail,
    company_phone_e164: input.companyPhone,
    position: input.position,
    address_street: input.addressStreet,
    address_city: input.addressCity,
    address_state: input.addressState,
    settlement_bank_name: input.settlementBankName,
    settlement_account_number: input.settlementAccountNumber,
    settlement_account_name: input.settlementAccountName,
    consent: String(input.consent),
  };
  Object.entries(fields).forEach(([key, value]) => form.set(key, value));
  if (input.certificate) form.set("certificate", input.certificate, input.certificate.name);
  if (input.directorIdentification) {
    form.set(
      "director_identification",
      input.directorIdentification,
      input.directorIdentification.name,
    );
  }
  const response = await fetch(`${getCustomerApiBaseUrl()}/api/v1/business-upgrade`, {
    method: "POST",
    credentials: "include",
    body: form,
  });
  const payload = await responsePayload(response);
  const data = (payload.data || {}) as Partial<BusinessUpgrade>;
  return {
    message:
      typeof payload.message === "string"
        ? payload.message
        : input.action === "submit"
          ? "Business upgrade submitted for Admin verification."
          : "Business upgrade draft saved.",
    data: {
      ...data,
      status: isBusinessStatus(data.status) ? data.status : input.action === "submit" ? "verification_pending" : "draft",
      account_status: isAccountStatus(data.account_status)
        ? data.account_status
        : input.action === "submit"
          ? "verification_pending"
          : "business_unverified",
      documents: Array.isArray(data.documents) ? data.documents : [],
    } as BusinessUpgrade,
  };
}
