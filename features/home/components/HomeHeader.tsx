"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import CustomerAccountLink from "../../../components/CustomerAccountLink";
import HomeBrand from "./HomeBrand";
import { navLinks } from "../data";

export default function HomeHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#dfe4ed] bg-[#eef1f5]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[78px] w-[calc(100%-40px)] max-w-[1280px] items-center gap-6 lg:w-[calc(100%-64px)]">
        <HomeBrand />
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          className="ml-auto flex h-9 w-9 flex-col justify-center gap-1.5 rounded-lg border-0 bg-transparent p-2 lg:hidden"
        >
          <span className="h-0.5 w-full bg-[#0b1830]" />
          <span className="h-0.5 w-full bg-[#0b1830]" />
          <span className="h-0.5 w-full bg-[#0b1830]" />
        </button>
        <nav
          className={`${menuOpen ? "flex" : "hidden"} absolute left-5 right-5 top-[70px] flex-col gap-1 rounded-xl border border-[#dfe4ed] bg-white p-3 shadow-xl lg:static lg:flex lg:flex-1 lg:flex-row lg:items-center lg:justify-center lg:gap-7 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none`}
        >
          {navLinks.map(([label, href]) => {
            const target = href.startsWith("#") && pathname !== "/" ? `/${href}` : href;
            const active =
              href === "/" ? pathname === "/" : href.startsWith("/") && pathname === href;
            return (
              <Link
                key={href}
                href={target}
                onClick={() => setMenuOpen(false)}
                className={`rounded-md px-2 py-2 text-[11px] font-bold whitespace-nowrap ${active ? "text-[#ff8a00]" : "text-[#344054] hover:text-[#ff8a00]"}`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <CustomerAccountLink />
        </div>
      </div>
    </header>
  );
}
