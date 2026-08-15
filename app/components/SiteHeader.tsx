"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const adminWhatsApp = `https://wa.me/2347015585967?text=${encodeURIComponent("Hello Hollyway Admin, I would like to make an enquiry.")}`;
const navLinks = [
  ["How it works", "#how"],
  ["Categories", "#categories"],
  ["Fees & requests", "#pricing"],
  ["Logistics", "#logistics"],
  ["About us", "/about"],
  ["Testimonials", "/testimonials"],
  ["Contact", "#contact"],
] as const;

export function Brand({ footer = false }: { footer?: boolean }) {
  return <a href="/" className={footer ? "brand brandFooter" : "brand"} aria-label="Hollyway Global home"><span className="brandMark" aria-hidden="true"><Image src="/brand-logo.png" alt="" width={80} height={80} priority={!footer} /></span><span className="brandName"><strong>HOLLYWAY</strong><small>GLOBAL</small></span></a>;
}

export function SocialIcon({ name }: { name: string }) {
  if (name === "whatsapp") return <svg className="socialSvg" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.2a9.7 9.7 0 0 0-8.4 14.55L2.2 21.8l5.2-1.36A9.8 9.8 0 1 0 12 2.2Zm0 17.65a8 8 0 0 1-4.08-1.12l-.3-.18-3.08.8.82-3-.2-.31A8.03 8.03 0 1 1 12 19.85Zm4.4-5.98c-.24-.12-1.43-.7-1.65-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.01-.37.1-.49.1-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.64.58.25 1.04.4 1.4.51.59.19 1.12.16 1.54.1.47-.07 1.43-.58 1.63-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.22-.46-.28Z" /></svg>;
  if (name === "instagram") return <svg className="socialSvg" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" /></svg>;
  if (name === "x") return <svg className="socialSvg" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4 19 20M19 4 5 20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /></svg>;
  if (name === "facebook") return <svg className="socialSvg" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.6 21v-8h2.7l.4-3h-3.1V8.1c0-.87.24-1.46 1.5-1.46h1.7V4a22 22 0 0 0-2.48-.13c-2.46 0-4.14 1.5-4.14 4.25V10H7.4v3h2.78v8h3.42Z" /></svg>;
  if (name === "tiktok") return <svg className="socialSvg" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M15.4 3c.2 1.65 1.12 2.9 2.6 3.55v2.6a7.3 7.3 0 0 1-2.58-.8v5.3A5.35 5.35 0 1 1 10.8 8.3v2.72a2.7 2.7 0 1 0 2 2.63V3h2.6Z" /></svg>;
  if (name === "group") return <svg className="socialSvg" viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="9" r="3" fill="none" stroke="currentColor" strokeWidth="1.8" /><circle cx="16.5" cy="10" r="2.3" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M3.5 18c.5-2.5 2.2-3.8 5.5-3.8s5 1.3 5.5 3.8M14 14.7c2.8-.3 4.7.8 5.3 3.3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
  return <svg className="socialSvg" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 4.5A1.5 1.5 0 1 1 5 7.5 1.5 1.5 0 0 1 5 4.5ZM3.7 9h2.6v11H3.7V9Zm4.2 0h2.5v1.5h.04c.35-.67 1.2-1.74 3-1.74 3.2 0 3.8 2.1 3.8 4.83V20h-2.6v-5.7c0-1.36-.02-3.1-1.9-3.1-1.9 0-2.2 1.48-2.2 3V20H7.9V9Z" /></svg>;
}

export function Arrow() {
  return <span className="arrowIcon" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M3 13 13 3M5 3h8v8" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg></span>;
}

function ThemeIcon({ dark }: { dark: boolean }) {
  return dark ? <svg className="themeSvg" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg> : <svg className="themeSvg" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.7 15.3A8.5 8.5 0 0 1 8.7 3.3 8.5 8.5 0 1 0 20.7 15.3Z" /></svg>;
}

export default function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("hollyway-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldUseDark = savedTheme ? savedTheme === "dark" : prefersDark;
    setDarkMode(shouldUseDark);
    document.documentElement.dataset.theme = shouldUseDark ? "dark" : "light";
  }, []);

  function toggleTheme() {
    const nextTheme = !darkMode;
    setDarkMode(nextTheme);
    document.documentElement.dataset.theme = nextTheme ? "dark" : "light";
    window.localStorage.setItem("hollyway-theme", nextTheme ? "dark" : "light");
  }

  return <header className="nav"><div className="navInner"><Brand /><button className="menuButton" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu" aria-expanded={menuOpen}><span></span><span></span><span></span></button><nav className={menuOpen ? "navLinks open" : "navLinks"}>{navLinks.map(([label, href]) => { const target = href.startsWith("#") && pathname !== "/" ? `/${href}` : href; return <a href={target} key={href} onClick={() => setMenuOpen(false)}>{label}</a>; })}</nav><div className="navActions"><button className="themeToggle" onClick={toggleTheme} aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"} title={darkMode ? "Switch to light mode" : "Switch to dark mode"}><ThemeIcon dark={darkMode} /></button><a className="navCta" href={adminWhatsApp} target="_blank" rel="noreferrer"><SocialIcon name="whatsapp" /> Chat with admin <Arrow /></a></div></div></header>;
}
