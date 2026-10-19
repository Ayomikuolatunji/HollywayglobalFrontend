import { apiFetch } from "../../../components/api/apiFetch";
import { ApiResponseError, responsePayload } from "../../../components/api/apiResponse";
import { getCustomerApiBaseUrl } from "../../../components/config/customerApi";
import { fetchAllPages } from "../../../components/api/pagination";

export type WalletSummary = { available_balance_minor: number; pending_deposits_minor: number; service_payments_minor: number; pending_payouts_minor: number; payouts_enabled: boolean; currency: string };
export type WalletInstructions = { configured: boolean; bank_name?: string; account_name?: string; account_number?: string; whatsapp_number?: string | null };
export type WalletDeposit = {
  id: string; reference: string; amount_minor: number; method: string; status: string; transfer_reference: string | null;
  sender_name: string | null; transferred_at: string | null; submitted_note: string | null; admin_note: string | null;
  reviewed_at: string | null; proof: { name: string | null; mime_type: string | null; byte_size: number | null } | null;
  created_at: string; updated_at: string;
};
export type WalletPayout = {
  id: string; reference: string; amount_minor: number; bank_name: string; account_name: string; account_last4: string;
  status: string; admin_note: string | null; reviewed_by: string | null; reviewed_at: string | null; paid_at: string | null;
  created_at: string; updated_at: string;
};
export type WalletPage = { items: WalletDeposit[]; page: number; page_size: number; total: number; total_pages: number; has_next: boolean; has_previous: boolean };
export type WalletPayoutPage = { items: WalletPayout[]; page: number; page_size: number; total: number; total_pages: number; has_next: boolean; has_previous: boolean };
export type WalletLedgerEntry = { id: string; source_type: string; source_id: string; direction: "credit" | "debit"; amount_minor: number; description: string; created_at: string };
export type WalletLedgerPage = { items: WalletLedgerEntry[]; page: number; page_size: number; total: number; total_pages: number; has_next: boolean; has_previous: boolean };
export type WalletServicePayment = { id: string; reference: string; source_type: string; amount_minor: number; currency: string; direction: "debit"; status: "confirmed"; already_paid: boolean; available_balance_minor: number; created_at: string };
export type WalletPromotionPayment = { id: string; target_type: "listing" | "wanted_request"; reference: string; source_type: string; amount_minor: number; currency: string; direction: "debit"; status: "confirmed"; already_paid: boolean; available_balance_minor: number; created_at: string };
export type WalletWantedRequestFeePayment = { id: string; reference: string; source_type: "wanted_request_fee"; amount_minor: number; currency: string; direction: "debit"; status: "confirmed"; already_paid: boolean; available_balance_minor: number; created_at: string };

function record(value: unknown): value is Record<string, unknown> { return Boolean(value) && typeof value === "object"; }

function parseDeposit(value: unknown): WalletDeposit {
  if (!record(value) || typeof value.id !== "string" || typeof value.reference !== "string") throw new ApiResponseError("Wallet response returned an invalid deposit.", 502);
  return value as unknown as WalletDeposit;
}

function parseLedgerEntry(value: unknown): WalletLedgerEntry {
  if (!record(value) || typeof value.id !== "string" || typeof value.source_type !== "string" || (value.direction !== "credit" && value.direction !== "debit")) throw new ApiResponseError("Wallet response returned an invalid ledger entry.", 502);
  return value as unknown as WalletLedgerEntry;
}

function parsePayout(value: unknown): WalletPayout {
  if (!record(value) || typeof value.id !== "string" || typeof value.reference !== "string") throw new ApiResponseError("Wallet response returned an invalid payout.", 502);
  return value as unknown as WalletPayout;
}

export async function fetchWallet() {
  const response = await fetch(`${getCustomerApiBaseUrl()}/api/v1/wallet`, { credentials: "include", headers: { Accept: "application/json" } });
  const payload = await responsePayload(response);
  if (!record(payload.data) || !record(payload.data.summary) || !record(payload.data.payment_instructions)) throw new ApiResponseError("Wallet response returned an invalid summary.", 502);
  return { summary: payload.data.summary as WalletSummary, instructions: payload.data.payment_instructions as WalletInstructions };
}

export async function fetchWalletDeposits(page = 1, pageSize = 25): Promise<WalletPage> {
  const response = await fetch(`${getCustomerApiBaseUrl()}/api/v1/wallet/deposits?page=${page}&page_size=${pageSize}`, { credentials: "include", headers: { Accept: "application/json" } });
  const payload = await responsePayload(response);
  if (!record(payload.data) || !Array.isArray(payload.data.items)) throw new ApiResponseError("Wallet deposits response returned an invalid page.", 502);
  return { ...(payload.data as Omit<WalletPage, "items">), items: payload.data.items.map(parseDeposit) };
}

export async function fetchWalletLedger(page = 1, pageSize = 25): Promise<WalletLedgerPage> {
  const response = await fetch(`${getCustomerApiBaseUrl()}/api/v1/wallet/ledger?page=${page}&page_size=${pageSize}`, { credentials: "include", headers: { Accept: "application/json" } });
  const payload = await responsePayload(response);
  if (!record(payload.data) || !Array.isArray(payload.data.items)) throw new ApiResponseError("Wallet ledger response returned an invalid page.", 502);
  return { ...(payload.data as Omit<WalletLedgerPage, "items">), items: payload.data.items.map(parseLedgerEntry) };
}

export async function fetchWalletPayouts(page = 1, pageSize = 25): Promise<WalletPayoutPage> {
  const response = await fetch(`${getCustomerApiBaseUrl()}/api/v1/wallet/payouts?page=${page}&page_size=${pageSize}`, { credentials: "include", headers: { Accept: "application/json" } });
  const payload = await responsePayload(response);
  if (!record(payload.data) || !Array.isArray(payload.data.items)) throw new ApiResponseError("Wallet payouts response returned an invalid page.", 502);
  return { ...(payload.data as Omit<WalletPayoutPage, "items">), items: payload.data.items.map(parsePayout) };
}

export function fetchAllWalletDeposits(): Promise<WalletDeposit[]> {
  return fetchAllPages(async (page, pageSize) => {
    const result = await fetchWalletDeposits(page, pageSize);
    return { items: result.items, hasNext: result.has_next };
  }, 100);
}

export function fetchAllWalletLedger(): Promise<WalletLedgerEntry[]> {
  return fetchAllPages(async (page, pageSize) => {
    const result = await fetchWalletLedger(page, pageSize);
    return { items: result.items, hasNext: result.has_next };
  }, 100);
}

export function fetchAllWalletPayouts(): Promise<WalletPayout[]> {
  return fetchAllPages(async (page, pageSize) => {
    const result = await fetchWalletPayouts(page, pageSize);
    return { items: result.items, hasNext: result.has_next };
  }, 100);
}

export async function requestWalletPayout(input: { amount: string; bankName: string; accountNumber: string; accountName: string }) {
  const response = await apiFetch(`${getCustomerApiBaseUrl()}/api/v1/wallet/payouts`, { method: "POST", credentials: "include", headers: { Accept: "application/json", "Content-Type": "application/json" }, body: JSON.stringify({ amount: input.amount, bank_name: input.bankName, account_number: input.accountNumber, account_name: input.accountName }) }, { successMessage: "Payout request sent for review." });
  const payload = await responsePayload(response);
  return parsePayout(payload.data);
}

export async function cancelWalletPayout(reference: string) {
  const response = await apiFetch(`${getCustomerApiBaseUrl()}/api/v1/wallet/payouts/${encodeURIComponent(reference)}/cancel`, { method: "POST", credentials: "include", headers: { Accept: "application/json" } }, { successMessage: "Payout request cancelled." });
  const payload = await responsePayload(response);
  return parsePayout(payload.data);
}

export async function payForService(service: "professional" | "logistics" | "relocation", reference: string): Promise<WalletServicePayment> {
  const response = await apiFetch(`${getCustomerApiBaseUrl()}/api/v1/wallet/service-payments`, { method: "POST", credentials: "include", headers: { Accept: "application/json", "Content-Type": "application/json" }, body: JSON.stringify({ service, reference }) }, { successMessage: "Service payment confirmed from your wallet." });
  const payload = await responsePayload(response);
  if (!record(payload.data) || typeof payload.data.id !== "string" || payload.data.direction !== "debit") throw new ApiResponseError("Wallet payment returned an invalid response.", 502);
  return payload.data as unknown as WalletServicePayment;
}

export async function payForPromotion(targetType: "listing" | "wanted_request", reference: string): Promise<WalletPromotionPayment> {
  const response = await apiFetch(`${getCustomerApiBaseUrl()}/api/v1/wallet/promotion-payments`, { method: "POST", credentials: "include", headers: { Accept: "application/json", "Content-Type": "application/json" }, body: JSON.stringify({ target_type: targetType, reference }) }, { successMessage: "Visibility payment confirmed from your Hollyway wallet." });
  const payload = await responsePayload(response);
  if (!record(payload.data) || typeof payload.data.id !== "string" || payload.data.direction !== "debit") throw new ApiResponseError("Visibility payment returned an invalid response.", 502);
  return payload.data as unknown as WalletPromotionPayment;
}

export async function payForWantedRequestFee(reference: string): Promise<WalletWantedRequestFeePayment> {
  const response = await apiFetch(`${getCustomerApiBaseUrl()}/api/v1/wanted-requests/${encodeURIComponent(reference)}/fee-payment`, { method: "POST", credentials: "include", headers: { Accept: "application/json" } }, { successMessage: "Wanted request fee confirmed from your Hollyway wallet." });
  const payload = await responsePayload(response);
  if (!record(payload.data) || typeof payload.data.id !== "string" || payload.data.direction !== "debit") throw new ApiResponseError("Wanted request payment returned an invalid response.", 502);
  return payload.data as unknown as WalletWantedRequestFeePayment;
}

export async function renewWantedRequest(reference: string) {
  const response = await apiFetch(`${getCustomerApiBaseUrl()}/api/v1/wanted-requests/${encodeURIComponent(reference)}/renew`, { method: "POST", credentials: "include", headers: { Accept: "application/json" } }, { successMessage: "Wanted request renewed." });
  const payload = await responsePayload(response);
  if (!record(payload.data) || typeof payload.data.request !== "string") throw new ApiResponseError("Wanted request renewal returned an invalid response.", 502);
  return payload.data as { request: string; amount_minor: number; renewal_number: number };
}

export async function createWalletDeposit(amount: string) {
  const response = await apiFetch(`${getCustomerApiBaseUrl()}/api/v1/wallet/deposits`, { method: "POST", credentials: "include", headers: { Accept: "application/json" }, body: JSON.stringify({ amount, method: "manual_bank_transfer" }) }, { successMessage: "Wallet deposit reference created." });
  const payload = await responsePayload(response);
  return parseDeposit(payload.data);
}

export async function submitWalletProof(reference: string, values: { proof: File; transferReference: string; senderName: string; transferredAt: string; note: string }) {
  const form = new FormData();
  form.append("proof", values.proof);
  if (values.transferReference) form.append("transfer_reference", values.transferReference);
  if (values.senderName) form.append("sender_name", values.senderName);
  if (values.transferredAt) form.append("transferred_at", values.transferredAt);
  if (values.note) form.append("submitted_note", values.note);
  const response = await apiFetch(`${getCustomerApiBaseUrl()}/api/v1/wallet/deposits/${encodeURIComponent(reference)}/proof`, { method: "POST", credentials: "include", headers: { Accept: "application/json" }, body: form }, { successMessage: "Wallet payment proof sent for review." });
  const payload = await responsePayload(response);
  return parseDeposit(payload.data);
}

export function walletProofUrl(reference: string) { return `${getCustomerApiBaseUrl()}/api/v1/wallet/deposits/${encodeURIComponent(reference)}/proof`; }
