"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { Arrow } from "../../../components/ui/Arrow";
import { apiFetch } from "../../../components/api/apiFetch";
import { getCustomerApiBaseUrl } from "../../../components/config/customerApi";
import {
  AuthError,
  AuthShell,
  AuthSuccess,
  PasswordField,
} from "../components/AuthShared";

export default function ResetPasswordPage() {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setToken(new URLSearchParams(window.location.search).get("token") || "");
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    const form = new FormData(event.currentTarget);
    if (!token) {
      setError("This reset link is missing or invalid.");
      return;
    }
    if (form.get("password") !== form.get("confirmPassword")) {
      setError("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    try {
      const response = await apiFetch(
        `${getCustomerApiBaseUrl()}/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, password: form.get("password") }),
        },
        {
          successMessage: "Password reset successfully.",
          errorMessage: "Unable to reset your password. Please try again.",
        },
      );
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof payload.detail === "string" ? payload.detail : "Unable to reset your password.");
      setSuccess("Your password has been reset. You can now sign in.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to reset your password.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      kicker="RESET PASSWORD"
      title="Choose a new password."
      description="Set a new password for your Hollyway user account."
    >
      <form className="mt-7 grid gap-4" onSubmit={submit}>
        <AuthError message={error} />
        <AuthSuccess message={success} />
        <PasswordField label="New password" name="password" autoComplete="new-password" minLength={8} />
        <PasswordField
          label="Confirm new password"
          name="confirmPassword"
          autoComplete="new-password"
          minLength={8}
        />
        <button
          className="mt-2 flex h-12 items-center justify-center gap-2 rounded-lg bg-[#1453bb] text-sm font-extrabold text-white transition hover:bg-[#0b3f91] disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          disabled={submitting || !token || Boolean(success)}
        >
          {submitting ? "Updating password…" : <>Update password <Arrow /></>}
        </button>
      </form>
      <p className="mt-6 text-center text-xs font-semibold text-[#53627a]">
        <Link className="font-extrabold text-[#1453bb] hover:underline" href="/login">
          Return to sign in
        </Link>
      </p>
    </AuthShell>
  );
}
