"use client";

import { useEffect, useState } from "react";
import { Arrow } from "./HomeIcons";
import { usePublicContact } from "../../../components/config/PublicContactProvider";
import { logistics, requestPoints } from "../data";
import { fetchPublicFeePolicy, type PublicFeePolicy } from "../../fees/data/publicFeesApi";

const shell = "mx-auto w-[calc(100%-40px)] max-w-[1180px] py-20 lg:w-[calc(100%-64px)] lg:py-24";
const heading = "mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end";

function money(amountMinor: number) {
  return `₦${(amountMinor / 100).toLocaleString("en-NG")}`;
}

function usePublicFees() {
  const [fees, setFees] = useState<PublicFeePolicy | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    let active = true;
    void fetchPublicFeePolicy()
      .then((next) => { if (active) setFees(next); })
      .catch(() => { if (active) setError(true); });
    return () => { active = false; };
  }, []);
  return { fees, error };
}

function feeRange(band: PublicFeePolicy["escrow"]["bands"][number]) {
  if (band.fee_rate_percentage) return `${band.fee_rate_percentage}% of value`;
  if (band.fee_max_minor === null || band.fee_max_minor === band.fee_min_minor) return money(band.fee_min_minor);
  return `${money(band.fee_min_minor)}–${money(band.fee_max_minor)}`;
}

export function RequestSection() {
  const { contact } = usePublicContact();
  const { fees, error } = usePublicFees();
  const requestFee = fees ? money(fees.wanted_request.amount_minor) : "Loading…";
  const renewalFee = fees ? money(fees.wanted_request.renewal_amount_minor) : "Loading…";
  return (
    <section id="pricing" className="bg-[#fff8ed]">
      <div className={shell}>
        <div className={heading}>
          <div>
            <span className="text-[10px] font-extrabold tracking-[.16em] text-[#8995a8]">
              WANTED ITEM REQUESTS
            </span>
            <h2 className="mt-2 text-3xl font-extrabold leading-tight tracking-[-.05em] text-[#0b1830] sm:text-4xl">
              Tell us what you want. <span className="text-[#ff8a00]">We broadcast it.</span>
            </h2>
          </div>
          <p className="max-w-sm text-xs leading-6 text-[#667085]">
            A wanted request is reviewed, assigned a tracking code and shared across Hollyway
            channels so matching sellers can respond.
          </p>
        </div>
        {error && <p className="mb-4 rounded-lg border border-[#f1c8c3] bg-[#fff5f3] p-3 text-xs font-semibold text-[#a32929]" role="alert">Current request fees are temporarily unavailable. Please try again shortly.</p>}
        <div className="grid gap-4 lg:grid-cols-[1.25fr_.75fr]">
          <div className="rounded-xl bg-white p-7 shadow-lg shadow-orange-950/5">
            <div className="flex flex-wrap items-center gap-3 rounded-lg bg-gradient-to-r from-[#f47700] to-[#ffae1a] p-5 text-white">
              <strong className="font-[Manrope] text-3xl font-extrabold">{requestFee}</strong>
              <span className="text-[10px]">{fees ? `per request · active for ${fees.wanted_request.duration_days} days` : "Current request fee"}</span>
              <b className="ml-auto max-w-32 text-right text-[9px] leading-4">
                {fees ? `Renew for ${renewalFee} if you need another ${fees.wanted_request.duration_days} days` : "Renewal fee will be shown here"}
              </b>
            </div>
            <div className="grid grid-cols-2 gap-4 py-7 sm:grid-cols-3 lg:grid-cols-6">
              {[
                "Submit details",
                "Pay request fee",
                "Review & code",
                "Broadcast",
                "Seller response",
                "Match & escrow",
              ].map((step, index) => (
                <div className="border-t-2 border-[#ffc66d] pt-2 text-center" key={step}>
                  <b className="block text-[10px] text-[#ff8a00]">0{index + 1}</b>
                  <span className="mt-2 block text-[9px] leading-4 text-[#65748a]">{step}</span>
                </div>
              ))}
            </div>
            <p className="border-l-4 border-[#ff8a00] bg-[#fff9f0] p-4 text-[10px] leading-5 text-[#7a5b2f]">
              <strong>Important:</strong> the displayed request fee covers review, coding and broadcast. It does not
              guarantee that a seller will have the item or accept your budget. If you complete the
              purchase through Hollyway Escrow, the request fee is deducted from your final escrow
              fee.
            </p>
          </div>
          <div className="rounded-xl bg-white p-7 shadow-lg shadow-orange-950/5">
            <h3 className="text-lg font-bold text-[#0b1830]">What to include</h3>
            <ol className="my-4 space-y-1">
              {requestPoints.map((point, index) => (
                <li
                  className="flex items-center gap-2 border-b border-[#f0f2f5] py-2 text-[10px] text-[#65748a]"
                  key={point}
                >
                  <b className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#ff8a00] text-[9px] text-white">
                    {index + 1}
                  </b>
                  {point}
                </li>
              ))}
            </ol>
            <a
              className="flex min-h-11 items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-[#ff8a00] to-[#ffb01c] px-4 text-[10px] font-extrabold text-[#17223a]"
              href={contact?.wanted_whatsapp_url || "#contact"}
              target={contact?.wanted_whatsapp_url ? "_blank" : undefined}
              rel={contact?.wanted_whatsapp_url ? "noreferrer" : undefined}
            >
              Message admin to post <Arrow />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function LogisticsSection() {
  return (
    <section id="logistics" className={shell}>
      <div className={heading}>
        <div>
          <span className="text-[10px] font-extrabold tracking-[.16em] text-[#8995a8]">
            LOGISTICS & ESCROW
          </span>
          <h2 className="mt-2 text-3xl font-extrabold leading-tight tracking-[-.05em] text-[#0b1830] sm:text-4xl">
            Move items with a <span className="text-[#ff8a00]">clearer process.</span>
          </h2>
        </div>
        <p className="max-w-sm text-xs leading-6 text-[#667085]">
          Delivery fees are confirmed before dispatch. Buyers inspect the item on arrival, and funds
          are released after confirmation.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {logistics.map(([title, providers], index) => (
          <article
            className="min-h-40 rounded-xl border border-[#dfe4ed] border-t-4 bg-white p-5"
            key={title}
          >
            <span className="text-[10px] font-extrabold text-[#8794a8]">0{index + 1}</span>
            <h3 className="mt-4 text-sm font-bold text-[#0b1830]">{title}</h3>
            <p className="mt-2 text-[10px] leading-5 text-[#718096]">{providers}</p>
          </article>
        ))}
      </div>
      <div className="mt-4 flex flex-col justify-between gap-4 rounded-xl bg-gradient-to-r from-[#061936] to-[#10458d] p-5 text-white sm:flex-row sm:items-center">
        <div>
          <b className="block text-sm text-[#ffae1a]">Hollyway Escrow</b>
          <span className="mt-2 block text-[10px] text-[#c1d1e7]">
            Submit → Verify & code → Pay securely → Tracked dispatch → Inspect → Seller payout
          </span>
        </div>
        <a
          href="#contact"
          className="flex shrink-0 items-center gap-2 text-[10px] font-extrabold text-[#ffae1a]"
        >
          Ask about a transaction <Arrow />
        </a>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        {[
          ["Delivery funds upfront", "Dispatch fees are paid before shipping."],
          ["Approved dispatch only", "Uncoordinated meetups are at the parties’ own risk."],
          ["Inspect before confirmation", "Check specifications during the inspection window."],
        ].map(([title, text]) => (
          <div className="rounded-lg bg-[#f5f7fa] p-4" key={title}>
            <b className="block text-[11px] text-[#0b1830]">{title}</b>
            <span className="mt-2 block text-[9px] leading-4 text-[#718096]">{text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function FeesSection() {
  const { fees, error } = usePublicFees();
  return (
    <section className="bg-[#f5f7fa]">
      <div className={shell}>
        <div className={heading}>
          <div>
            <span className="text-[10px] font-extrabold tracking-[.16em] text-[#8995a8]">
              TRANSPARENT FEES
            </span>
            <h2 className="mt-2 text-3xl font-extrabold leading-tight tracking-[-.05em] text-[#0b1830] sm:text-4xl">
              Know the cost before you <span className="text-[#ff8a00]">commit.</span>
            </h2>
          </div>
          <p className="max-w-sm text-xs leading-6 text-[#667085]">
            Standard marketplace listings are free. Escrow facilitation follows the transaction
            value schedule.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="overflow-hidden rounded-xl border border-[#dfe4ed] bg-white">
            <div className="grid grid-cols-2 bg-[#061936] px-5 py-3 text-[10px] font-extrabold text-white">
              <span>Item value</span>
              <span>Escrow fee</span>
            </div>
            {fees?.escrow.bands.map((band) => (
              <div
                className="grid min-h-11 grid-cols-2 items-center border-b border-[#dfe4ed] px-5 text-[10px] text-[#667085] last:border-0"
                key={band.label}
              >
                <span>{band.label}</span>
                <b className="text-[#ff8a00]">{feeRange(band)}</b>
              </div>
            ))}
            {!fees && !error && <p className="p-5 text-xs text-[#667085]">Loading the current escrow fee schedule…</p>}
            {error && <p className="p-5 text-xs font-semibold text-[#a32929]" role="alert">The current fee schedule could not be loaded.</p>}
          </div>
          <div className="rounded-xl border border-[#dfe4ed] bg-white p-6">
            <h3 className="text-lg font-bold text-[#0b1830]">Service fees</h3>
            {fees && [
              ["Standard item listing", fees.listing.label],
              [`Wanted request · ${fees.wanted_request.duration_days} days`, money(fees.wanted_request.amount_minor)],
              ["Wanted request renewal", money(fees.wanted_request.renewal_amount_minor)],
              ...fees.featured_packages.filter((item) => item.id !== "none").map((item) => [item.name, money(item.amount_minor)]),
            ].map(([name, fee]) => (
              <div
                className="flex min-h-10 items-center justify-between border-b border-[#eef1f4] text-[10px] text-[#667085]"
                key={name}
              >
                <span>{name}</span>
                <b className="text-[#1453bb]">{fee}</b>
              </div>
            ))}
            {!fees && !error && <p className="py-3 text-xs text-[#667085]">Loading the current service fees…</p>}
            {error && <p className="py-3 text-xs font-semibold text-[#a32929]" role="alert">The current service fees could not be loaded.</p>}
            <small className="mt-4 block text-[9px] leading-4 text-[#98a2b3]">
              Confirm fees, carriers and delivery arrangements with Hollyway Admin before payment.
            </small>
          </div>
        </div>
      </div>
    </section>
  );
}
