export type EscrowPurpose = "goods_sale" | "service_agreement" | "general_agreement";
export type EscrowPartyRole = "buyer" | "seller" | "client" | "provider" | "party_a" | "party_b";
export type EscrowFundingParty = "initiator" | "counterparty" | "other";
export type EscrowFeeCoverage = "initiator" | "counterparty" | "split";

export type EscrowStatus =
  | "draft"
  | "pending_review"
  | "approved"
  | "awaiting_party_acceptance"
  | "awaiting_funder"
  | "payment_pending"
  | "payment_verified"
  | "payment_proof_submitted"
  | "payment_received"
  | "payment_rejected"
  | "dispatch_booked"
  | "in_transit"
  | "delivered"
  | "inspection"
  | "buyer_confirmed"
  | "released"
  | "disputed"
  | "refunded"
  | "closed"
  | "cancelled"
  | "expired";

export type EscrowParticipantRecord = {
  id: string;
  user_id: string;
  role: EscrowPartyRole | "funder";
  email: string | null;
  accepted_at: string | null;
};

export type EscrowFundingInvitation = {
  id: string;
  email: string;
  status: "pending" | "accepted" | "declined" | "expired";
  expires_at: string;
  accepted_at: string | null;
};

export type EscrowPaymentProof = {
  id: string;
  name: string;
  mime_type: string;
  byte_size: number;
  created_at: string;
};

export type EscrowPayment = {
  id: string;
  provider: "manual_bank_transfer" | string;
  provider_reference: string;
  amount_minor: number;
  currency: string;
  status: "pending" | "proof_submitted" | "received" | "rejected" | "reversed" | "refunded";
  transfer_reference: string | null;
  submitted_amount_minor: number | null;
  transferred_at: string | null;
  sender_name: string | null;
  submitted_note: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  admin_note: string | null;
  failure_reason: string | null;
  paid_at: string | null;
  proof: EscrowPaymentProof | null;
  created_at: string;
  updated_at: string;
};

export type EscrowStatusEvent = {
  id: string;
  from_status: EscrowStatus | null;
  to_status: EscrowStatus;
  actor_user_id: string | null;
  actor_label: string | null;
  reason: string | null;
  created_at: string;
};

export type EscrowManualPayment = {
  method: "manual_bank_transfer";
  bank_name: string;
  account_name: string;
  account_number: string;
  amount_minor: number;
  currency: string;
  instruction: string;
  admin_whatsapp_number: string | null;
  admin_whatsapp_url: string | null;
};

export type EscrowRequest = {
  id: string;
  reference: string;
  purpose: EscrowPurpose;
  purpose_label: string;
  status: EscrowStatus;
  status_label: string;
  initiator_role: EscrowPartyRole;
  counterparty_email: string | null;
  funding_party_type: EscrowFundingParty;
  funding_party_email: string | null;
  currency: string;
  amount_minor: number | null;
  escrow_fee_min_minor: number | null;
  escrow_fee_max_minor: number | null;
  fee_coverage: EscrowFeeCoverage | null;
  delivery_required: boolean;
  delivery_fee_coverage: EscrowFeeCoverage | null;
  courier_method: string | null;
  subject: string;
  description: string;
  item_condition: string | null;
  inspection_terms: string | null;
  scope: string | null;
  deliverables: string | null;
  delivery_address: string | null;
  release_conditions: string;
  terms_accepted_at: string | null;
  terms_locked_at: string | null;
  participants: EscrowParticipantRecord[];
  funding_invitation: EscrowFundingInvitation | null;
  payments: EscrowPayment[];
  status_events: EscrowStatusEvent[];
  can_accept_funding?: boolean;
  manual_payment?: EscrowManualPayment;
  manual_payment_unavailable?: string;
  created_at: string;
  updated_at: string;
};

export const escrowProcessSteps = [
  { number: "01", title: "Agree terms", description: "Confirm the parties, value and written conditions." },
  { number: "02", title: "Submit request", description: "Send the HWE request to Hollyway." },
  { number: "03", title: "Accept and transfer", description: "The paying party accepts responsibility, then transfers to the official Hollyway account." },
  { number: "04", title: "Upload proof", description: "Send the receipt on the escrow page for Admin review." },
  { number: "05", title: "Fulfil and accept", description: "Follow the written delivery, service or agreement terms." },
  { number: "06", title: "Release funds", description: "Funds move on after the agreed acceptance conditions." },
] as const;

export const escrowStatusLabels: Record<EscrowStatus, string> = {
  draft: "Draft",
  pending_review: "Awaiting funding",
  approved: "Approved",
  awaiting_party_acceptance: "Awaiting party acceptance",
  awaiting_funder: "Awaiting funding party",
  payment_pending: "Payment pending",
  payment_verified: "Payment verified",
  payment_proof_submitted: "Proof submitted",
  payment_received: "Payment received",
  payment_rejected: "Proof needs attention",
  dispatch_booked: "Dispatch booked",
  in_transit: "In transit",
  delivered: "Delivered",
  inspection: "Inspection",
  buyer_confirmed: "Buyer confirmed",
  released: "Released",
  disputed: "Disputed",
  refunded: "Refunded",
  closed: "Closed",
  cancelled: "Cancelled",
  expired: "Expired",
};

export function formatNaira(value: number) {
  return `₦${value.toLocaleString("en-NG")}`;
}

export function formatMinorNaira(value: number | null | undefined) {
  if (typeof value !== "number") return "To be confirmed";
  const naira = Math.floor(value / 100);
  const kobo = value % 100;
  return kobo ? `₦${naira.toLocaleString("en-NG")}.${String(kobo).padStart(2, "0")}` : formatNaira(naira);
}

export function formatEscrowAmountInput(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits ? Number(digits).toLocaleString("en-NG") : "";
}

export function parseEscrowAmount(value: string | undefined) {
  return Number((value || "").replace(/\D/g, "")) || 0;
}

export function amountToMinor(value: string | undefined) {
  return parseEscrowAmount(value) * 100;
}
