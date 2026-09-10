"use client";

import Link from "next/link";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { Arrow } from "../../../components/ui/Arrow";
import { getCustomerApiBaseUrl } from "../../../components/config/customerApi";
import {
  getOrderCartItemCount,
  orderCartUpdatedEvent,
  readOrderCart,
} from "../../commerce/data/orderCart";
import { fetchAccountSettings } from "../data/accountApi";
import { fetchKycStatus } from "../data/kycApi";
import {
  getKycStorageKey,
  hasKycSubmission,
  isKycComplete,
  readKycLocalState,
  resolveKycStatus,
} from "../data/kyc";
import DashboardHeader from "./DashboardHeader";
import DashboardMobileTabs from "./DashboardMobileTabs";
import DashboardSidebar, { dashboardPageTitle } from "./DashboardSidebar";
import KycDraftBanner from "./KycDraftBanner";
import KycPromptModal from "./KycPromptModal";

type CustomerAccount = { name: string; email: string };
export type DashboardTheme = "light" | "dark";

type DashboardContextValue = {
  accountName: string;
  accountEmail: string;
  theme: DashboardTheme;
  setTheme: (theme: DashboardTheme) => void;
};

const DashboardContext = createContext<DashboardContextValue | null>(null);
const dashboardThemeStorageKey = "hollyway-dashboard-theme";

export function useDashboard() {
  const value = useContext(DashboardContext);
  if (!value) throw new Error("useDashboard must be used inside DashboardShell");
  return value;
}

function DashboardAccessState({
  status,
  onRetry,
}: {
  status: "unauthenticated" | "error";
  onRetry: () => void;
}) {
  const unavailable = status === "error";

  return (
    <section className="grid min-h-[70vh] place-items-center p-6">
      <div className="w-full max-w-lg rounded-2xl border border-[#e4e2da] bg-white p-8 text-center shadow-xl shadow-[#061936]/10">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#14213d] font-[Manrope] font-extrabold text-white">
          H
        </span>
        <span className="mt-6 block text-[10px] font-extrabold tracking-[.2em] text-[#dd6b12]">
          HOLLYWAY GLOBAL
        </span>
        <h2 className="mt-3 font-[Manrope] text-3xl font-extrabold tracking-[-.05em] text-[#12141c]">
          {unavailable ? "Dashboard unavailable" : "Sign in to continue"}
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#5c5f6b]">
          {unavailable
            ? "We could not reach the Hollyway service. Check the API connection and try again."
            : "Your dashboard is protected. Sign in with your Hollyway user account to continue."}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          {unavailable && (
            <button
              className="h-11 rounded-lg border border-[#e4e2da] px-4 text-xs font-extrabold text-[#3b4b6b]"
              type="button"
              onClick={onRetry}
            >
              Try again
            </button>
          )}
          <Link
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#14213d] px-4 text-xs font-extrabold text-white"
            href="/login"
          >
            {unavailable ? "Open sign in" : "Go to sign in"}
            <Arrow />
          </Link>
        </div>
        <Link className="mt-5 block text-xs font-bold text-[#14213d] hover:underline" href="/">
          Return to Hollyway Global
        </Link>
      </div>
    </section>
  );
}

export default function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sessionState, setSessionState] = useState<
    "authenticated" | "unauthenticated" | "error"
  >("authenticated");
  const [account, setAccount] = useState<CustomerAccount | null>(null);
  const [kycComplete, setKycComplete] = useState(false);
  const [kycIdentityName, setKycIdentityName] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [showKycPrompt, setShowKycPrompt] = useState(false);
  const [theme, setThemeState] = useState<DashboardTheme>("light");
  const accountEmail = account?.email || "";

  const setTheme = useCallback((nextTheme: DashboardTheme) => {
    setThemeState(nextTheme);
    try {
      window.localStorage.setItem(dashboardThemeStorageKey, nextTheme);
    } catch {
      // A restricted browser store must not interrupt dashboard navigation.
    }
  }, []);

  const loadCustomerSession = useCallback(async () => {
    try {
      const response = await fetch(`${getCustomerApiBaseUrl()}/dashboard`, {
        credentials: "include",
      });
      if (response.status === 401) {
        setSessionState("unauthenticated");
        return;
      }
      if (!response.ok) throw new Error("User session request failed");
      const payload = await response.json();
      setAccount({
        name: String(payload.user?.name || "Hollyway user"),
        email: String(payload.user?.email || ""),
      });
      setSessionState("authenticated");
    } catch {
      setSessionState("error");
    }
  }, []);

  useEffect(() => {
    void loadCustomerSession();
  }, [loadCustomerSession]);

  useEffect(() => {
    if (!accountEmail) {
      setKycIdentityName("");
      setShowKycPrompt(false);
      return;
    }
    const localStatus = readKycLocalState(getKycStorageKey(accountEmail)).status;
    const localComplete = isKycComplete(localStatus);
    setKycComplete(localComplete);
    if (pathname === "/dashboard") {
      setShowKycPrompt(!localComplete && !hasKycSubmission(localStatus));
    }
    let active = true;
    fetchKycStatus()
      .then((remote) => {
        if (!active) return;
        setKycIdentityName(remote.legal_full_name?.trim() || "");
        const nextStatus = resolveKycStatus(remote.status, localStatus);
        const remoteComplete = isKycComplete(nextStatus);
        setKycComplete(remoteComplete);
        if (pathname === "/dashboard") {
          setShowKycPrompt(!remoteComplete && !hasKycSubmission(nextStatus));
        }
      })
      .catch(() => null);
    return () => {
      active = false;
    };
  }, [accountEmail, pathname]);

  useEffect(() => {
    if (!accountEmail) return;
    let active = true;
    fetchAccountSettings()
      .then((remote) => {
        if (active) setTheme(remote.theme);
      })
      .catch(() => null);
    return () => {
      active = false;
    };
  }, [accountEmail, setTheme]);

  useEffect(() => {
    const syncCart = () => setCartCount(getOrderCartItemCount(readOrderCart()));
    syncCart();
    window.addEventListener(orderCartUpdatedEvent, syncCart);
    window.addEventListener("storage", syncCart);
    return () => {
      window.removeEventListener(orderCartUpdatedEvent, syncCart);
      window.removeEventListener("storage", syncCart);
    };
  }, []);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(dashboardThemeStorageKey);
      if (saved === "dark") setThemeState("dark");
    } catch {
      // Use the light default when browser storage is unavailable.
    }
  }, []);

  async function signOut() {
    await fetch(`${getCustomerApiBaseUrl()}/auth/logout`, {
      method: "POST",
      credentials: "include",
    }).catch(() => null);
    window.location.assign("/login");
  }

  const accountName = kycIdentityName || "Hollyway user";
  const accountInitial = accountName.trim().charAt(0).toUpperCase() || "H";

  return (
    <main
      className={`${
        theme === "dark" ? "dark" : ""
      } min-h-screen bg-[#f5f4f0] text-[#12141c] transition-colors dark:bg-[#0b1220] dark:text-[#e8edf7]`}
    >
      <button
        className={`fixed inset-0 z-30 bg-[#12141c]/40 transition lg:hidden ${
          sidebarOpen
            ? "visible opacity-100"
            : "pointer-events-none invisible opacity-0"
        }`}
        type="button"
        onClick={() => setSidebarOpen(false)}
        aria-label="Close navigation"
      />
      <DashboardSidebar
        open={sidebarOpen}
        pathname={pathname}
        accountName={accountName}
        accountEmail={accountEmail}
        accountInitial={accountInitial}
        onClose={() => setSidebarOpen(false)}
        onSignOut={signOut}
      />
      <section className="min-h-screen pb-20 lg:ml-[232px] lg:pb-0">
        <DashboardHeader
          title={dashboardPageTitle(pathname)}
          cartCount={cartCount}
          accountInitial={accountInitial}
          onOpenMenu={() => setSidebarOpen(true)}
        />
        {sessionState === "authenticated" &&
          !kycComplete &&
          pathname !== "/dashboard/profile/kyc" && (
            <div className="px-4 sm:px-6 lg:px-8">
              <KycDraftBanner />
            </div>
          )}
        {sessionState === "authenticated" ? (
          <DashboardContext.Provider
            value={{ accountName, accountEmail, theme, setTheme }}
          >
            {children}
          </DashboardContext.Provider>
        ) : (
          <DashboardAccessState
            status={sessionState}
            onRetry={loadCustomerSession}
          />
        )}
      </section>
      <DashboardMobileTabs pathname={pathname} />
      {showKycPrompt &&
        sessionState === "authenticated" &&
        pathname === "/dashboard" && (
          <KycPromptModal onSkip={() => setShowKycPrompt(false)} />
        )}
    </main>
  );
}
