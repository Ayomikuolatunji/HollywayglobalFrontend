import { apiFetch } from "../../../components/api/apiFetch";
import { getCustomerApiBaseUrl } from "../../../components/config/customerApi";

export type SavedCustomerAccount = {
  id: string;
  name: string;
  email: string;
};

const savedAccountsStorageKey = "hollyway-saved-customer-accounts";

function isSavedAccount(value: unknown): value is SavedCustomerAccount {
  if (!value || typeof value !== "object") return false;
  const account = value as Record<string, unknown>;
  return (
    typeof account.id === "string" &&
    account.id.length > 0 &&
    typeof account.email === "string" &&
    account.email.length > 0 &&
    typeof account.name === "string"
  );
}

export function readSavedCustomerAccounts(): SavedCustomerAccount[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed: unknown = JSON.parse(
      window.localStorage.getItem(savedAccountsStorageKey) || "[]",
    );
    return Array.isArray(parsed) ? parsed.filter(isSavedAccount) : [];
  } catch {
    return [];
  }
}

export function rememberCustomerAccount(account: SavedCustomerAccount) {
  if (typeof window === "undefined" || !isSavedAccount(account)) return;
  const accounts = readSavedCustomerAccounts().filter((saved) => saved.id !== account.id);
  accounts.unshift(account);
  try {
    window.localStorage.setItem(savedAccountsStorageKey, JSON.stringify(accounts.slice(0, 5)));
  } catch {
    // Account switching still works for the current session if storage is unavailable.
  }
}

export async function registerCurrentCustomerSession() {
  return apiFetch(
    `${getCustomerApiBaseUrl()}/auth/accounts/register-current`,
    { method: "POST", credentials: "include" },
    { notify: false },
  );
}

export async function activateCustomerAccount(accountId: string) {
  return apiFetch(
    `${getCustomerApiBaseUrl()}/auth/accounts/activate`,
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ account_id: accountId }),
    },
    { notify: false },
  );
}
