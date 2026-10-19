import { apiFetch } from "../../../components/api/apiFetch";
import { responsePayload } from "../../../components/api/apiResponse";
import { getCustomerApiBaseUrl } from "../../../components/config/customerApi";

type ContactInput = {
  name: string;
  email: string;
  topic: string;
  message: string;
};

export async function submitContact(input: ContactInput) {
  const response = await apiFetch(
    `${getCustomerApiBaseUrl()}/api/v1/public/contact`,
    {
      method: "POST",
      credentials: "include",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(input),
    },
    {
      successMessage: "Message sent successfully.",
      errorMessage: "Message could not be sent. Please try again.",
    },
  );
  return responsePayload(response);
}

export async function subscribeToNewsletter(email: string) {
  const response = await apiFetch(
    `${getCustomerApiBaseUrl()}/api/v1/public/newsletter`,
    {
      method: "POST",
      credentials: "include",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ email, marketing_consent: true }),
    },
    {
      successMessage: "Subscription saved successfully.",
      errorMessage: "Subscription could not be saved. Please try again.",
    },
  );
  return responsePayload(response);
}
