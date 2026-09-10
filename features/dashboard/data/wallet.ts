export type WalletFundingRequest = {
  reference: string;
  amount: number;
  method: string;
  createdAt: string;
  status: "Pending payment";
};

export const walletFundingStorageKey = "hollyway-wallet-funding-requests";

export function readWalletFundingRequests() {
  try {
    const value = JSON.parse(window.localStorage.getItem(walletFundingStorageKey) || "[]");
    return Array.isArray(value) ? value as WalletFundingRequest[] : [];
  } catch {
    return [];
  }
}

export function saveWalletFundingRequest(request: WalletFundingRequest) {
  const requests = [request, ...readWalletFundingRequests()];
  window.localStorage.setItem(walletFundingStorageKey, JSON.stringify(requests));
  return requests;
}

export function createWalletFundingReference() {
  const time = Date.now().toString(36).toUpperCase();
  const suffix = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `HWF-${time}-${suffix}`;
}
