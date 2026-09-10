"use client";

import type { FormEvent, ReactNode } from "react";
import Link from "next/link";
import DashboardIcon from "./DashboardIcon";
import type { AccountSettings } from "../data/accountApi";

export type NotificationKey =
  | "email_updates"
  | "listing_activity"
  | "request_updates"
  | "order_updates"
  | "service_updates";

type SettingsFormProps = {
  accountEmail: string;
  settings: AccountSettings;
  savingKey: string;
  passwordError: string;
  passwordMessage: string;
  passwordSaving: boolean;
  onThemeChange: (theme: AccountSettings["theme"]) => void;
  onNotificationChange: (key: NotificationKey, value: boolean) => void;
  onPasswordSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

const inputClass =
  "h-11 rounded-lg border border-[#dfe4ed] bg-white px-3 text-sm font-medium text-[#12141c] outline-none placeholder:text-[#9aa6b7] transition focus:border-[#1453bb] focus:ring-4 focus:ring-[#1453bb]/10 dark:border-[#33445f] dark:bg-[#0f1a2c] dark:text-[#f4f7fb] dark:placeholder:text-[#71809a]";

const notificationOptions: ReadonlyArray<{
  key: NotificationKey;
  title: string;
  description: string;
  icon: string;
}> = [
  {
    key: "email_updates",
    title: "Email updates",
    description: "Important account, review and transaction notices.",
    icon: "bell",
  },
  {
    key: "listing_activity",
    title: "Listing activity",
    description: "Buyer interest, listing review and featured-post updates.",
    icon: "box",
  },
  {
    key: "request_updates",
    title: "Request updates",
    description: "Changes to wanted requests and responses from Hollyway.",
    icon: "search",
  },
  {
    key: "order_updates",
    title: "Order and delivery updates",
    description: "Order confirmation, inspection, dispatch and completion updates.",
    icon: "truck",
  },
  {
    key: "service_updates",
    title: "Service and escrow updates",
    description: "Professional service, escrow and account-action notifications.",
    icon: "shield",
  },
];

function Section({
  kicker,
  title,
  description,
  children,
}: {
  kicker: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-[#e4e2da] bg-white p-5 shadow-sm transition-colors dark:border-[#2a374e] dark:bg-[#121d30] sm:p-6">
      <div className="border-b border-[#e4e2da] pb-4 dark:border-[#2a374e]">
        <span className="text-[10px] font-extrabold tracking-[.15em] text-[#b8560d]">
          {kicker}
        </span>
        <h2 className="mt-1 font-[Manrope] text-lg font-extrabold tracking-[-.03em] text-[#12141c] dark:text-[#f4f7fb]">
          {title}
        </h2>
        {description && (
          <p className="mt-1 max-w-2xl text-xs leading-5 text-[#5c5f6b] dark:text-[#9eabc0]">
            {description}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

function Toggle({
  checked,
  disabled,
  label,
  onChange,
}: {
  checked: boolean;
  disabled: boolean;
  label: string;
  onChange: () => void;
}) {
  return (
    <button
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${
        checked ? "bg-[#dd6b12]" : "bg-[#cbd5e1] dark:bg-[#43506a]"
      } disabled:cursor-wait disabled:opacity-60`}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onChange}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${
          checked ? "left-6" : "left-1"
        }`}
      />
    </button>
  );
}

export default function SettingsForm({
  accountEmail,
  settings,
  savingKey,
  passwordError,
  passwordMessage,
  passwordSaving,
  onThemeChange,
  onNotificationChange,
  onPasswordSubmit,
}: SettingsFormProps) {
  return (
    <div className="space-y-5">
      <Section
        kicker="APPEARANCE"
        title="Dashboard theme"
        description="Your appearance preference is saved to this Hollyway account and applied on future visits."
      >
        <div className="flex items-center gap-4 pt-5">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#edf4ff] text-[#1453bb] dark:bg-[#202d44] dark:text-[#f1b578]">
            <DashboardIcon name={settings.theme === "dark" ? "moon" : "sun"} />
          </span>
          <div className="min-w-0 flex-1">
            <strong className="block text-sm font-bold text-[#12141c] dark:text-[#f4f7fb]">
              Dark mode
            </strong>
            <p className="mt-1 text-xs leading-5 text-[#5c5f6b] dark:text-[#9eabc0]">
              Reduce glare across the dashboard. This setting affects only your Hollyway workspace.
            </p>
          </div>
          <Toggle
            checked={settings.theme === "dark"}
            disabled={savingKey === "theme"}
            label="Toggle dark mode"
            onChange={() => onThemeChange(settings.theme === "dark" ? "light" : "dark")}
          />
        </div>
      </Section>

      <Section
        kicker="NOTIFICATIONS"
        title="Notification preferences"
        description="Choose which updates Hollyway may send for activity in your workspace."
      >
        <div className="divide-y divide-[#e4e2da] dark:divide-[#2a374e]">
          {notificationOptions.map((option) => (
            <div className="flex items-center gap-4 py-4 last:pb-0" key={option.key}>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#f5f4f0] text-[#53627a] dark:bg-[#202d44] dark:text-[#b7c3d6] [&>svg]:h-4 [&>svg]:w-4">
                <DashboardIcon name={option.icon} />
              </span>
              <div className="min-w-0 flex-1">
                <strong className="block text-xs font-bold text-[#12141c] dark:text-[#f4f7fb]">
                  {option.title}
                </strong>
                <p className="mt-1 text-[11px] leading-5 text-[#5c5f6b] dark:text-[#9eabc0]">
                  {option.description}
                </p>
              </div>
              <Toggle
                checked={settings[option.key]}
                disabled={savingKey === option.key}
                label={`Toggle ${option.title}`}
                onChange={() => onNotificationChange(option.key, !settings[option.key])}
              />
            </div>
          ))}
        </div>
      </Section>

      <Section
        kicker="SECURITY"
        title="Change password"
        description={`Update the password for ${
          accountEmail || "your Hollyway account"
        }. Google-only accounts should use the password reset flow first.`}
      >
        <form className="pt-5" onSubmit={onPasswordSubmit}>
          {passwordError && (
            <p
              className="mb-4 rounded-lg border border-[#f3caca] bg-[#fff5f5] px-3 py-2 text-xs font-semibold leading-5 text-[#a32929]"
              role="alert"
            >
              {passwordError}
            </p>
          )}
          {passwordMessage && (
            <p
              className="mb-4 rounded-lg border border-[#bfe5d0] bg-[#f1fbf5] px-3 py-2 text-xs font-semibold leading-5 text-[#14733d]"
              role="status"
            >
              {passwordMessage}
            </p>
          )}
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="grid gap-2 text-[11px] font-extrabold text-[#31425e] dark:text-[#b7c3d6]">
              <span>Current password</span>
              <input
                className={inputClass}
                name="currentPassword"
                type="password"
                autoComplete="current-password"
                required
              />
            </label>
            <label className="grid gap-2 text-[11px] font-extrabold text-[#31425e] dark:text-[#b7c3d6]">
              <span>New password</span>
              <input
                className={inputClass}
                name="newPassword"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
              />
            </label>
            <label className="grid gap-2 text-[11px] font-extrabold text-[#31425e] dark:text-[#b7c3d6]">
              <span>Confirm new password</span>
              <input
                className={inputClass}
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
              />
            </label>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <p className="text-[10px] leading-4 text-[#8995a8]">
                Use at least 8 characters. Your current session stays signed in after the change.
              </p>
              <Link
                className="text-[10px] font-extrabold text-[#1453bb] hover:underline"
                href="/forgot-password"
              >
                Forgot your password?
              </Link>
            </div>
            <button
              className="inline-flex h-10 items-center justify-center rounded-lg bg-[#14213d] px-4 text-xs font-extrabold text-white transition hover:bg-[#24325a] disabled:cursor-wait disabled:opacity-60"
              type="submit"
              disabled={passwordSaving}
            >
              {passwordSaving ? "Updating password…" : "Update password"}
            </button>
          </div>
        </form>
      </Section>
    </div>
  );
}
