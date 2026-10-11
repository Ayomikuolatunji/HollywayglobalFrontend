"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import DashboardPageHeader from "../components/DashboardPageHeader";
import SettingsForm, { type NotificationKey } from "../components/SettingsForm";
import { useDashboard } from "../components/DashboardShell";
import {
  AccountApiError,
  changePassword,
  fetchAccountSettings,
  type AccountSettings,
  updateAccountSettings,
} from "../data/accountApi";

const defaultSettings: AccountSettings = {
  theme: "light",
  email_updates: true,
  listing_activity: true,
  request_updates: true,
  order_updates: true,
  service_updates: true,
};

export default function SettingsPage() {
  const { accountEmail, theme, setTheme, signOut } = useDashboard();
  const [settings, setSettings] = useState<AccountSettings>({ ...defaultSettings, theme });
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState("");
  const [loadError, setLoadError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const saveSequence = useRef(0);

  useEffect(() => {
    if (!accountEmail) return;
    let active = true;
    setLoading(true);
    fetchAccountSettings()
      .then((remote) => {
        if (!active) return;
        setSettings(remote);
        setTheme(remote.theme);
      })
      .catch((requestError) => {
        if (!active) return;
        setLoadError(
          requestError instanceof AccountApiError
            ? requestError.message
            : "Your saved settings could not be loaded. You can still update them and retry.",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [accountEmail, setTheme]);

  async function saveSetting(
    key: "theme" | NotificationKey,
    changes: Partial<Omit<AccountSettings, "updated_at">>,
  ) {
    const requestId = ++saveSequence.current;
    const previous = settings;
    setSettings((current) => ({ ...current, ...changes }));
    if (changes.theme) setTheme(changes.theme);
    setSavingKey(key);
    setLoadError("");
    try {
      const remote = await updateAccountSettings(changes);
      if (requestId !== saveSequence.current) return;
      setSettings(remote);
      if (changes.theme) setTheme(remote.theme);
    } catch (requestError) {
      if (requestId !== saveSequence.current) return;
      setSettings(previous);
      if (changes.theme) setTheme(previous.theme);
      setLoadError(
        requestError instanceof Error
          ? requestError.message
          : "That setting could not be saved. Please try again.",
      );
    } finally {
      if (requestId === saveSequence.current) setSavingKey("");
    }
  }

  function handleThemeChange(nextTheme: AccountSettings["theme"]) {
    void saveSetting("theme", { theme: nextTheme });
  }

  function handleNotificationChange(key: NotificationKey, value: boolean) {
    void saveSetting(key, { [key]: value });
  }

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordError("");
    setPasswordMessage("");
    const form = new FormData(event.currentTarget);
    const currentPassword = String(form.get("currentPassword") || "");
    const newPassword = String(form.get("newPassword") || "");
    const confirmPassword = String(form.get("confirmPassword") || "");
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    setPasswordSaving(true);
    try {
      setPasswordMessage(await changePassword({ currentPassword, newPassword }));
      event.currentTarget.reset();
    } catch (requestError) {
      setPasswordError(
        requestError instanceof Error
          ? requestError.message
          : "Your password could not be changed.",
      );
    } finally {
      setPasswordSaving(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-[980px] space-y-6 p-5 sm:p-8">
      <DashboardPageHeader
        kicker="ACCOUNT"
        title="Settings"
        description="Manage your dashboard appearance, account notifications and sign-in security."
      />
      {loadError && (
        <p
          className="rounded-lg border border-[#f1d8a9] bg-[#fffaf1] px-4 py-3 text-xs font-semibold leading-5 text-[#6b5a3d]"
          role="alert"
        >
          {loadError}
        </p>
      )}
      {loading ? (
        <div className="rounded-xl border border-[#e4e2da] bg-white p-6 text-sm text-[#53627a] dark:border-[#2a374e] dark:bg-[#121d30] dark:text-[#b7c3d6]">
          Loading your saved settings…
        </div>
      ) : (
        <SettingsForm
          accountEmail={accountEmail}
          settings={settings}
          savingKey={savingKey}
          passwordError={passwordError}
          passwordMessage={passwordMessage}
          passwordSaving={passwordSaving}
          onThemeChange={handleThemeChange}
          onNotificationChange={handleNotificationChange}
          onPasswordSubmit={handlePasswordSubmit}
          onSignOut={signOut}
        />
      )}
    </div>
  );
}
