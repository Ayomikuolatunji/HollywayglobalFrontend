import Link from "next/link";
import { Arrow } from "../../../components/ui/Arrow";
import { formatMinorNaira } from "../data/escrow";

export type FundingInvitationPreview = {
  reference: string;
  purpose: string;
  subject: string;
  amount_minor: number | null;
  escrow_fee_min_minor: number | null;
  escrow_fee_max_minor: number | null;
  invited_email: string;
  expires_at: string;
};

function feeLabel(preview: FundingInvitationPreview) {
  if (preview.escrow_fee_min_minor === null || preview.escrow_fee_max_minor === null) return "To be confirmed";
  if (preview.escrow_fee_min_minor === preview.escrow_fee_max_minor) return formatMinorNaira(preview.escrow_fee_min_minor);
  return `${formatMinorNaira(preview.escrow_fee_min_minor)}–${formatMinorNaira(preview.escrow_fee_max_minor)}`;
}

type Props = {
  preview: FundingInvitationPreview;
  termsAccepted: boolean;
  accepting: boolean;
  signInRequired: boolean;
  error: string;
  loginHref: string;
  signupHref: string;
  onTermsChange: (accepted: boolean) => void;
  onAccept: () => void;
};

export default function EscrowInvitationAcceptance({
  preview,
  termsAccepted,
  accepting,
  signInRequired,
  error,
  loginHref,
  signupHref,
  onTermsChange,
  onAccept,
}: Props) {
  return (
    <section className="rounded-lg border border-[#cfe0f7] bg-[#f4f8ff] p-4">
      <span className="text-[9px] font-extrabold tracking-[.14em] text-[#1453bb]">MAKE PAYMENT</span>
      <h2 className="mt-1 font-[Manrope] text-lg font-extrabold tracking-[-.03em] text-[#0b1830]">Accept responsibility first</h2>
      <p className="mt-2 text-xs leading-5 text-[#53627a]">After acceptance, Hollyway shows the official account and exact amount. Transfer manually, upload the receipt and wait for Admin to confirm it.</p>
      <dl className="mt-4 grid gap-2 rounded-lg border border-[#dbe7f7] bg-white p-3 text-xs">
        <div className="flex justify-between gap-3"><dt className="text-[#687895]">Protected value</dt><dd className="font-extrabold text-[#0b1830]">{formatMinorNaira(preview.amount_minor)}</dd></div>
        <div className="flex justify-between gap-3"><dt className="text-[#687895]">Hollyway fee</dt><dd className="font-extrabold text-[#0b1830]">{feeLabel(preview)}</dd></div>
      </dl>
      <label className="mt-4 flex items-start gap-2 text-[11px] font-semibold leading-5 text-[#53627a]">
        <input className="mt-1 h-4 w-4 accent-[#1453bb]" type="checkbox" checked={termsAccepted} onChange={(event) => onTermsChange(event.currentTarget.checked)} />
        <span>I accept the written escrow terms and will transfer the exact amount to Hollyway, then upload the receipt.</span>
      </label>
      {error && <p className="mt-3 rounded-lg border border-[#f0c5c0] bg-[#fff4f2] p-3 text-xs font-semibold leading-5 text-[#a32929]" role="alert">{error}</p>}
      <div className="mt-4 grid gap-2">
        {signInRequired ? <>
          <Link className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#1453bb] px-4 text-xs font-extrabold text-white" href={loginHref}>Sign in with invited email <Arrow /></Link>
          <Link className="inline-flex h-10 items-center justify-center rounded-lg border border-[#cfe0f7] px-4 text-xs font-extrabold text-[#1453bb]" href={signupHref}>Create account</Link>
        </> : <button className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#1453bb] px-4 text-xs font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-60" disabled={accepting || !termsAccepted} onClick={onAccept} type="button">{accepting ? "Opening payment details…" : "Accept & make payment"} <Arrow /></button>}
      </div>
    </section>
  );
}
