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
  name?: string | null;
  phone_e164?: string | null;
  identity_verified?: boolean;
  accepted_at: string | null;
};

export type EscrowFulfilment = {
  id: string;
  status: string;
  carrier_name: string | null;
  tracking_reference: string | null;
  dispatch_note: string | null;
  dispatched_at: string | null;
  delivered_at: string | null;
  accepted_at: string | null;
  created_at: string;
  updated_at: string;
};

export type EscrowInspection = {
  id: string;
  decision: "pending" | "accepted" | "disputed";
  inspected_by_user_id: string | null;
  note: string | null;
  deadline_at: string | null;
  submitted_at: string | null;
  created_at: string;
  updated_at: string;
};

export type EscrowDispute = {
  id: string;
  opened_by_user_id: string;
  status: string;
  reason: string;
  details: string;
  decision: "release" | "refund" | "close" | null;
  resolution_note: string | null;
  evidence_deadline_at: string | null;
  response_deadline_at: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
};

export type EscrowEvidence = {
  id: string;
  dispute_id: string | null;
  uploaded_by_user_id: string;
  kind: string;
  name: string;
  mime_type: string;
  byte_size: number;
  created_at: string;
};

export type EscrowPayout = {
  id: string;
  recipient_participant_id: string | null;
  amount_minor: number;
  status: "pending" | "ready" | "released" | "refunded";
  reference: string;
  admin_note: string | null;
  released_at: string | null;
  created_at: string;
  updated_at: string;
};

export type EscrowSettlementAccount = {
  bank_name: string;
  account_last4: string;
  account_name: string;
  match_percentage: number | null;
  verified_at: string;
};

export type EscrowViewer = {
  roles: string[];
  can_book_dispatch: boolean;
  can_mark_in_transit: boolean;
  can_mark_delivered: boolean;
  can_start_inspection: boolean;
  can_accept: boolean;
  can_open_dispute: boolean;
  can_request_release: boolean;
  has_pending_release_request: boolean;
};

export type EscrowReleaseRequest = {
  id: string;
  requested_by_user_id: string;
  requested_by_role: string | null;
  status: "pending" | "approved" | "rejected" | "info_requested";
  details: string;
  review_note: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
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
  fulfilment?: EscrowFulfilment | null;
  inspection?: EscrowInspection | null;
  disputes?: EscrowDispute[];
  evidence?: EscrowEvidence[];
  payout?: EscrowPayout | null;
  release_requests?: EscrowReleaseRequest[];
  settlement_account?: EscrowSettlementAccount | null;
  viewer?: EscrowViewer;
  can_accept_funding?: boolean;
  manual_payment?: EscrowManualPayment;
  manual_payment_unavailable?: string;
  created_at: string;
  updated_at: string;
};

export function shouldShowEscrowPaymentAction(request: {
  status: EscrowStatus;
  can_accept_funding?: boolean;
  manual_payment?: unknown;
  manual_payment_unavailable?: string;
}) {
  if (request.status === "payment_received") return false;
  return Boolean(request.can_accept_funding || request.manual_payment || request.manual_payment_unavailable);
}

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
