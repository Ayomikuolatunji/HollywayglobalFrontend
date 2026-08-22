"use client";

import Link from "next/link";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Arrow, Brand } from "../components/SiteHeader";

const customerApiBaseUrl = (process.env.NEXT_PUBLIC_HOLLYWAY_API_BASE_URL || "https://staging-api.hollywayglobal.com").replace(/\/$/, "");

type CustomerAccount = {
  name: string;
  email: string;
};

type DashboardContextValue = {
  accountName: string;
  accountEmail: string;
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function useDashboard() {
  const value = useContext(DashboardContext);
  if (!value) throw new Error("useDashboard must be used inside DashboardShell");
  return value;
}

const navigation = [
  ["Overview", "/dashboard", "grid"],
  ["Marketplace", "/dashboard/marketplace", "store"],
  ["My listings", "/dashboard/listings", "box"],
  ["Wanted requests", "/dashboard/requests", "search"],
  ["Orders & escrow", "/dashboard/orders", "shield"],
  ["Deliveries & relocations", "/dashboard/logistics", "truck"],
  ["Services & events", "/dashboard/services", "tool"],
  ["Agro & crafts", "/dashboard/agro-crafts", "store"],
  ["Referrals & reseller", "/dashboard/referrals", "users"],
  ["Ads & promotions", "/dashboard/advertising", "grid"],
  ["Wallet & payouts", "/dashboard/wallet", "shield"],
] as const;

const accountNavigation = [
  ["Profile & KYC", "/dashboard/profile", "shield"],
  ["Notifications", "/dashboard/notifications", "bell"],
  ["Settings", "/dashboard/settings", "settings"],
] as const;

export function DashboardIcon({ name }: { name: string }) {
  if (name === "grid") return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>;
  if (name === "store") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10v9h16v-9M3 10l2-6h14l2 6M3 10c0 1.3 1 2.3 2.3 2.3S7.6 11.3 7.6 10c0 1.3 1 2.3 2.3 2.3s2.3-1 2.3-2.3c0 1.3 1 2.3 2.3 2.3s2.3-1 2.3-2.3c0 1.3 1 2.3 2.3 2.3S21 11.3 21 10" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /></svg>;
  if (name === "box") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 7 8-4 8 4v10l-8 4-8-4V7Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /><path d="m4 7 8 4 8-4M12 11v10" fill="none" stroke="currentColor" strokeWidth="1.7" /></svg>;
  if (name === "search") return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.3" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="m16 16 4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
  if (name === "shield") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 20 6v5.5c0 4.7-3.2 7.7-8 9.5-4.8-1.8-8-4.8-8-9.5V6l8-3Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /><path d="m8.5 12 2.2 2.2 4.8-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  if (name === "truck") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h11v10H3zM14 9h4l3 3v4h-7z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /><circle cx="7" cy="18" r="2" fill="none" stroke="currentColor" strokeWidth="1.7" /><circle cx="18" cy="18" r="2" fill="none" stroke="currentColor" strokeWidth="1.7" /></svg>;
  if (name === "tool") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14.5 6.5 3-3a5 5 0 0 0-6.4 6.4l-7.6 7.6a2 2 0 0 0 2.8 2.8l7.6-7.6a5 5 0 0 0 6.4-6.4l-3 3-2.8-.8-.8-2.8Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /></svg>;
  if (name === "bell") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  if (name === "settings") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="m19.4 15 .1.1-1.6 2.7-.2-.1a2.3 2.3 0 0 0-2.4 0l-.2.1-1.6-2.7.1-.1a2.3 2.3 0 0 0 0-2.1l-.1-.2 1.6-2.7.2.1a2.3 2.3 0 0 0 2.4 0l.2-.1 1.6 2.7-.1.2a2.3 2.3 0 0 0 0 2.1ZM4.6 15l-.1.1 1.6 2.7.2-.1a2.3 2.3 0 0 1 2.4 0l.2.1 1.6-2.7-.1-.1a2.3 2.3 0 0 1 0-2.1l.1-.2-1.6-2.7-.2.1a2.3 2.3 0 0 1-2.4 0l-.2-.1-1.6 2.7.1.2a2.3 2.3 0 0 1 0 2.1Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3" fill="none" stroke="currentColor" strokeWidth="1.7" /><circle cx="17" cy="9" r="2.3" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="M3.5 19c.5-3 2.3-4.6 5.5-4.6s5 1.6 5.5 4.6M14 15c2.8-.4 5 .9 5.7 3.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>;
}

function MenuIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
}

function CloseIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
}

function BellIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function DashboardAccessState({ status, onRetry }: { status: "unauthenticated" | "error"; onRetry: () => void }) {
  return <section className="dashboardInlineAccess"><div className="dashboardAccessCard"><span className="dashboardAccessMark">H</span><span className="sectionKicker">HOLLYWAY GLOBAL</span><h1>{status === "error" ? "Dashboard unavailable" : "Sign in to continue"}</h1><p>{status === "error" ? "We could not reach the Hollyway service. Check that the API is running and try again." : "Your dashboard is protected. Sign in with your Hollyway user account to continue."}</p><div className="dashboardAccessActions">{status === "error" && <button className="dashboardAccessSecondary" type="button" onClick={onRetry}>Try again</button>}<a className="dashboardAccessPrimary" href="/login">{status === "error" ? "Open sign in" : "Go to sign in"}<Arrow /></a></div><Link className="dashboardAccessHome" href="/">Return to Hollyway Global</Link></div></section>;
}

export default function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sessionState, setSessionState] = useState<"authenticated" | "unauthenticated" | "error">("authenticated");
  const [account, setAccount] = useState<CustomerAccount | null>(null);

  useEffect(() => {
    const previousTheme = document.documentElement.dataset.theme;
    document.documentElement.dataset.theme = "light";
    return () => {
      if (previousTheme) document.documentElement.dataset.theme = previousTheme;
      else delete document.documentElement.dataset.theme;
    };
  }, []);

  const loadCustomerSession = useCallback(() => {
    fetch(`${customerApiBaseUrl}/dashboard`, { credentials: "include" })
      .then(async (response) => {
        if (response.status === 401) {
          setSessionState("unauthenticated");
          return;
        }
        if (!response.ok) throw new Error("User session request failed");
        const payload = await response.json();
        setAccount({ name: String(payload.user?.name || "Hollyway user"), email: String(payload.user?.email || "") });
        setSessionState("authenticated");
      })
      .catch(() => setSessionState("error"));
  }, []);

  useEffect(() => {
    loadCustomerSession();
  }, [loadCustomerSession]);

  async function signOut() {
    await fetch(`${customerApiBaseUrl}/auth/logout`, { method: "POST", credentials: "include" }).catch(() => null);
    window.location.assign("/login");
  }

  const accountName = account?.name || "Hollyway user";
  const accountInitial = accountName.trim().charAt(0).toUpperCase() || "H";

  return (
    <main className="dashboardPage">
      <div className={`dashboardOverlay${sidebarOpen ? " visible" : ""}`} onClick={() => setSidebarOpen(false)} aria-hidden="true" />
      <aside className={`dashboardSidebar${sidebarOpen ? " open" : ""}`}>
        <div className="dashboardBrandRow"><Brand /><button className="dashboardClose" type="button" onClick={() => setSidebarOpen(false)} aria-label="Close navigation"><CloseIcon /></button></div>
        <div className="dashboardWorkspace"><span>HOLLYWAY GLOBAL</span><strong>User workspace</strong></div>
        <nav className="dashboardNav" aria-label="Dashboard navigation">
          <span className="dashboardNavLabel">WORKSPACE</span>
          {navigation.map(([label, href, icon]) => {
            const active = href === "/dashboard" ? pathname === href : pathname.startsWith(href);
            return <Link className={`dashboardNavItem${active ? " active" : ""}`} href={href} key={label} onClick={() => setSidebarOpen(false)}><DashboardIcon name={icon} /><span>{label}</span>{active && <i />}</Link>;
          })}
          <span className="dashboardNavLabel dashboardNavLabelAccount">ACCOUNT</span>
          {accountNavigation.map(([label, href, icon]) => <Link className={`dashboardNavItem${pathname.startsWith(href) ? " active" : ""}`} href={href} key={label} onClick={() => setSidebarOpen(false)}><DashboardIcon name={icon} /><span>{label}</span></Link>)}
        </nav>
        <div className="dashboardSidebarBottom">
          <Link className="dashboardHelp" href="/#contact" onClick={() => setSidebarOpen(false)}><span className="dashboardHelpIcon">?</span><span><b>Need help?</b><small>Chat with Hollyway Admin</small></span><Arrow /></Link>
          <div className="dashboardAccount"><span className="dashboardAvatar">{accountInitial}</span><span><b>{accountName}</b><small>{account?.email || "Personal workspace"}</small></span><button className="dashboardSignOut" type="button" onClick={signOut}>Sign out</button></div>
        </div>
      </aside>
      <section className="dashboardMain">
        <header className="dashboardTopbar"><button className="dashboardMenu" type="button" onClick={() => setSidebarOpen(true)} aria-label="Open navigation"><MenuIcon /></button><div className="dashboardTopTitle"><span className="sectionKicker">USER DASHBOARD</span><h1>Overview</h1></div><div className="dashboardTopActions"><button className="dashboardIconButton" type="button" aria-label="Notifications"><BellIcon /><span /></button><div className="dashboardTopAvatar">{accountInitial}</div></div></header>
        <div className="dashboardContent">{sessionState === "authenticated" ? <DashboardContext.Provider value={{ accountName, accountEmail: account?.email || "" }}>{children}</DashboardContext.Provider> : <DashboardAccessState status={sessionState} onRetry={loadCustomerSession} />}</div>
      </section>
    </main>
  );
}
