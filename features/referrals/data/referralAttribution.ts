const referralStorageKey = "hollyway-referral-code";
const referralCodePattern = /^HWP-[0-9]{6,}$/;

export function normalizeReferralCode(value: string | null | undefined) {
  const code = value?.trim().toUpperCase() || "";
  return referralCodePattern.test(code) ? code : "";
}

export function captureReferralCode() {
  if (typeof window === "undefined") return "";
  const fromUrl = normalizeReferralCode(new URLSearchParams(window.location.search).get("ref"));
  if (fromUrl) {
    try {
      window.sessionStorage.setItem(referralStorageKey, fromUrl);
    } catch {
      // Referral attribution still travels in the current signup request.
    }
    return fromUrl;
  }
  try {
    return normalizeReferralCode(window.sessionStorage.getItem(referralStorageKey));
  } catch {
    return "";
  }
}
