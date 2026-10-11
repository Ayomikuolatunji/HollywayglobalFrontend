"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { Arrow } from "../../../components/ui/Arrow";
import { apiFetch } from "../../../components/api/apiFetch";
import { getCustomerApiBaseUrl } from "../../../components/config/customerApi";
import { showToast } from "../../../components/ui/ToastProvider";
import { captureReferralCode } from "../../referrals/data/referralAttribution";
import {
  AuthError,
  AuthField,
  AuthShell,
  PasswordField,
} from "../components/AuthShared";
import { GoogleButton } from "../components/GoogleButton";

function safeNext(value: string | null) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/dashboard";
}

export default function LoginPage() {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [nextPath, setNextPath] = useState("/dashboard");

  useEffect(() => {
    const controller = new AbortController();
    setReferralCode(captureReferralCode());
    const params = new URLSearchParams(window.location.search);
    const next = safeNext(params.get("next"));
    setNextPath(next);
    const message = params.get("error");
    if (message) setError(message.replace(/\+/g, " "));
    fetch(getCustomerApiBaseUrl() + "/dashboard", {
      credentials: "include",
      signal: controller.signal,
    })
      .then((response) => {
        if (!controller.signal.aborted && response.ok) window.location.assign(next);
      })
      .catch(() => null);
    return () => controller.abort();
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim().toLowerCase();
    try {
      const response = await apiFetch(
        getCustomerApiBaseUrl() + "/auth/login",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password: form.get("password") }),
        },
        {
          notify: false,
        },
      );
      const payload = await response.json().catch(() => ({}));
      const detail = typeof payload.detail === "string" ? payload.detail : "";
      if (!response.ok) {
        if (response.status === 403 && detail === "Verify your email before signing in.") {
          window.location.assign(`/verify-email?email=${encodeURIComponent(email)}&next=${encodeURIComponent(nextPath)}`);
          return;
        }
        throw new Error(detail || "Unable to sign in.");
      }
      showToast("success", "Signed in successfully.");
      window.location.assign(nextPath);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to sign in.");
      setSubmitting(false);
    }
  }

  const signupHref = nextPath === "/dashboard" ? "/signup" : "/signup?next=" + encodeURIComponent(nextPath);

  return (
    <AuthShell kicker="USER SIGN IN" title="Welcome back." description="Sign in to your Hollyway user account.">
      <GoogleButton referralCode={referralCode} nextPath={nextPath} />
      <div className="relative my-7 border-t border-[#dfe4ed] text-center"><span className="relative -top-2.5 bg-white px-3 text-[10px] font-bold text-[#8b97a9]">or use your email</span></div>
      <form className="grid gap-4" onSubmit={submit}>
        <AuthError message={error} />
        <AuthField label="Email address" name="email" type="email" autoComplete="email" />
        <PasswordField label="Password" name="password" autoComplete="current-password" />
        <div className="text-right text-xs font-bold"><Link className="text-[#1453bb] hover:underline" href="/forgot-password">Forgot password?</Link></div>
        <button className="mt-2 flex h-12 items-center justify-center gap-2 rounded-lg bg-[#1453bb] text-sm font-extrabold text-white transition hover:bg-[#0b3f91] disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={submitting}>{submitting ? "Signing in…" : <>Sign in <Arrow /></>}</button>
      </form>
      <p className="mt-6 text-center text-xs font-semibold text-[#53627a]">New to Hollyway?{" "}<Link className="font-extrabold text-[#1453bb] hover:underline" href={signupHref}>Create an account</Link></p>
    </AuthShell>
  );
}
