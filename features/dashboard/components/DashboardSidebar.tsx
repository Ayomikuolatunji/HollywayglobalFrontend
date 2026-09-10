"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Arrow } from "../../../components/ui/Arrow";
import DashboardIcon from "./DashboardIcon";

type NavItem = readonly [string, string, string];
type NavGroup = { label: string; items: readonly NavItem[] };

const navigationGroups: readonly NavGroup[] = [
  { label: "COMMERCE", items: [["Marketplace", "/dashboard/marketplace", "store"], ["My listings", "/dashboard/listings", "box"], ["My requests", "/dashboard/requests", "search"], ["My orders", "/dashboard/orders", "shield"]] },
  { label: "OPERATIONS", items: [["Deliveries", "/dashboard/logistics", "truck"], ["Relocations", "/dashboard/relocation", "truck"]] },
  { label: "SERVICES", items: [["Professional services", "/dashboard/services", "tool"], ["Events", "/dashboard/events", "tool"], ["My escrow", "/dashboard/escrow", "shield"]] },
  { label: "PARTNERSHIPS & FINANCE", items: [["Referrals & reseller", "/dashboard/referrals", "users"], ["Ads & promotions", "/dashboard/advertising", "grid"], ["Wallet & payouts", "/dashboard/wallet", "wallet"]] },
  { label: "ACCOUNT", items: [["Profile & KYC", "/dashboard/profile", "shield"], ["Business upgrade", "/dashboard/profile/business-upgrade", "store"], ["Settings", "/dashboard/settings", "settings"]] },
];

function isActivePath(pathname: string, href: string) { return href === "/dashboard" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`); }
function isAccountPath(pathname: string, href: string) { return href === "/dashboard/profile" ? pathname === href || pathname === "/dashboard/profile/kyc" : isActivePath(pathname, href); }

export function dashboardPageTitle(pathname: string) {
  if (pathname.startsWith("/dashboard/marketplace/markets")) return "Marketplace";
  if (pathname.startsWith("/dashboard/marketplace/")) return "Listing details";
  if (pathname.startsWith("/dashboard/notifications")) return "Notifications";
  if (pathname.startsWith("/dashboard/help")) return "Help centre";
  if (pathname.startsWith("/dashboard/referrals")) return "Referrals";
  return new Map(navigationGroups.flatMap(({ items }) => items).map(([label, href]) => [href, label])).get(pathname) || "Overview";
}

function ChevronIcon({ open }: { open: boolean }) { return <svg className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function CloseIcon() { return <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>; }

function SidebarBrand() {
  return (
    <Link
      className="relative block h-9 w-9 overflow-hidden rounded-[10px]"
      href="/dashboard"
      aria-label="Hollyway Global dashboard"
    >
      <Image
        src="/site-logo.png"
        alt="Hollyway Global logo"
        fill
        priority
        sizes="36px"
        className="object-cover"
      />
    </Link>
  );
}

function SidebarLink({ item, pathname, onNavigate, account = false }: { item: NavItem; pathname: string; onNavigate: () => void; account?: boolean }) {
  const [label, href, icon] = item;
  const active = account ? isAccountPath(pathname, href) : isActivePath(pathname, href);
  return <Link className={`mb-px flex min-h-9 items-center gap-2.5 rounded-lg px-2 text-[13px] font-medium transition ${active ? "bg-[#dd6b12]/15 text-white" : "text-[#c9d0e2] hover:bg-white/[.06] hover:text-white"}`} href={href} onClick={onNavigate}><span className={`h-4 w-4 shrink-0 [&>svg]:h-full [&>svg]:w-full [&>svg]:fill-none ${active ? "text-[#dd6b12]" : "text-[#c9d0e2]/85"}`}><DashboardIcon name={icon} /></span><span>{label}</span>{active && <i className="ml-auto h-1.5 w-1.5 rounded-full bg-[#dd6b12]" />}</Link>;
}

type DashboardSidebarProps = { open: boolean; pathname: string; accountName: string; accountEmail: string; onClose: () => void };

export default function DashboardSidebar({ open, pathname, accountName, accountEmail, onClose }: DashboardSidebarProps) {
  const activeGroup = navigationGroups.find((group) => group.items.some(([, href]) => isActivePath(pathname, href)))?.label || "COMMERCE";
  const [openGroup, setOpenGroup] = useState("");
  useEffect(() => { setOpenGroup(activeGroup === "COMMERCE" || activeGroup === "ACCOUNT" || activeGroup === "PARTNERSHIPS & FINANCE" ? "" : activeGroup); }, [activeGroup, pathname]);

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 flex h-screen max-h-[100dvh] w-[232px] -translate-x-full flex-col overflow-y-auto overscroll-contain bg-[#14213d] px-[18px] pb-[calc(18px+env(safe-area-inset-bottom))] pt-6 text-[#c9d0e2] transition-transform lg:translate-x-0 ${open ? "translate-x-0" : ""}`}>
      <div className="shrink-0 border-b border-white/[.09] pb-[18px]"><div className="flex items-center gap-2"><SidebarBrand /><span className="min-w-0 flex-1 leading-tight"><strong className="block truncate text-[11px] font-semibold text-white">{accountName}</strong><small className="mt-1 block truncate text-[9px] text-[#c9d0e2]/60">{accountEmail || "Personal workspace"}</small></span><button className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-white/75 hover:bg-white/[.06] lg:hidden" type="button" onClick={onClose} aria-label="Close navigation"><CloseIcon /></button></div></div>
      <nav className="shrink-0 pt-[18px]" aria-label="Dashboard navigation">
        <SidebarLink item={["Overview", "/dashboard", "grid"]} pathname={pathname} onNavigate={onClose} />
        {navigationGroups.find(({ label }) => label === "COMMERCE") && <section><div className="px-2 pb-1 pt-3 text-[10px] font-semibold tracking-[.04em] text-[#c9d0e2]/50">COMMERCE</div><div>{navigationGroups.find(({ label }) => label === "COMMERCE")?.items.map((item) => <SidebarLink item={item} pathname={pathname} onNavigate={onClose} key={item[1]} />)}</div></section>}
        {navigationGroups.filter(({ label }) => label !== "ACCOUNT" && label !== "COMMERCE" && label !== "PARTNERSHIPS & FINANCE").map((group) => { const id = `dashboard-group-${group.label.toLowerCase().replace(/[^a-z]+/g, "-")}`; const groupOpen = openGroup === group.label; return <section key={group.label}><button className="flex w-full items-center justify-between px-2 pb-1 pt-3 text-left text-[10px] font-semibold tracking-[.04em] text-[#c9d0e2]/50" type="button" aria-expanded={groupOpen} aria-controls={id} onClick={() => setOpenGroup((current) => current === group.label ? "" : group.label)}><span>{group.label}</span><ChevronIcon open={groupOpen} /></button><div id={id} hidden={!groupOpen}>{group.items.map((item) => <SidebarLink item={item} pathname={pathname} onNavigate={onClose} key={item[1]} />)}</div></section>; })}
      </nav>
      <div className="shrink-0 border-t border-white/[.09] pt-3.5"><section><div className="px-2 pb-1 text-[10px] font-semibold tracking-[.04em] text-[#c9d0e2]/50">PARTNERSHIPS &amp; FINANCE</div><div>{navigationGroups.find(({ label }) => label === "PARTNERSHIPS & FINANCE")?.items.map((item) => <SidebarLink item={item} pathname={pathname} onNavigate={onClose} key={item[1]} />)}</div></section><section className="mt-2"><div className="px-2 pb-1 text-[10px] font-semibold tracking-[.04em] text-[#c9d0e2]/50">ACCOUNT</div><div>{navigationGroups.find(({ label }) => label === "ACCOUNT")?.items.map((item) => <SidebarLink item={item} pathname={pathname} onNavigate={onClose} account key={item[1]} />)}</div></section><Link className={`mb-2 mt-2 flex min-h-9 items-center gap-2.5 rounded-lg px-2 text-[13px] font-medium transition ${pathname.startsWith("/dashboard/help") ? "bg-[#dd6b12]/15 text-white" : "text-[#c9d0e2] hover:bg-white/[.06] hover:text-white"}`} href="/dashboard/help" onClick={onClose} aria-current={pathname.startsWith("/dashboard/help") ? "page" : undefined}><span className={`grid h-4 w-4 shrink-0 place-items-center rounded-full text-[10px] font-bold ${pathname.startsWith("/dashboard/help") ? "bg-[#dd6b12] text-white" : "bg-white/[.12] text-[#c9d0e2]"}`}>?</span><span>Support &amp; feedback</span>{pathname.startsWith("/dashboard/help") && <i className="ml-auto h-1.5 w-1.5 rounded-full bg-[#dd6b12]" />}</Link></div>
    </aside>
  );
}
