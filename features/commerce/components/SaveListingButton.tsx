"use client";

import { useState } from "react";
import { useDashboard } from "../../dashboard/components/DashboardShell";

export default function SaveListingButton({ code, name }: { code: string; name: string }) {
  const { savedListingCodes, toggleSavedListing } = useDashboard();
  const [busy, setBusy] = useState(false);
  const saved = savedListingCodes.has(code.toUpperCase());

  async function toggleSaved() {
    if (busy) return;
    setBusy(true);
    try { await toggleSavedListing(code); } finally { setBusy(false); }
  }

  return <button className={`grid h-7 w-7 place-items-center rounded-full border border-white/70 bg-white/95 shadow-sm disabled:cursor-wait disabled:opacity-50 ${saved ? "text-[#dd6b12]" : "text-[#5c5f6b] hover:text-[#dd6b12]"}`} type="button" onClick={() => void toggleSaved()} disabled={busy} aria-pressed={saved} aria-label={saved ? `Remove ${name} from saved listings` : `Save ${name}`} title={saved ? "Saved" : "Save listing"}><svg className="h-3.5 w-3.5" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.2-4.6-9.6-9.1C.8 8.6 2.3 5 5.8 4.3c2-.4 3.9.5 5 2.1a5.4 5.4 0 0 1 5-2.1c3.5.7 5 4.3 3.4 7.6C19.2 16.4 12 21 12 21Z" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg></button>;
}
