import { showToast } from "../ui/ToastProvider";

type MutationMethod = "POST" | "PUT" | "PATCH";

export type ApiFetchOptions = {
  notify?: boolean;
  successMessage?: string;
  errorMessage?: string;
};

function isMutationMethod(method: string): method is MutationMethod {
  return method === "POST" || method === "PUT" || method === "PATCH";
}

export async function apiFetch(
  input: RequestInfo | URL,
  init: RequestInit = {},
  options: ApiFetchOptions = {},
): Promise<Response> {
  const method = String(init.method || "GET").toUpperCase();
  const shouldNotify = options.notify !== false && isMutationMethod(method);
  const isFormDataBody = typeof FormData !== "undefined" && init.body instanceof FormData;
  try {
    const response = await fetch(input, {
      ...init,
      headers: {
        ...(init.body && !isFormDataBody ? { "Content-Type": "application/json" } : {}),
        ...init.headers,
      },
    });
    if (shouldNotify) {
      showToast(
        response.ok ? "success" : "error",
        response.ok
          ? options.successMessage || (method === "POST" ? "Request completed successfully." : "Changes saved successfully.")
          : options.errorMessage || "We could not complete that request. Please try again.",
      );
    }
    return response;
  } catch (error) {
    if (shouldNotify) {
      showToast("error", options.errorMessage || "We could not reach Hollyway. Please try again.");
    }
    throw error;
  }
}
