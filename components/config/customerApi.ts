export const productionCustomerApiBaseUrl = "https://api.hollywayglobal.com";
const stagingCustomerApiBaseUrl = "https://staging-api.hollywayglobal.com";

export function getCustomerApiBaseUrl() {
  if (typeof window === "undefined") return productionCustomerApiBaseUrl;
  const hostname = window.location.hostname;
  if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "staging.hollywayglobal.com") {
    return stagingCustomerApiBaseUrl;
  }
  return productionCustomerApiBaseUrl;
}
