const configuredCustomerApiBaseUrl = (process.env.NEXT_PUBLIC_HOLLYWAY_API_BASE_URL || "").replace(/\/$/, "");
if (!configuredCustomerApiBaseUrl) {
  throw new Error("NEXT_PUBLIC_HOLLYWAY_API_BASE_URL is required.");
}

export function getCustomerApiBaseUrl() {
  return configuredCustomerApiBaseUrl;
}
