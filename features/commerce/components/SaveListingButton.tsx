"use client";

import { useEffect, useState } from "react";

const savedListingsKey = "hollyway-saved-listing-codes";

function readSavedListings() {
  try { const value = JSON.parse(window.localStorage.getItem(savedListingsKey) || "[]"); return Array.isArray(value) ? value.map(String) : []; } catch { return []; }
}

export default function SaveListingButton({ code, name }: { code: string; name: string }) {
  const [saved, setSaved] = useState(false);
  useEffect(() => { setSaved(readSavedListings().includes(code)); }, [code]);

  function toggleSaved() {
    const current = readSavedListings();
    const next = current.includes(code) ? current.filter((item) => item !== code) : [...current, code];
    window.localStorage.setItem(savedListingsKey, JSON.stringify(next));
    setSaved(next.includes(code));
  }

  return <button className={`grid h-7 w-7 place-items-center rounded-full border border-white/70 bg-white/95 shadow-sm ${saved ? "text-[#dd6b12]" : "text-[#5c5f6b] hover:text-[#dd6b12]"}`} type="button" onClick={toggleSaved} aria-pressed={saved} aria-label={saved ? `Remove ${name} from saved listings` : `Save ${name}`} title={saved ? "Saved" : "Save listing"}><svg className="h-3.5 w-3.5" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.2-4.6-9.6-9.1C.8 8.6 2.3 5 5.8 4.3c2-.4 3.9.5 5 2.1a5.4 5.4 0 0 1 5-2.1c3.5.7 5 4.3 3.4 7.6C19.2 16.4 12 21 12 21Z" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg></button>;
}
