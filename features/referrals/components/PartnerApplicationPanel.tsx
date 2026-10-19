"use client";

import { useEffect, useState } from "react";
import DashboardIcon from "../../dashboard/components/DashboardIcon";
import {
  fetchReferralPartner,
  saveReferralPartner,
  type ReferralPartnerApplication,
} from "../data/partnerApi";

const earningOptions = [
  {
    value: "reseller_markup",
    label: "Reseller markup",
    detail: "Keep the agreed difference when you prepare a reseller order.",
  },
  {
    value: "escrow_commission",
    label: "Escrow fee commission",
    detail: "Earn the documented percentage on completed referred escrow activity.",
  },
  {
    value: "request_bounty",
    label: "Wanted-request bounty",
    detail: "Earn the documented bounty when a referred wanted request is paid.",
  },
] as const;

export default function PartnerApplicationPanel() {
  const [application, setApplication] = useState<ReferralPartnerApplication | null>(null);
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [bank, setBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    void fetchReferralPartner(controller.signal)
      .then(({ application: saved }) => {
        if (!saved) return;
        setApplication(saved);
        setCity(saved.city);
        setState(saved.state);
        setOptions(saved.earning_options);
        setBank(saved.settlement_bank_name || "");
        setConsent(saved.consent);
      })
      .catch((reason) => {
        if (!(reason instanceof DOMException && reason.name === "AbortError")) {
          setError(reason instanceof Error ? reason.message : "Partner information could not be loaded.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  const locked = application?.status === "pending_review" || application?.status === "approved";

  function toggleOption(value: string) {
    setOptions((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  }

  async function save(action: "draft" | "submit") {
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const result = await saveReferralPartner({
        action,
        city,
        state,
        earning_options: options,
        settlement_bank_name: bank,
        settlement_account_number: accountNumber,
        consent,
      });
      setApplication(result.application);
      setAccountNumber("");
      setNotice(action === "draft" ? "Your partner draft is saved." : "Your partner application is awaiting review.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Partner application could not be saved.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-xl border border-[#e4e2da] bg-white p-4 shadow-[0_1px_2px_rgba(18,20,28,.03)] sm:p-5" aria-labelledby="partner-application-title">
      <div className="flex items-start gap-3 border-b border-[#e4e2da] pb-4">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#edf4ff] text-[#1453bb] [&>svg]:h-4 [&>svg]:w-4"><DashboardIcon name="share" /></span>
        <div>
          <span className="text-[9px] font-bold uppercase tracking-[.14em] text-[#dd6b12]">PARTNER REGISTRATION</span>
          <h2 id="partner-application-title" className="mt-1 font-[Manrope] text-lg font-semibold text-[#12141c]">Become a referral partner</h2>
          <p className="mt-1 text-xs leading-5 text-[#5c5f6b]">Choose the earning routes you want Hollyway to review. Your account details come from your verified identity record.</p>
        </div>
      </div>

      {loading ? <p className="py-6 text-xs text-[#687895]">Loading your partner application…</p> : (
        <>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="text-[11px] font-bold text-[#14213d]">Primary city<input className="mt-1 h-10 w-full rounded-lg border border-[#cfd8e6] px-3 text-xs font-normal" value={city} onChange={(event) => setCity(event.target.value)} disabled={locked} placeholder="City" /></label>
            <label className="text-[11px] font-bold text-[#14213d]">State<input className="mt-1 h-10 w-full rounded-lg border border-[#cfd8e6] px-3 text-xs font-normal" value={state} onChange={(event) => setState(event.target.value)} disabled={locked} placeholder="State" /></label>
          </div>

          <fieldset className="mt-4">
            <legend className="text-[11px] font-bold text-[#14213d]">Preferred earning routes</legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              {earningOptions.map((option) => {
                const selected = options.includes(option.value);
                return <button className={`rounded-lg border p-3 text-left ${selected ? "border-[#1453bb] bg-[#eef5ff]" : "border-[#e4e2da] bg-[#fafaf8]"}`} key={option.value} type="button" onClick={() => toggleOption(option.value)} disabled={locked} aria-pressed={selected}>
                  <span className="flex items-center justify-between gap-2 text-xs font-bold text-[#14213d]"><span>{option.label}</span><span className={`grid h-4 w-4 place-items-center rounded border text-[10px] ${selected ? "border-[#1453bb] bg-[#1453bb] text-white" : "border-[#cfd8e6] bg-white"}`}>{selected ? "✓" : ""}</span></span>
                  <span className="mt-1 block text-[10px] leading-4 text-[#5c5f6b]">{option.detail}</span>
                </button>;
              })}
            </div>
          </fieldset>

          <p className="mt-3 rounded-lg bg-[#f4f8ff] px-3 py-2 text-[10px] leading-4 text-[#31527f]">
            Approved service givers can also qualify for a separate 5% artisan peer-referral commission when a referred professional completes a Hollyway escrow release. This route is verified from the professional records and does not need a separate payout selection.
          </p>

          <div className="mt-4 rounded-lg border border-[#e4e2da] bg-[#fafaf8] p-3">
            <p className="text-[11px] font-bold text-[#14213d]">Settlement account</p>
            <p className="mt-1 text-[10px] leading-4 text-[#5c5f6b]">Hollyway verifies the account name against your approved KYC legal name. The raw account number is not returned or saved in browser storage.</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="text-[11px] font-bold text-[#14213d]">Bank name<input className="mt-1 h-10 w-full rounded-lg border border-[#cfd8e6] bg-white px-3 text-xs font-normal" value={bank} onChange={(event) => setBank(event.target.value)} disabled={locked} placeholder="e.g. Fidelity Bank" /></label>
              <label className="text-[11px] font-bold text-[#14213d]">Account number<input className="mt-1 h-10 w-full rounded-lg border border-[#cfd8e6] bg-white px-3 text-xs font-normal" value={accountNumber} onChange={(event) => setAccountNumber(event.target.value.replace(/\D/g, "").slice(0, 10))} disabled={locked} inputMode="numeric" placeholder={application?.settlement_account_last4 ? `Saved account ending ${application.settlement_account_last4}` : "10 digits"} /></label>
            </div>
            {application?.resolved_account_name && <p className="mt-2 text-[10px] font-semibold text-[#168046]">Verified account: {application.resolved_account_name} · {application.account_match_percentage}% name match</p>}
          </div>

          <label className="mt-4 flex items-start gap-2 text-[10px] leading-4 text-[#5c5f6b]"><input className="mt-0.5" type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} disabled={locked} />I confirm my partner details are accurate and understand that Hollyway reviews the application before enabling partner earning routes.</label>
          {application && <p className="mt-3 rounded-lg bg-[#f4f8ff] px-3 py-2 text-[10px] leading-4 text-[#31527f]">Status: <strong>{application.status_label}</strong>{application.status === "approved" ? ` · ${application.tier[0].toUpperCase()}${application.tier.slice(1)} tier` : ""}{application.admin_note ? ` · ${application.admin_note}` : ""}</p>}
          {error && <p className="mt-3 rounded-lg bg-[#fff5f3] px-3 py-2 text-[10px] font-semibold text-[#a32929]" role="alert">{error}</p>}
          {notice && <p className="mt-3 rounded-lg bg-[#eefaf1] px-3 py-2 text-[10px] font-semibold text-[#168046]" role="status">{notice}</p>}
          {!locked && <div className="mt-4 flex flex-wrap gap-2"><button className="inline-flex h-9 items-center rounded-lg border border-[#cfd8e6] px-3 text-[10px] font-bold text-[#14213d] disabled:opacity-60" type="button" onClick={() => void save("draft")} disabled={saving}>{saving ? "Saving…" : "Save draft"}</button><button className="inline-flex h-9 items-center rounded-lg bg-[#1453bb] px-3 text-[10px] font-bold text-white disabled:opacity-60" type="button" onClick={() => void save("submit")} disabled={saving}>{saving ? "Sending…" : "Submit for review"}</button></div>}
        </>
      )}
    </section>
  );
}
