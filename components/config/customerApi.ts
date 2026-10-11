const configuredCustomerApiBaseUrl = (process.env.NEXT_PUBLIC_HOLLYWAY_API_BASE_URL || "").replace(/\/$/, "");

export function getCustomerApiBaseUrl() {
  return configuredCustomerApiBaseUrl;
}
