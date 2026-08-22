"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { Arrow } from "../../app/components/SiteHeader";
import { AuthError, AuthField, AuthShell, GoogleButton, customerApiBaseUrl } from "../components/CustomerAuth";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const message = new URLSearchParams(window.location.search).get("error");
    if (message) setError(message.replace(/\+/g, " "));
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch(`${customerApiBaseUrl}/auth/login`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: form.get("email"), password: form.get("password") }) });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof payload.detail === "string" ? payload.detail : "Unable to sign in.");
      window.location.assign("/dashboard");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to sign in.");
      setSubmitting(false);
    }
  }

  return <AuthShell kicker="USER SIGN IN" title="Welcome back." description="Sign in to your Hollyway user account."><GoogleButton /><div className="customerAuthDivider"><span>or use your email</span></div><form className="customerAuthForm" onSubmit={submit}><AuthError message={error} /><AuthField label="Email address" name="email" type="email" autoComplete="email" /><AuthField label="Password" name="password" type="password" autoComplete="current-password" /><div className="customerAuthRow"><Link href="/forgot-password">Forgot password?</Link></div><button className="customerLoginButton" type="submit" disabled={submitting}>{submitting ? "Signing in…" : <>Sign in <Arrow /></>}</button></form><p className="customerAuthFooter">New to Hollyway? <Link href="/signup">Create an account</Link></p></AuthShell>;
}
