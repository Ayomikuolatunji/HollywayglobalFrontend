"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { Arrow } from "../../../components/ui/Arrow";
import { apiFetch } from "../../../components/api/apiFetch";
import { getCustomerApiBaseUrl } from "../../../components/config/customerApi";
import { captureReferralCode } from "../../referrals/data/referralAttribution";
import { AuthError, AuthField, AuthShell, GoogleButton, PasswordField } from "../components/AuthShared";

function safeNext(value: string | null) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "";
}

export default function SignupPage() {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [nextPath, setNextPath] = useState("");

  useEffect(() => {
    setReferralCode(captureReferralCode());
    setNextPath(safeNext(new URLSearchParams(window.location.search).get("next")));
  }, []);

  function verificationHref(email: string, detail?: string) {
    let href = "/verify-email?email=" + encodeURIComponent(email);
    if (nextPath) href += "&next=" + encodeURIComponent(nextPath);
    if (detail) href += "&error=" + encodeURIComponent(detail);
    return href;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    const form = new FormData(event.currentTarget);
    if (form.get("password") !== form.get("confirmPassword")) {
      setError("Passwords do not match.");
      setSubmitting(false);
      return;
    }
    try {
      const email = String(form.get("email") || "").trim();
      const response = await apiFetch(
        getCustomerApiBaseUrl() + "/auth/signup",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password: form.get("password"),
            referral_code: referralCode || captureReferralCode() || undefined,
          }),
        },
        {
          successMessage: "Account created. Check your email for the verification code.",
          errorMessage: "Unable to create your account. Please try again.",
        },
      );
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        const detail = typeof payload.detail === "string" ? payload.detail : "Unable to create your account.";
        if (response.status === 503) {
          window.location.assign(verificationHref(email, detail));
          return;
        }
        throw new Error(detail);
      }
      window.location.assign(verificationHref(String(payload.email || email)));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to create your account.");
      setSubmitting(false);
    }
  }

  const loginHref = nextPath ? "/login?next=" + encodeURIComponent(nextPath) : "/login";

  return (
    <AuthShell kicker="CREATE ACCOUNT" title="Start with Hollyway." description="Create your user account to manage listings, requests, orders, and services.">
      <GoogleButton referralCode={referralCode} />
      {referralCode && <p className="mt-3 rounded-lg bg-[#f4f8ff] px-3 py-2 text-center text-[10px] font-bold text-[#31527f]">Referral code applied: {referralCode}</p>}
      <div className="relative my-7 border-t border-[#dfe4ed] text-center"><span className="relative -top-2.5 bg-white px-3 text-[10px] font-bold text-[#8b97a9]">or use your email</span></div>
      <form className="grid gap-4" onSubmit={submit}>
        <AuthError message={error} />
        <AuthField label="Email address" name="email" type="email" autoComplete="email" />
        <PasswordField label="Password" name="password" autoComplete="new-password" minLength={8} />
        <PasswordField label="Confirm password" name="confirmPassword" autoComplete="new-password" minLength={8} />
        <button className="mt-2 flex h-12 items-center justify-center gap-2 rounded-lg bg-[#1453bb] text-sm font-extrabold text-white transition hover:bg-[#0b3f91] disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={submitting}>{submitting ? "Creating account…" : <>Create account <Arrow /></>}</button>
      </form>
      <p className="mt-6 text-center text-xs font-semibold text-[#53627a]">Already have an account?{" "}<Link className="font-extrabold text-[#1453bb] hover:underline" href={loginHref}>Sign in</Link></p>
    </AuthShell>
  );
}
