"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Arrow } from "../../../components/ui/Arrow";
import { getCustomerApiBaseUrl } from "../../../components/config/customerApi";
import { AuthError, AuthField, AuthShell, GoogleButton } from "./AuthShared";

export default function SignupPage() {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
      const response = await fetch(`${getCustomerApiBaseUrl()}/auth/signup`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.get("name"), email: form.get("email"), password: form.get("password") }) });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof payload.detail === "string" ? payload.detail : "Unable to create your account.");
      window.location.assign("/dashboard");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to create your account.");
      setSubmitting(false);
    }
  }

  return <AuthShell kicker="CREATE ACCOUNT" title="Start with Hollyway." description="Create your user account to manage listings, requests, orders, and services."><GoogleButton /><div className="relative my-7 border-t border-[#dfe4ed] text-center"><span className="relative -top-2.5 bg-white px-3 text-[10px] font-bold text-[#8b97a9]">or use your email</span></div><form className="grid gap-4" onSubmit={submit}><AuthError message={error} /><AuthField label="Full name" name="name" autoComplete="name" /><AuthField label="Email address" name="email" type="email" autoComplete="email" /><AuthField label="Password" name="password" type="password" autoComplete="new-password" /><AuthField label="Confirm password" name="confirmPassword" type="password" autoComplete="new-password" /><button className="mt-2 flex h-12 items-center justify-center gap-2 rounded-lg bg-[#1453bb] text-sm font-extrabold text-white transition hover:bg-[#0b3f91] disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={submitting}>{submitting ? "Creating account…" : <>Create account <Arrow /></>}</button></form><p className="mt-6 text-center text-xs font-semibold text-[#53627a]">Already have an account? <Link className="font-extrabold text-[#1453bb] hover:underline" href="/login">Sign in</Link></p></AuthShell>;
}
