"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Arrow } from "./ui/Arrow";
import Brand from "./ui/Brand";
import BrandIcon from "./ui/BrandIcon";

const adminWhatsApp = `https://wa.me/2347015585967?text=${encodeURIComponent("Hello Hollyway Admin, I would like to make an enquiry.")}`;
const navLinks = [["Home", "/"], ["How it works", "#how"], ["Categories", "#categories"], ["Fees & requests", "#pricing"], ["Logistics", "#logistics"], ["About us", "/about"], ["Testimonials", "/testimonials"], ["Contact", "#contact"]] as const;

export function SocialIcon({ name }: { name: string }) {
  const iconName = ["whatsapp", "instagram", "x", "facebook", "linkedin", "tiktok", "group"].includes(name) ? name as "whatsapp" | "instagram" | "x" | "facebook" | "linkedin" | "tiktok" | "group" : "group";
  return <BrandIcon name={iconName} className="h-4 w-4" />;
}

export default function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => setMenuOpen(false), [pathname]);
  return <header className="sticky top-0 z-50 border-b border-[#dfe4ed] bg-[#eef1f5]/95 backdrop-blur-xl"><div className="mx-auto flex min-h-[78px] w-[calc(100%-40px)] max-w-[1280px] items-center gap-5 lg:w-[calc(100%-64px)]"><Brand /><button className="ml-auto flex h-9 w-9 flex-col justify-center gap-1.5 rounded-lg border border-[#dfe4ed] bg-white p-2 lg:hidden" type="button" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle menu" aria-expanded={menuOpen}><span className="h-0.5 w-full bg-[#0b1830]" /><span className="h-0.5 w-full bg-[#0b1830]" /><span className="h-0.5 w-full bg-[#0b1830]" /></button><nav className={`${menuOpen ? "flex" : "hidden"} absolute left-5 right-5 top-[70px] flex-col gap-1 rounded-xl border border-[#dfe4ed] bg-white p-3 shadow-xl lg:static lg:flex lg:flex-1 lg:flex-row lg:items-center lg:justify-center lg:gap-5 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none`}>{navLinks.map(([label, href]) => { const target = href.startsWith("#") && pathname !== "/" ? `/${href}` : href; const active = href === "/" ? pathname === "/" : href.startsWith("/") && pathname === href; return <Link className={`rounded-md px-2 py-2 text-[10px] font-bold whitespace-nowrap ${active ? "text-[#ff8a00]" : "text-[#344054] hover:text-[#ff8a00]"}`} href={target} key={href} onClick={() => setMenuOpen(false)}>{label}</Link>; })}</nav><a className="hidden items-center gap-2 rounded-lg bg-[#061936] px-3 py-3 text-[10px] font-extrabold text-white hover:bg-[#1453bb] sm:inline-flex" href={adminWhatsApp} target="_blank" rel="noreferrer"><SocialIcon name="whatsapp" /> Chat with admin <Arrow /></a></div></header>;
}
