"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { apiFetch } from "../../../components/api/apiFetch";
import { getCustomerApiBaseUrl } from "../../../components/config/customerApi";
import {
  getOrderCartItemCount,
  orderCartUpdatedEvent,
  readOrderCart,
  writeOrderCart,
} from "../../commerce/data/orderCart";
import { fetchCart } from "../../commerce/data/cartApi";
import { accountProfileUpdatedEvent, fetchAccountSettings } from "../data/accountApi";
import {
  rememberCustomerAccount,
  registerCurrentCustomerSession,
} from "../../auth/data/accountSwitch";
import { fetchKycStatus } from "../data/kycApi";
import { fetchNotifications } from "../data/notificationsApi";
import { fetchSavedListingCodes, toggleSavedListing as toggleSavedListingApi } from "../../commerce/data/savedListingsApi";
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
import { DashboardAccessState, DashboardLoadingState } from "./DashboardSessionState";

type CustomerAccount = { id: string; name: string; email: string };
export type DashboardTheme = "light" | "dark";

type DashboardContextValue = {
  accountName: string;
  accountEmail: string;
  accountPhotoUrl: string;
  theme: DashboardTheme;
  setTheme: (theme: DashboardTheme) => void;
  signOut: () => Promise<void>;
  savedListingCodes: ReadonlySet<string>;
  toggleSavedListing: (code: string) => Promise<void>;
};

const DashboardContext = createContext<DashboardContextValue | null>(null);
const dashboardThemeStorageKey = "hollyway-dashboard-theme";

export function useDashboard() {
  const value = useContext(DashboardContext);
  if (!value) throw new Error("useDashboard must be used inside DashboardShell");
  return value;
}

export default function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sessionState, setSessionState] = useState<
    "loading" | "authenticated" | "unauthenticated" | "error"
  >("loading");
  const [account, setAccount] = useState<CustomerAccount | null>(null);
  const [kycComplete, setKycComplete] = useState(false);
  const [kycIdentityName, setKycIdentityName] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);
  const [savedListingCodes, setSavedListingCodes] = useState<Set<string>>(new Set());
  const [showKycPrompt, setShowKycPrompt] = useState(false);
  const [kycStatusLoaded, setKycStatusLoaded] = useState(false);
  const [kycHasSubmission, setKycHasSubmission] = useState(false);
  const [theme, setThemeState] = useState<DashboardTheme>("light");
  const [accountPhotoUrl, setAccountPhotoUrl] = useState("");
  const [accountPhotoPath, setAccountPhotoPath] = useState("");
  const accountEmail = account?.email || "";

  const toggleSavedListing = useCallback(async (code: string) => {
    const normalized = code.trim().toUpperCase();
    const currentlySaved = savedListingCodes.has(normalized);
    await toggleSavedListingApi(normalized, currentlySaved);
    setSavedListingCodes((current) => {
      const next = new Set(current);
      if (currentlySaved) next.delete(normalized);
      else next.add(normalized);
      return next;
    });
  }, [savedListingCodes]);

  const setTheme = useCallback((nextTheme: DashboardTheme) => {
    setThemeState(nextTheme);
    try {
      window.localStorage.setItem(dashboardThemeStorageKey, nextTheme);
    } catch {
      // A restricted browser store must not interrupt dashboard navigation.
    }
  }, []);

  const loadCustomerSession = useCallback(async (signal?: AbortSignal) => {
    try {
      const response = await fetch(`${getCustomerApiBaseUrl()}/dashboard`, {
        credentials: "include",
        signal,
      });
      if (response.status === 401) {
        setAccount(null);
        setAccountPhotoUrl("");
        setAccountPhotoPath("");
        setSessionState("unauthenticated");
        return;
      }
      if (!response.ok) throw new Error("User session request failed");
      const payload = await response.json();
      const rawProfilePictureUrl = String(payload.user?.profile_picture_url || "");
      if (/^https?:\/\//.test(rawProfilePictureUrl)) {
        setAccountPhotoPath("");
        setAccountPhotoUrl(rawProfilePictureUrl);
      } else if (rawProfilePictureUrl.startsWith("/")) {
        setAccountPhotoUrl("");
        setAccountPhotoPath(
          `${getCustomerApiBaseUrl()}${rawProfilePictureUrl}?v=${Date.now()}`,
        );
      } else {
        setAccountPhotoPath("");
        setAccountPhotoUrl("");
      }
      const currentAccount = {
        id: String(payload.user?.id || ""),
        name: String(payload.user?.name || "Hollyway user"),
        email: String(payload.user?.email || ""),
      };
      setAccount(currentAccount);
      rememberCustomerAccount(currentAccount);
      void registerCurrentCustomerSession().catch(() => null);
      setSessionState("authenticated");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setAccount(null);
      setAccountPhotoUrl("");
      setAccountPhotoPath("");
      setSessionState("error");
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void loadCustomerSession(controller.signal);
    return () => controller.abort();
  }, [loadCustomerSession]);

  useEffect(() => {
    if (!accountPhotoPath) return;
    let active = true;
    let objectUrl = "";
    const controller = new AbortController();
    fetch(accountPhotoPath, { credentials: "include", signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Profile picture request failed");
        return response.blob();
      })
      .then((blob) => {
        objectUrl = URL.createObjectURL(blob);
        if (active) setAccountPhotoUrl(objectUrl);
        else URL.revokeObjectURL(objectUrl);
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        if (active) setAccountPhotoUrl("");
      });
    return () => {
      active = false;
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [accountPhotoPath]);

  useEffect(() => {
    const refreshAccount = (event: Event) => {
      const detail = event instanceof CustomEvent ? event.detail : null;
      const verifiedName =
        detail && typeof detail.kycName === "string" ? detail.kycName.trim() : "";
      if (verifiedName) setKycIdentityName(verifiedName);
      void loadCustomerSession();
    };
    window.addEventListener(accountProfileUpdatedEvent, refreshAccount);
    return () => window.removeEventListener(accountProfileUpdatedEvent, refreshAccount);
  }, [loadCustomerSession]);

  useEffect(() => {
    if (!accountEmail) {
      setKycIdentityName("");
      setShowKycPrompt(false);
      setKycStatusLoaded(false);
      setKycHasSubmission(false);
      setSavedListingCodes(new Set());
      return;
    }
    setKycIdentityName("");
    setKycStatusLoaded(false);
    const localStatus = readKycLocalState(getKycStorageKey(accountEmail)).status;
    const localComplete = isKycComplete(localStatus);
    setKycComplete(localComplete);
    setKycHasSubmission(hasKycSubmission(localStatus));
    let active = true;
    const controller = new AbortController();
    fetchKycStatus(controller.signal)
      .then((remote) => {
        if (!active) return;
        const nextStatus = resolveKycStatus(remote.status, localStatus);
        setKycIdentityName(
          nextStatus === "approved" ? remote.legal_full_name?.trim() || "" : "",
        );
        const remoteComplete = isKycComplete(nextStatus);
        setKycComplete(remoteComplete);
        setKycHasSubmission(hasKycSubmission(nextStatus));
        setKycStatusLoaded(true);
      })
      .catch((error) => {
        if (!(error instanceof DOMException && error.name === "AbortError") && active) {
          setKycStatusLoaded(true);
        }
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [accountEmail]);

  useEffect(() => {
    if (!accountEmail) return;
    let active = true;
    fetchSavedListingCodes()
      .then((codes) => { if (active) setSavedListingCodes(new Set(codes)); })
      .catch(() => { if (active) setSavedListingCodes(new Set()); });
    return () => { active = false; };
  }, [accountEmail]);

  useEffect(() => {
    if (!accountEmail) return;
    let active = true;
    fetchCart()
      .then((items) => { if (active) writeOrderCart(items); })
      .catch(() => null);
    return () => { active = false; };
  }, [accountEmail]);

  useEffect(() => {
    if (!accountEmail) { setNotificationCount(0); return; }
    let active = true;
    fetchNotifications("all", 1)
      .then((page) => { if (active) setNotificationCount(page.unread_count); })
      .catch(() => { if (active) setNotificationCount(0); });
    return () => { active = false; };
  }, [accountEmail]);

  useEffect(() => {
    if (!accountEmail || !kycStatusLoaded) {
      setShowKycPrompt(false);
      return;
    }
    setShowKycPrompt(pathname === "/dashboard" && !kycComplete && !kycHasSubmission);
  }, [accountEmail, kycComplete, kycHasSubmission, kycStatusLoaded, pathname]);

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
    await apiFetch(
      `${getCustomerApiBaseUrl()}/auth/logout`,
      { method: "POST", credentials: "include" },
      { notify: false },
    ).catch(() => null);
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
        onClose={() => setSidebarOpen(false)}
      />
      <section className="min-h-screen pb-20 lg:ml-[272px] lg:pb-0">
        <DashboardHeader
          title={dashboardPageTitle(pathname)}
          cartCount={cartCount}
          notificationCount={notificationCount}
          accountInitial={accountInitial}
          accountId={account?.id || ""}
          accountName={accountName}
          accountEmail={accountEmail}
          profilePictureUrl={accountPhotoUrl}
          onOpenMenu={() => setSidebarOpen(true)}
          onSignOut={signOut}
        />
        {sessionState === "authenticated" &&
          !kycComplete &&
          pathname !== "/dashboard/profile/kyc" && (
            <div className="px-4 pt-3 sm:px-6 lg:px-8">
              <KycDraftBanner />
            </div>
          )}
        {sessionState === "authenticated" ? (
          <DashboardContext.Provider
            value={{ accountName, accountEmail, accountPhotoUrl, theme, setTheme, signOut, savedListingCodes, toggleSavedListing }}
          >
            {children}
          </DashboardContext.Provider>
        ) : sessionState === "loading" ? (
          <DashboardLoadingState />
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
