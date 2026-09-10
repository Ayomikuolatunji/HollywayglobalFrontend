export const productionCustomerApiBaseUrl = "https://api.hollywayglobal.com";
const stagingCustomerApiBaseUrl = "https://staging-api.hollywayglobal.com";
const configuredCustomerApiBaseUrl = (process.env.NEXT_PUBLIC_HOLLYWAY_API_BASE_URL || "").replace(/\/$/, "");

export function getCustomerApiBaseUrl() {
  if (typeof window === "undefined") return configuredCustomerApiBaseUrl || productionCustomerApiBaseUrl;
  const hostname = window.location.hostname;
  if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "staging.hollywayglobal.com") {
    return stagingCustomerApiBaseUrl;
  }
  return configuredCustomerApiBaseUrl || productionCustomerApiBaseUrl;
}
