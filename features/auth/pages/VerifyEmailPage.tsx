"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { Arrow } from "../../../components/ui/Arrow";
import { getCustomerApiBaseUrl } from "../../../components/config/customerApi";
import {
  AuthError,
  AuthField,
  AuthShell,
  AuthSuccess,
} from "../components/AuthShared";


export default function VerifyEmailPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setEmail(params.get("email") || "");
    const queryError = params.get("error");
    if (queryError) setError(queryError);
  }, []);

  async function verify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    const requestedEmail = email.trim();
    if (!requestedEmail) {
      setError("Enter the email address you used to create your Hollyway account.");
      return;
    }
    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the 6-digit verification code from your email.");
      return;
    }
    setVerifying(true);
    try {
      const response = await fetch(`${getCustomerApiBaseUrl()}/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: requestedEmail, otp }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(
          typeof payload.detail === "string"
            ? payload.detail
            : "That verification code is invalid or expired.",
        );
      }
      setVerified(true);
      setSuccess("Your email has been verified. You can now sign in.");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to verify your email.",
      );
    } finally {
      setVerifying(false);
    }
  }

  async function resendCode() {
    setError("");
    setSuccess("");
    const requestedEmail = email.trim();
    if (!requestedEmail) {
      setError("Enter the email address used to create your Hollyway account first.");
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch(`${getCustomerApiBaseUrl()}/auth/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: requestedEmail }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(
          typeof payload.detail === "string"
            ? payload.detail
            : "Unable to send a new verification code.",
        );
      }
      setOtp("");
      setSuccess("A new 6-digit verification code has been sent.");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to send a new verification code.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      kicker="VERIFY EMAIL"
      title={verified ? "Email verified." : "Enter your verification code."}
      description={
        verified
          ? "Your Hollyway account is ready. Sign in to continue."
          : "Enter the 6-digit code sent to your email before signing in."
      }
    >
      {verified ? (
        <AuthSuccess message={success} />
      ) : (
        <>
          <AuthError message={error} />
          <p className="mt-7 text-sm leading-6 text-[#53627a]">
            {email ? (
              <>Enter the 6-digit verification code sent to <strong>{email}</strong>.</>
            ) : (
              "Enter your email address and the 6-digit code from your inbox."
            )}
          </p>
          <p className="mt-2 text-xs leading-5 text-[#8995a8]">
            Check your spam or promotions folder if it is not in your inbox.
          </p>
          <form className="mt-5 grid gap-4" noValidate onSubmit={verify}>
            <AuthField
              label="Email address"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <AuthField
              label="6-digit verification code"
              name="otp"
              type="text"
              autoComplete="one-time-code"
              inputMode="numeric"
              maxLength={6}
              pattern="[0-9]{6}"
              value={otp}
              onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
            />
            <button
              className="flex h-12 items-center justify-center gap-2 rounded-lg bg-[#1453bb] text-sm font-extrabold text-white transition hover:bg-[#0b3f91] disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              disabled={verifying || submitting}
            >
              {verifying ? "Verifying code…" : <>Verify email <Arrow /></>}
            </button>
          </form>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold text-[#53627a]">
            <span>Didn’t receive the code?</span>
            <button
              className="font-extrabold text-[#1453bb] hover:underline disabled:cursor-not-allowed disabled:opacity-60"
              type="button"
              onClick={() => void resendCode()}
              disabled={verifying || submitting}
            >
              {submitting ? "Sending code…" : "Resend verification code"}
            </button>
          </div>
        </>
      )}
      <p className="mt-6 text-center text-xs font-semibold text-[#53627a]">
        <Link className="font-extrabold text-[#1453bb] hover:underline" href="/login">
          Return to sign in
        </Link>
      </p>
    </AuthShell>
  );
}
