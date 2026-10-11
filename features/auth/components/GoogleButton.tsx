"use client";

import { useEffect, useRef, useState } from "react";
import { apiFetch } from "../../../components/api/apiFetch";
import { getCustomerApiBaseUrl } from "../../../components/config/customerApi";

type GoogleCredentialResponse = {
  credential: string;
};

type GoogleIdentityApi = {
  accounts: {
    id: {
      initialize: (options: {
        client_id: string;
        callback: (response: GoogleCredentialResponse) => void;
      }) => void;
      renderButton: (
        element: HTMLElement,
        options: Record<string, string | number | boolean>,
      ) => void;
    };
  };
};

declare global {
  interface Window {
    google?: GoogleIdentityApi;
  }
}

const googleScriptUrl = "https://accounts.google.com/gsi/client";
let googleScriptPromise: Promise<void> | null = null;

function loadGoogleIdentityScript() {
  if (typeof window === "undefined") return Promise.reject(new Error("Browser sign-in is unavailable."));
  if (window.google?.accounts?.id) return Promise.resolve();
  if (googleScriptPromise) return googleScriptPromise;

  googleScriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${googleScriptUrl}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Google sign-in could not load.")), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = googleScriptUrl;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Google sign-in could not load."));
    document.head.appendChild(script);
  });
  return googleScriptPromise;
}

export function GoogleButton({
  referralCode = "",
  nextPath = "/dashboard",
}: {
  referralCode?: string;
  nextPath?: string;
}) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const clientId = (process.env.NEXT_PUBLIC_HOLLYWAY_GOOGLE_CLIENT_ID || "").trim();

  useEffect(() => {
    let cancelled = false;
    if (!clientId) {
      setError("Google sign-in is not configured for this environment.");
      return () => {
        cancelled = true;
      };
    }

    loadGoogleIdentityScript()
      .then(() => {
        if (cancelled || !buttonRef.current || !window.google) return;
        const apiBaseUrl = getCustomerApiBaseUrl();
        if (!apiBaseUrl) {
          setError("Hollyway sign-in is not configured for this environment.");
          return;
        }
        const container = buttonRef.current;
        container.replaceChildren();
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async ({ credential }) => {
            if (cancelled) return;
            setError("");
            setSubmitting(true);
            try {
              const response = await apiFetch(
                `${apiBaseUrl}/auth/google/client`,
                {
                  method: "POST",
                  credentials: "include",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    credential,
                    referral_code: referralCode || undefined,
                  }),
                },
                {
                  successMessage: "Signed in successfully.",
                  errorMessage: "Unable to complete Google sign-in. Please try again.",
                },
              );
              const payload = await response.json().catch(() => ({}));
              if (!response.ok) {
                throw new Error(
                  typeof payload.detail === "string"
                    ? payload.detail
                    : "Unable to complete Google sign-in.",
                );
              }
              window.location.assign(nextPath || "/dashboard");
            } catch (requestError) {
              if (cancelled) return;
              setError(
                requestError instanceof Error
                  ? requestError.message
                  : "Unable to complete Google sign-in.",
              );
              setSubmitting(false);
            }
          },
        });
        window.google.accounts.id.renderButton(container, {
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "rectangular",
          width: Math.min(container.clientWidth || 400, 400),
        });
      })
      .catch((loadError) => {
        if (!cancelled) setError(loadError instanceof Error ? loadError.message : "Google sign-in could not load.");
      });

    return () => {
      cancelled = true;
      buttonRef.current?.replaceChildren();
    };
  }, [clientId, nextPath, referralCode]);

  return (
    <div className="mt-7 grid gap-2">
      <div ref={buttonRef} className="flex min-h-12 justify-center" />
      {submitting && <p className="text-center text-xs font-semibold text-[#53627a]">Signing in…</p>}
      {error && (
        <p
          className="rounded-lg border border-[#f3caca] bg-[#fff5f5] px-3 py-2 text-xs font-semibold leading-5 text-[#a32929]"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
