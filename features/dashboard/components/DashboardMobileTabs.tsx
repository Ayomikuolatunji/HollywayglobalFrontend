import Link from "next/link";
import DashboardIcon from "./DashboardIcon";

const tabs = [["Overview", "/dashboard", "grid"], ["Cart", "/dashboard/cart", "cart"], ["Orders", "/dashboard/orders", "shield"], ["Account", "/dashboard/profile", "users"]] as const;

export default function DashboardMobileTabs({ pathname }: { pathname: string }) {
  return <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-[#e4e2da] bg-white px-1.5 pb-[max(10px,env(safe-area-inset-bottom))] pt-2 dark:border-[#2a374e] dark:bg-[#121d30] lg:hidden" aria-label="Mobile dashboard navigation">{tabs.map(([label, href, icon]) => { const active = href === "/dashboard" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`); return <Link className={`flex flex-1 flex-col items-center gap-0.5 text-[10px] font-semibold ${active ? "text-[#b8560d]" : "text-[#9498a3] dark:text-[#8290a8]"}`} href={href} key={href}><span className="h-[19px] w-[19px] [&>svg]:h-full [&>svg]:w-full [&>svg]:fill-none"><DashboardIcon name={icon} /></span>{label}</Link>; })}</nav>;
}
