"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { Arrow } from "../../../components/ui/Arrow";
import { AuthError, AuthField, AuthShell, GoogleButton, customerApiBaseUrl } from "./AuthShared";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const message = new URLSearchParams(window.location.search).get("error");
    if (message) setError(message.replace(/\+/g, " "));
    fetch(`${customerApiBaseUrl}/dashboard`, { credentials: "include" })
      .then((response) => { if (response.ok) window.location.assign("/dashboard"); })
      .catch(() => null);
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

  return <AuthShell kicker="USER SIGN IN" title="Welcome back." description="Sign in to your Hollyway user account."><GoogleButton /><div className="relative my-7 border-t border-[#dfe4ed] text-center"><span className="relative -top-2.5 bg-white px-3 text-[10px] font-bold text-[#8b97a9]">or use your email</span></div><form className="grid gap-4" onSubmit={submit}><AuthError message={error} /><AuthField label="Email address" name="email" type="email" autoComplete="email" /><AuthField label="Password" name="password" type="password" autoComplete="current-password" /><div className="text-right text-xs font-bold"><Link className="text-[#1453bb] hover:underline" href="/forgot-password">Forgot password?</Link></div><button className="mt-2 flex h-12 items-center justify-center gap-2 rounded-lg bg-[#1453bb] text-sm font-extrabold text-white transition hover:bg-[#0b3f91] disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={submitting}>{submitting ? "Signing in…" : <>Sign in <Arrow /></>}</button></form><p className="mt-6 text-center text-xs font-semibold text-[#53627a]">New to Hollyway? <Link className="font-extrabold text-[#1453bb] hover:underline" href="/signup">Create an account</Link></p></AuthShell>;
}
