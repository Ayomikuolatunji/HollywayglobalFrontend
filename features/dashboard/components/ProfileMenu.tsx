"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type ProfileMenuProps = {
  accountInitial: string;
  accountName: string;
  accountEmail: string;
  profilePictureUrl: string;
  onSignOut: () => Promise<void>;
};

export default function ProfileMenu({
  accountInitial,
  accountName,
  accountEmail,
  profilePictureUrl,
  onSignOut,
}: ProfileMenuProps) {
  const [open, setOpen] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => setImageFailed(false), [profilePictureUrl]);

  useEffect(() => {
    if (!open) return;

    function closeOnOutsideClick(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="grid h-[30px] w-[30px] place-items-center rounded-full bg-[#14213d] text-xs font-bold text-white outline-none ring-[#dd6b12] transition hover:bg-[#24385f] focus-visible:ring-2 dark:bg-[#dd6b12] dark:hover:bg-[#b8560d]"
        type="button"
        aria-label="Open account menu"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((current) => !current)}
      >
        {profilePictureUrl && !imageFailed ? (
          <img
            className="h-full w-full rounded-full object-cover"
            src={profilePictureUrl}
            alt=""
            onError={() => setImageFailed(true)}
          />
        ) : (
          accountInitial
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-60 overflow-hidden rounded-xl border border-[#e4e2da] bg-white shadow-xl shadow-[#061936]/15 dark:border-[#2a374e] dark:bg-[#121d30]">
          <div className="border-b border-[#eeeae1] px-4 py-3 dark:border-[#2a374e]">
            <p className="truncate text-sm font-bold text-[#12141c] dark:text-[#f4f7fb]">
              {accountName}
            </p>
            <p className="mt-0.5 truncate text-[11px] text-[#7a7d88] dark:text-[#9eabc0]">
              {accountEmail || "Hollyway account"}
            </p>
          </div>

          <nav className="p-1.5" aria-label="Account navigation" role="menu">
            <Link
              className="block rounded-lg px-3 py-2.5 text-xs font-semibold text-[#3b4b6b] hover:bg-[#f5f4f0] dark:text-[#c9d2e2] dark:hover:bg-[#1b2a43]"
              href="/dashboard/profile"
              role="menuitem"
              onClick={closeMenu}
            >
              Profile &amp; KYC
            </Link>
            <Link
              className="block rounded-lg px-3 py-2.5 text-xs font-semibold text-[#3b4b6b] hover:bg-[#f5f4f0] dark:text-[#c9d2e2] dark:hover:bg-[#1b2a43]"
              href="/dashboard/profile/business-upgrade"
              role="menuitem"
              onClick={closeMenu}
            >
              Business upgrade
            </Link>
            <Link
              className="block rounded-lg px-3 py-2.5 text-xs font-semibold text-[#3b4b6b] hover:bg-[#f5f4f0] dark:text-[#c9d2e2] dark:hover:bg-[#1b2a43]"
              href="/dashboard/settings"
              role="menuitem"
              onClick={closeMenu}
            >
              Settings
            </Link>
          </nav>

          <div className="border-t border-[#eeeae1] p-1.5 dark:border-[#2a374e]">
            <button
              className="w-full rounded-lg px-3 py-2.5 text-left text-xs font-bold text-[#3b4b6b] hover:bg-[#f5f4f0] dark:text-[#c9d2e2] dark:hover:bg-[#1b2a43]"
              type="button"
              role="menuitem"
              onClick={() => {
                closeMenu();
                void onSignOut();
              }}
            >
              Switch account
            </button>
            <button
              className="w-full rounded-lg px-3 py-2.5 text-left text-xs font-bold text-[#b8560d] hover:bg-[#fff4eb] dark:text-[#f2a06a] dark:hover:bg-[#2a2030]"
              type="button"
              role="menuitem"
              onClick={() => {
                closeMenu();
                void onSignOut();
              }}
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
