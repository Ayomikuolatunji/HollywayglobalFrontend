"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Arrow } from "../../../components/ui/Arrow";
import { getCustomerApiBaseUrl } from "../../../components/config/customerApi";
import { AuthError, AuthField, AuthShell, AuthSuccess } from "./AuthShared";

export default function ForgotPasswordPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch(`${getCustomerApiBaseUrl()}/auth/forgot-password`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: form.get("email") }) });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof payload.detail === "string" ? payload.detail : "Unable to request a reset link.");
      setSuccess("If an account exists for that email, a reset link has been sent.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to request a reset link.");
    } finally {
      setSubmitting(false);
    }
  }

  return <AuthShell kicker="PASSWORD HELP" title="Forgot your password?" description="Enter your email and we’ll send a secure reset link if an account exists."><form className="mt-7 grid gap-4" onSubmit={submit}><AuthError message={error} /><AuthSuccess message={success} /><AuthField label="Email address" name="email" type="email" autoComplete="email" /><button className="mt-2 flex h-12 items-center justify-center gap-2 rounded-lg bg-[#1453bb] text-sm font-extrabold text-white transition hover:bg-[#0b3f91] disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={submitting}>{submitting ? "Sending link…" : <>Send reset link <Arrow /></>}</button></form><p className="mt-6 text-center text-xs font-semibold text-[#53627a]"><Link className="font-extrabold text-[#1453bb] hover:underline" href="/login">Return to sign in</Link></p></AuthShell>;
}
