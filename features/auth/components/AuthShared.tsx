import Link from "next/link";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Arrow } from "../../../components/ui/Arrow";
import Brand from "../../../components/ui/Brand";
import BrandIcon from "../../../components/ui/BrandIcon";
import {
  getCustomerApiBaseUrl,
  productionCustomerApiBaseUrl,
} from "../../../components/config/customerApi";

export function AuthShell({
  kicker,
  title,
  description,
  children,
}: {
  kicker: string;
  title: ReactNode;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#eef1f5] text-[#0b1830]">
      <header className="flex min-h-[78px] items-center justify-between border-b border-[#dfe4ed] bg-white px-5 sm:px-8 lg:px-[max(32px,calc((100%-1180px)/2))]">
        <Brand />
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[10px] font-extrabold text-[#1453bb] transition hover:text-[#0b1830]"
        >
          Return to website <Arrow />
        </Link>
      </header>
      <section className="mx-auto grid min-h-[calc(100vh-78px)] w-[calc(100%-40px)] max-w-[1080px] items-center gap-10 py-12 lg:w-[calc(100%-56px)] lg:grid-cols-[1fr_.72fr] lg:gap-[90px] lg:py-[70px]">
        <div>
          <span className="text-[10px] font-extrabold tracking-[.2em] text-[#ff8a00]">
            HOLLYWAY USER ACCOUNT
          </span>
          <h1 className="mt-4 font-[Manrope] text-[clamp(36px,5vw,68px)] font-extrabold leading-[.98] tracking-[-.07em] text-[#0b1830]">
            Your marketplace,
            <br />
            <em className="font-serif font-medium tracking-[-.06em] text-[#1453bb]">
              all in one place.
            </em>
          </h1>
          <p className="mt-6 max-w-[470px] text-[15px] leading-7 text-[#53627a]">
            Track listings, wanted requests, orders, deliveries, escrow, services, and account
            verification from your user dashboard.
          </p>
          <div className="mt-8 grid gap-3 text-[12px] font-bold text-[#31425e]">
            <span>✓ One secure user account</span>
            <span>✓ Track every Hollyway reference</span>
            <span>✓ Get help from the Admin desk</span>
          </div>
        </div>
        <div className="rounded-2xl border border-[#dfe4ed] bg-white p-6 shadow-xl shadow-[#061936]/10 sm:p-8">
          <span className="mb-5 flex h-9 w-9 items-center justify-center rounded-full bg-[#1453bb] font-[Manrope] text-sm font-extrabold text-white">
            H
          </span>
          <span className="text-[10px] font-extrabold tracking-[.2em] text-[#ff8a00]">
            {kicker}
          </span>
          <h2 className="mt-3 font-[Manrope] text-[30px] font-extrabold leading-tight tracking-[-.05em] text-[#0b1830]">
            {title}
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#53627a]">{description}</p>
          {children}
        </div>
      </section>
    </main>
  );
}

export function AuthField({
  label,
  name,
  type = "text",
  autoComplete,
  required = true,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2 text-[11px] font-extrabold text-[#31425e]">
      <span>{label}</span>
      <input
        className="h-12 rounded-lg border border-[#dfe4ed] bg-[#f8fafc] px-3 text-sm font-medium text-[#0b1830] outline-none transition placeholder:text-[#8b97a9] focus:border-[#1453bb] focus:bg-white focus:ring-4 focus:ring-[#1453bb]/10"
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
      />
    </label>
  );
}

export function AuthError({ message }: { message: string }) {
  return message ? (
    <p
      className="rounded-lg border border-[#f3caca] bg-[#fff5f5] px-3 py-2 text-xs font-semibold leading-5 text-[#a32929]"
      role="alert"
    >
      {message}
    </p>
  ) : null;
}

export function AuthSuccess({ message }: { message: string }) {
  return message ? (
    <p
      className="rounded-lg border border-[#bfe5d0] bg-[#f1fbf5] px-3 py-2 text-xs font-semibold leading-5 text-[#14733d]"
      role="status"
    >
      {message}
    </p>
  ) : null;
}

export function GoogleButton() {
  const [apiBaseUrl, setApiBaseUrl] = useState(productionCustomerApiBaseUrl);
  useEffect(() => setApiBaseUrl(getCustomerApiBaseUrl()), []);
  return (
    <a
      className="mt-7 flex h-12 items-center justify-center gap-3 rounded-lg border border-[#dfe4ed] bg-white text-sm font-extrabold text-[#0b1830] transition hover:border-[#1453bb] hover:bg-[#f8fafc]"
      href={`${apiBaseUrl}/auth/google`}
    >
      <BrandIcon name="google" className="h-5 w-5" />
      Continue with Google
    </a>
  );
}
