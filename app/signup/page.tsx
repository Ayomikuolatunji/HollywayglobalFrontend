"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Arrow } from "../components/SiteHeader";
import { AuthError, AuthField, AuthShell, GoogleButton, customerApiBaseUrl } from "../components/CustomerAuth";

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
      const response = await fetch(`${customerApiBaseUrl}/auth/signup`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.get("name"), email: form.get("email"), password: form.get("password") }) });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof payload.detail === "string" ? payload.detail : "Unable to create your account.");
      window.location.assign("/dashboard");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to create your account.");
      setSubmitting(false);
    }
  }

  return <AuthShell kicker="CREATE ACCOUNT" title="Start with Hollyway." description="Create your user account to manage listings, requests, orders, and services."><GoogleButton /><div className="customerAuthDivider"><span>or use your email</span></div><form className="customerAuthForm" onSubmit={submit}><AuthError message={error} /><AuthField label="Full name" name="name" autoComplete="name" /><AuthField label="Email address" name="email" type="email" autoComplete="email" /><AuthField label="Password" name="password" type="password" autoComplete="new-password" /><AuthField label="Confirm password" name="confirmPassword" type="password" autoComplete="new-password" /><button className="customerLoginButton" type="submit" disabled={submitting}>{submitting ? "Creating account…" : <>Create account <Arrow /></>}</button></form><p className="customerAuthFooter">Already have an account? <Link href="/login">Sign in</Link></p></AuthShell>;
}
