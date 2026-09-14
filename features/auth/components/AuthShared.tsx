import Link from "next/link";
import { useEffect, useState, type ChangeEventHandler, type ReactNode } from "react";
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
        <div className="hidden lg:block">
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
  defaultValue,
  value,
  onChange,
  inputMode,
  maxLength,
  pattern,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  defaultValue?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  inputMode?: "none" | "text" | "tel" | "url" | "email" | "numeric" | "decimal" | "search";
  maxLength?: number;
  pattern?: string;
}) {
  return (
    <label className="grid gap-2 text-[11px] font-extrabold text-[#31425e]">
      <span>{label}</span>
      <input
        className="h-12 rounded-lg border border-[#dfe4ed] bg-[#f8fafc] px-3 text-sm font-medium text-[#0b1830] outline-none transition placeholder:text-[#8b97a9] focus:border-[#1453bb] focus:bg-white focus:ring-4 focus:ring-[#1453bb]/10"
        name={name}
        type={type}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        inputMode={inputMode}
        maxLength={maxLength}
        pattern={pattern}
        required={required}
      />
    </label>
  );
}

function PasswordEye({ visible }: { visible: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      {visible ? (
        <>
          <path strokeLinecap="round" strokeLinejoin="round" d="m3 3 18 18" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.58 10.58a2 2 0 0 0 2.83 2.83M9.88 4.24A10.8 10.8 0 0 1 12 4c5.05 0 8.42 4.26 9.5 6a17.3 17.3 0 0 1-3.07 3.56M6.61 6.61C4.82 7.83 3.55 9.46 2.5 10.99 3.58 12.73 6.95 17 12 17c1.61 0 3.04-.4 4.28-1.03"
          />
        </>
      ) : (
        <>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.5 12S5.87 6 12 6s9.5 6 9.5 6-3.37 6-9.5 6-9.5-6-9.5-6Z"
          />
          <circle cx="12" cy="12" r="2.5" />
        </>
      )}
    </svg>
  );
}

export function PasswordField({
  label,
  name,
  autoComplete,
  minLength,
}: {
  label: string;
  name: string;
  autoComplete?: string;
  minLength?: number;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <label className="grid gap-2 text-[11px] font-extrabold text-[#31425e]">
      <span>{label}</span>
      <span className="relative block">
        <input
          className="h-12 w-full rounded-lg border border-[#dfe4ed] bg-[#f8fafc] px-3 pr-12 text-sm font-medium text-[#0b1830] outline-none transition placeholder:text-[#8b97a9] focus:border-[#1453bb] focus:bg-white focus:ring-4 focus:ring-[#1453bb]/10"
          name={name}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          minLength={minLength}
          required
        />
        <button
          aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          aria-pressed={visible}
          className="absolute inset-y-0 right-0 inline-flex w-11 items-center justify-center text-[#71809a] transition hover:text-[#1453bb] focus:outline-none focus:ring-4 focus:ring-[#1453bb]/10"
          type="button"
          onClick={() => setVisible((current) => !current)}
        >
          <PasswordEye visible={visible} />
        </button>
      </span>
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

export function GoogleButton({ referralCode = "" }: { referralCode?: string }) {
  const [apiBaseUrl, setApiBaseUrl] = useState(productionCustomerApiBaseUrl);
  useEffect(() => setApiBaseUrl(getCustomerApiBaseUrl()), []);
  const query = referralCode
    ? `?referral_code=${encodeURIComponent(referralCode)}`
    : "";
  return (
    <a
      className="mt-7 flex h-12 items-center justify-center gap-3 rounded-lg border border-[#dfe4ed] bg-white text-sm font-extrabold text-[#0b1830] transition hover:border-[#1453bb] hover:bg-[#f8fafc]"
      href={`${apiBaseUrl}/auth/google${query}`}
    >
      <BrandIcon name="google" className="h-5 w-5" />
      Continue with Google
    </a>
  );
}
