"use client";

import Image from "next/image";
import Link from "next/link";
import { Arrow } from "../../../components/ui/Arrow";
import ProfileMenu from "./ProfileMenu";

function MenuIcon() {
  return (
    <svg className="h-[17px] w-[17px]" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 7h16M4 12h16M4 17h16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function HeaderCartIcon() {
  return (
    <svg
      className="h-[15px] w-[15px]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <circle cx="8" cy="20" r="1.4" />
      <circle cx="17" cy="20" r="1.4" />
      <path
        d="M2 4h2l2.4 12.2a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 2-1.6L21 8H6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeaderNotificationIcon() {
  return (
    <svg
      className="h-[15px] w-[15px]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path
        d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M13.7 21a2 2 0 0 1-3.4 0" strokeLinecap="round" />
    </svg>
  );
}

type DashboardHeaderProps = {
  title: string;
  cartCount: number;
  accountInitial: string;
  accountName: string;
  accountEmail: string;
  profilePictureUrl: string;
  onOpenMenu: () => void;
  onSignOut: () => Promise<void>;
};

export default function DashboardHeader({
  title,
  cartCount,
  accountInitial,
  accountName,
  accountEmail,
  profilePictureUrl,
  onOpenMenu,
  onSignOut,
}: DashboardHeaderProps) {
  return (
    <>
      <header className="sticky top-0 z-20 flex min-h-[58px] items-center justify-between bg-[#14213d] px-4 lg:hidden">
        <div className="flex min-w-0 items-center gap-2">
          <button
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/[.08] text-white"
            type="button"
            onClick={onOpenMenu}
            aria-label="Open navigation"
          >
            <MenuIcon />
          </button>
          <Link className="flex min-w-0 items-center gap-2" href="/dashboard">
            <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg">
              <Image
                src="/site-logo.png"
                alt="Hollyway Global logo"
                fill
                priority
                sizes="32px"
                className="object-contain"
              />
            </span>
            <span className="leading-none">
              <strong className="block text-[13px] font-semibold text-white">Hollyway</strong>
              <small className="mt-1 block text-[9px] font-semibold tracking-[.08em] text-[#dd6b12]">
                GLOBAL
              </small>
            </span>
          </Link>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <Link
            className="relative grid h-8 w-8 place-items-center rounded-full bg-white/[.08] text-white"
            href="/dashboard/cart"
            aria-label={cartCount ? `Cart, ${cartCount} items` : "Cart, empty"}
          >
            <HeaderCartIcon />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[#dd6b12] px-1 text-[8px] font-bold text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>
          <Link
            className="relative grid h-8 w-8 place-items-center rounded-full bg-white/[.08] text-white"
            href="/dashboard/notifications"
            aria-label="Notifications"
          >
            <HeaderNotificationIcon />
          </Link>
          <ProfileMenu
            accountInitial={accountInitial}
            accountName={accountName}
            accountEmail={accountEmail}
            profilePictureUrl={profilePictureUrl}
            onSignOut={onSignOut}
          />
        </div>
      </header>
      <header className="hidden items-center justify-between px-8 pb-3 pt-4 lg:flex">
        <div>
          <span className="block text-[11px] font-semibold tracking-[.03em] text-[#9498a3] dark:text-[#8290a8]">
            User dashboard
          </span>
          <h1 className="mt-0.5 font-[Manrope] text-[19px] font-semibold tracking-[-.02em] text-[#12141c] dark:text-[#f4f7fb]">
            {title}
          </h1>
        </div>
        <div className="flex items-center gap-3.5">
          <Link
            className="relative grid h-8 w-8 place-items-center rounded-full border border-[#e4e2da] bg-white text-[#5c5f6b] hover:border-[#14213d] dark:border-[#2a374e] dark:bg-[#121d30] dark:text-[#c9d2e2] dark:hover:border-[#dd6b12]"
            href="/dashboard/cart"
            aria-label={cartCount ? `Cart, ${cartCount} items` : "Cart, empty"}
          >
            <HeaderCartIcon />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[#dd6b12] px-1 text-[8px] font-bold text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>
          <Link
            className="relative grid h-8 w-8 place-items-center rounded-full border border-[#e4e2da] bg-white text-[#5c5f6b] hover:border-[#14213d] dark:border-[#2a374e] dark:bg-[#121d30] dark:text-[#c9d2e2] dark:hover:border-[#dd6b12]"
            href="/dashboard/notifications"
            aria-label="Notifications"
          >
            <HeaderNotificationIcon />
          </Link>
          <Link
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#dd6b12] px-3.5 text-[13px] font-semibold text-white hover:bg-[#b8560d]"
            href="/dashboard/listings/new"
          >
            List an item <Arrow />
          </Link>
          <ProfileMenu
            accountInitial={accountInitial}
            accountName={accountName}
            accountEmail={accountEmail}
            profilePictureUrl={profilePictureUrl}
            onSignOut={onSignOut}
          />
        </div>
      </header>
    </>
  );
}
