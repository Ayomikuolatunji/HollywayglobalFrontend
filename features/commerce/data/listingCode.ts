const listingCodeAlphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export const listingCodesStorageKey = "hollyway-listing-codes";

export function generateListingCode() {
  const bytes = new Uint8Array(8);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) crypto.getRandomValues(bytes);
  else for (let index = 0; index < bytes.length; index += 1) bytes[index] = Math.floor(Math.random() * 256);
  return `HWG-${Array.from(bytes, (byte) => listingCodeAlphabet[byte % listingCodeAlphabet.length]).join("")}`;
}

export function reserveListingCode() {
  if (typeof window === "undefined") return generateListingCode();
  let reserved: string[] = [];
  try { reserved = JSON.parse(window.localStorage.getItem(listingCodesStorageKey) || "[]") as string[]; } catch { reserved = []; }
  let code = generateListingCode();
  while (reserved.includes(code)) code = generateListingCode();
  window.localStorage.setItem(listingCodesStorageKey, JSON.stringify([...reserved, code]));
  return code;
}
