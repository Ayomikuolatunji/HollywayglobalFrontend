"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { Arrow } from "../../../components/ui/Arrow";
import { apiFetch } from "../../../components/api/apiFetch";
import { getCustomerApiBaseUrl } from "../../../components/config/customerApi";
import { captureReferralCode } from "../../referrals/data/referralAttribution";
import {
  AuthError,
  AuthField,
  AuthShell,
  GoogleButton,
  PasswordField,
} from "../components/AuthShared";

function safeNext(value: string | null) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/dashboard";
}

export default function LoginPage() {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [nextPath, setNextPath] = useState("/dashboard");

  useEffect(() => {
    setReferralCode(captureReferralCode());
    const params = new URLSearchParams(window.location.search);
    const next = safeNext(params.get("next"));
    setNextPath(next);
    const message = params.get("error");
    if (message) setError(message.replace(/\+/g, " "));
    fetch(getCustomerApiBaseUrl() + "/dashboard", { credentials: "include" })
      .then((response) => { if (response.ok) window.location.assign(next); })
      .catch(() => null);
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    const form = new FormData(event.currentTarget);
    try {
      const response = await apiFetch(
        getCustomerApiBaseUrl() + "/auth/login",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.get("email"), password: form.get("password") }),
        },
        {
          successMessage: "Signed in successfully.",
          errorMessage: "Unable to sign in. Check your details and try again.",
        },
      );
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof payload.detail === "string" ? payload.detail : "Unable to sign in.");
      window.location.assign(nextPath);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to sign in.");
      setSubmitting(false);
    }
  }

  const signupHref = nextPath === "/dashboard" ? "/signup" : "/signup?next=" + encodeURIComponent(nextPath);

  return (
    <AuthShell kicker="USER SIGN IN" title="Welcome back." description="Sign in to your Hollyway user account.">
      <GoogleButton referralCode={referralCode} />
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
