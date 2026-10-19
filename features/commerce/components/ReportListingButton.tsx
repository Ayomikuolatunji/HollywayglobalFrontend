"use client";

import { useState, type FormEvent } from "react";
import { ApiResponseError } from "../../../components/api/apiResponse";
import Dropdown from "../../../components/forms/Dropdown";
import { reportMarketplaceListing } from "../data/listingApi";

const reasons = ["Misleading details", "Counterfeit or suspicious item", "Unsafe item or conduct", "Listing is unavailable", "Other"];
const reasonKey: Record<string, string> = { "Misleading details": "misleading", "Counterfeit or suspicious item": "counterfeit", "Unsafe item or conduct": "unsafe", "Listing is unavailable": "unavailable", Other: "other" };

export default function ReportListingButton({ reference }: { reference: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true); setError(""); setMessage("");
    try { await reportMarketplaceListing(reference, reasonKey[reason] || "", details); setMessage("Report sent. Hollyway will review it."); setReason(""); setDetails(""); } catch (value) { setError(value instanceof ApiResponseError ? value.message : "The listing report could not be sent."); } finally { setBusy(false); }
  }

  return <div className="mt-5 border-t border-[#eef1f4] pt-4"><button className="text-[10px] font-extrabold text-[#a32929] hover:underline" onClick={() => setOpen((value) => !value)} type="button">Report this listing</button>{open && <form className="mt-3 rounded-lg border border-[#f3c4c4] bg-[#fff8f8] p-4" onSubmit={submit}><p className="text-xs leading-5 text-[#53627a]">Tell Hollyway what needs attention. Do not share passwords, OTPs or identity numbers.</p><Dropdown compact label="Reason" name="report_reason" options={reasons.map((value) => ({ value, label: value }))} value={reason} onChange={setReason} /><label className="mt-3 grid gap-1.5 text-[11px] font-extrabold text-[#31425e]"><span>Details (optional)</span><textarea className="min-h-20 rounded-lg border border-[#dfe4ed] bg-white p-3 text-xs font-medium outline-none focus:border-[#1453bb]" onChange={(event) => setDetails(event.target.value)} placeholder="What happened?" value={details} /></label>{error && <p className="mt-2 text-xs font-semibold text-[#a32929]" role="alert">{error}</p>}{message && <p className="mt-2 text-xs font-semibold text-[#216b39]" role="status">{message}</p>}<button className="mt-3 h-9 rounded-lg bg-[#a32929] px-3 text-[10px] font-extrabold text-white disabled:opacity-60" disabled={busy || !reason} type="submit">{busy ? "Sending…" : "Send report"}</button></form>}</div>;
}
