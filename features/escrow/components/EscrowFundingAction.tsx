"use client";

import { Arrow } from "../../../components/ui/Arrow";
import EscrowPaymentProofForm from "./EscrowPaymentProofForm";
import type { EscrowRequest } from "../data/escrow";

type Props = {
  request: EscrowRequest;
  accepting: boolean;
  termsAccepted: boolean;
  error: string;
  onTermsChange: (accepted: boolean) => void;
  onAccept: () => void;
  onUpdated: (request: EscrowRequest) => void;
};

export default function EscrowFundingAction({
  request,
  accepting,
  termsAccepted,
  error,
  onTermsChange,
  onAccept,
  onUpdated,
}: Props) {
  if (request.manual_payment || request.manual_payment_unavailable) {
    return <EscrowPaymentProofForm request={request} onUpdated={onUpdated} />;
  }

  return (
    <section className="rounded-lg border border-[#cfe0f7] bg-[#f4f8ff] p-4">
      <span className="text-[9px] font-extrabold tracking-[.14em] text-[#1453bb]">MAKE PAYMENT</span>
      <h2 className="mt-1 font-[Manrope] text-lg font-extrabold tracking-[-.03em] text-[#0b1830]">Accept responsibility first</h2>
      <p className="mt-2 text-xs leading-5 text-[#53627a]">
        Review the agreement details on the left. Accept the payment responsibility to reveal Hollyway&apos;s official account and exact amount.
      </p>
      <div className="mt-4 rounded-lg border border-[#dbe7f7] bg-white p-3">
        <div className="flex items-center justify-between gap-3 text-xs">
          <span className="text-[#687895]">Payment status</span>
          <strong className="text-[#1453bb]">Not started</strong>
        </div>
        <p className="mt-2 text-[10px] leading-5 text-[#687895]">Hollyway Admin only reviews the receipt after the transfer is made.</p>
      </div>
      <label className="mt-4 flex items-start gap-2 text-[11px] font-semibold leading-5 text-[#53627a]">
        <input
          className="mt-1 h-4 w-4 accent-[#1453bb]"
          type="checkbox"
          checked={termsAccepted}
          onChange={(event) => onTermsChange(event.currentTarget.checked)}
        />
        <span>I accept the written terms and will transfer the exact amount to Hollyway, then upload the receipt.</span>
      </label>
      {error && <p className="mt-3 rounded-lg border border-[#f0c5c0] bg-[#fff4f2] p-3 text-xs font-semibold leading-5 text-[#a32929]" role="alert">{error}</p>}
      <button
        className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#1453bb] px-4 text-xs font-extrabold text-white hover:bg-[#0b3f91] disabled:cursor-not-allowed disabled:opacity-60"
        disabled={accepting || !termsAccepted}
        onClick={onAccept}
        type="button"
      >
        {accepting ? "Opening payment details…" : "Accept & make payment"}
        <Arrow />
      </button>
    </section>
  );
}
