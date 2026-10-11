"use client";

import { useEffect, useState, type FormEvent } from "react";
import Dropdown, { type DropdownOption } from "../../../components/forms/Dropdown";
import { showToast } from "../../../components/ui/ToastProvider";
import {
  amountToMinor,
  formatEscrowAmountInput,
  parseEscrowAmount,
  type EscrowFeeCoverage,
  type EscrowFundingParty,
  type EscrowPartyRole,
  type EscrowPurpose,
  type EscrowRequest,
} from "../data/escrow";
import { saveEscrow, type EscrowSaveInput } from "../data/escrowApi";
import EscrowPartySelector from "./EscrowPartySelector";

type Props = {
  initialRequest: EscrowRequest | null;
  onDraftSaved: (request: EscrowRequest) => void;
  onSubmitted: (request: EscrowRequest) => void;
  onTransactionValueChange: (value: number) => void;
};

const purposeOptions: DropdownOption[] = [
  { value: "goods_sale", label: "Item sale", tip: "Protect an item purchase or sale with optional delivery and inspection terms." },
  { value: "service_agreement", label: "Service agreement", tip: "Protect payment for defined work, deliverables and acceptance terms." },
  { value: "general_agreement", label: "General agreement", tip: "Protect a deposit or agreement that is not an item sale or service." },
];
const feeOptions: DropdownOption[] = [
  { value: "initiator", label: "I will pay the Hollyway fee", tip: "The account creating this request covers the escrow fee." },
  { value: "counterparty", label: "The other party will pay", tip: "The verified counterparty covers the escrow fee." },
  { value: "split", label: "We will split the fee", tip: "Both parties agree to share the escrow fee." },
];
const deliveryFeeOptions: DropdownOption[] = [
  { value: "initiator", label: "I will cover delivery", tip: "The person creating this request pays the courier or delivery charge." },
  { value: "counterparty", label: "The other party will cover delivery", tip: "The other verified party pays the delivery charge." },
  { value: "split", label: "We will split delivery", tip: "Both parties agree how to share the delivery charge." },
];
const courierOptions: DropdownOption[] = [
  { value: "hollyway_coordinated", label: "Hollyway-coordinated delivery", tip: "Hollyway confirms the courier and tracking details before dispatch." },
  { value: "approved_courier", label: "An agreed courier", tip: "The parties already have a courier in mind; the details are confirmed later." },
  { value: "self_arranged", label: "Self-arranged handover", tip: "The parties arrange collection or handover themselves." },
];
const funderOptions: DropdownOption[] = [
  { value: "initiator", label: "I will fund it", tip: "Your signed-in account will transfer the confirmed amount shown on the request." },
  { value: "counterparty", label: "The other party will fund it", tip: "The verified counterparty will accept responsibility and transfer the confirmed amount." },
  { value: "other", label: "Invite another Hollyway user", tip: "Hollyway emails an invitation; that user must sign in and verify email before funding." },
];

function TextField({ label, value, onChange, placeholder, hint, required = false }: {
  label: string; value: string; onChange: (value: string) => void; placeholder: string; hint?: string; required?: boolean;
}) {
  return <label className="grid gap-1.5 text-[11px] font-extrabold text-[#31425e]">
    <span>{label}{required && <em className="ml-1 not-italic text-[#a32929]">*</em>}</span>
    {hint && <small className="text-[10px] font-medium leading-4 text-[#8995a8]">{hint}</small>}
    <input className="h-10 rounded-lg border border-[#dfe4ed] bg-white px-3 text-xs font-medium text-[#0b1830] outline-none placeholder:text-[#9aa6b7] focus:border-[#1453bb] focus:ring-4 focus:ring-[#1453bb]/10" value={value} onChange={(event) => onChange(event.currentTarget.value)} placeholder={placeholder} required={required} />
  </label>;
}

function TextArea({ label, value, onChange, placeholder, hint, required = false }: {
  label: string; value: string; onChange: (value: string) => void; placeholder: string; hint?: string; required?: boolean;
}) {
  return <label className="grid gap-1.5 text-[11px] font-extrabold text-[#31425e]">
    <span>{label}{required && <em className="ml-1 not-italic text-[#a32929]">*</em>}</span>
    {hint && <small className="text-[10px] font-medium leading-4 text-[#8995a8]">{hint}</small>}
    <textarea className="min-h-24 rounded-lg border border-[#dfe4ed] bg-white px-3 py-2.5 text-xs font-medium leading-5 text-[#0b1830] outline-none placeholder:text-[#9aa6b7] focus:border-[#1453bb] focus:ring-4 focus:ring-[#1453bb]/10" value={value} onChange={(event) => onChange(event.currentTarget.value)} placeholder={placeholder} required={required} />
  </label>;
}

function initialCounterparty(request: EscrowRequest | null) {
  if (!request) return "";
  return request.counterparty_email || request.participants.find((item) => item.role !== request.initiator_role && item.role !== "funder")?.email || "";
}

export default function EscrowRequestForm({ initialRequest, onDraftSaved, onSubmitted, onTransactionValueChange }: Props) {
  const [purpose, setPurpose] = useState<EscrowPurpose>(initialRequest?.purpose || "goods_sale");
  const [subject, setSubject] = useState(initialRequest?.subject || "");
  const [description, setDescription] = useState(initialRequest?.description || "");
  const [amount, setAmount] = useState(initialRequest?.amount_minor ? formatEscrowAmountInput(String(Math.floor(initialRequest.amount_minor / 100))) : "");
  const [feeCoverage, setFeeCoverage] = useState<EscrowFeeCoverage | "">(initialRequest?.fee_coverage || "");
  const [itemCondition, setItemCondition] = useState(initialRequest?.item_condition || "");
  const [inspectionTerms, setInspectionTerms] = useState(initialRequest?.inspection_terms || "");
  const [scope, setScope] = useState(initialRequest?.scope || "");
  const [deliverables, setDeliverables] = useState(initialRequest?.deliverables || "");
  const [deliveryRequired, setDeliveryRequired] = useState(initialRequest?.delivery_required || false);
  const [deliveryFeeCoverage, setDeliveryFeeCoverage] = useState<EscrowFeeCoverage | "">(initialRequest?.delivery_fee_coverage || "");
  const [courierMethod, setCourierMethod] = useState(initialRequest?.courier_method || "");
  const [deliveryAddress, setDeliveryAddress] = useState(initialRequest?.delivery_address || "");
  const [releaseConditions, setReleaseConditions] = useState(initialRequest?.release_conditions || "");
  const [fundingParty, setFundingParty] = useState<EscrowFundingParty>(initialRequest?.funding_party_type || "initiator");
  const [fundingPartyEmail, setFundingPartyEmail] = useState(initialRequest?.funding_party_email || "");
  const [counterpartyEmail, setCounterpartyEmail] = useState(initialCounterparty(initialRequest));
  const [counterpartyConfirmed, setCounterpartyConfirmed] = useState(false);
  const [initiatorRole, setInitiatorRole] = useState<EscrowPartyRole>(initialRequest?.initiator_role || "buyer");
  const [termsAccepted, setTermsAccepted] = useState(Boolean(initialRequest?.terms_accepted_at));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState(initialRequest?.reference || "");

  useEffect(() => onTransactionValueChange(parseEscrowAmount(amount)), [amount, onTransactionValueChange]);

  function changePurpose(value: string) {
    setPurpose(value as EscrowPurpose);
    setInitiatorRole(value === "goods_sale" ? "buyer" : value === "service_agreement" ? "client" : "party_a");
    if (value !== "goods_sale") {
      setItemCondition("");
      setInspectionTerms("");
      setDeliveryRequired(false);
    }
    if (value !== "service_agreement") {
      setScope("");
      setDeliverables("");
    }
  }

  function validate(action: "draft" | "submit") {
    if (action === "draft") return "";
    if (!subject.trim()) return "Enter what this escrow protects.";
    if (!description.trim()) return "Describe the item, service or agreement.";
    if (parseEscrowAmount(amount) < 1_000) return "Enter an agreed value of at least ₦1,000.";
    if (!feeCoverage) return "Choose who will pay the Hollyway escrow fee.";
    if (!counterpartyEmail || !counterpartyConfirmed) return "Find and add the other party's active Hollyway account before submitting.";
    if (purpose === "service_agreement" && (!scope.trim() || !deliverables.trim())) return "Add the service scope and deliverables.";
    if (deliveryRequired && (!deliveryFeeCoverage || !deliveryAddress.trim())) return "Add the delivery fee arrangement and full delivery address.";
    if (fundingParty === "other" && !fundingPartyEmail.trim()) return "Enter the funding party's email.";
    if (!releaseConditions.trim()) return "Write the conditions that must be met before release.";
    if (!termsAccepted) return "Accept the escrow terms before submitting.";
    return "";
  }

  async function persist(action: "draft" | "submit", event?: FormEvent) {
    event?.preventDefault();
    const validation = validate(action);
    if (validation) {
      setError(validation);
      return;
    }
    setError("");
    setSaving(true);
    const input: EscrowSaveInput = {
      action,
      purpose,
      initiatorRole,
      subject: subject.trim(),
      description: description.trim(),
      itemCondition: itemCondition.trim(),
      inspectionTerms: inspectionTerms.trim(),
      scope: scope.trim(),
      deliverables: deliverables.trim(),
      amountMinor: amount.trim() ? amountToMinor(amount) : null,
      feeCoverage: feeCoverage || null,
      deliveryRequired,
      deliveryFeeCoverage: deliveryRequired ? deliveryFeeCoverage || null : null,
      courierMethod: deliveryRequired ? courierMethod : "",
      deliveryAddress: deliveryRequired ? deliveryAddress.trim() : "",
      releaseConditions: releaseConditions.trim(),
      counterpartyEmail: counterpartyEmail.trim().toLowerCase(),
      fundingParty,
      fundingPartyEmail: fundingParty === "other" ? fundingPartyEmail.trim().toLowerCase() : "",
      termsAccepted,
    };
    try {
      const saved = await saveEscrow(input, reference || undefined);
      setReference(saved.reference);
      if (action === "draft") {
        onDraftSaved(saved);
        showToast("success", "Escrow draft saved.");
      } else {
        onSubmitted(saved);
        showToast("success", "Escrow request submitted.");
      }
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "The escrow request could not be saved.";
      setError(message);
      showToast("error", message);
    } finally {
      setSaving(false);
    }
  }

  return <form className="grid gap-4" onSubmit={(event) => void persist("submit", event)}>
    <section className="rounded-xl border border-[#dfe4ed] bg-white p-4 sm:p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Dropdown label="What should Hollyway protect?" options={purposeOptions} value={purpose} onChange={changePurpose} required={false} hint="Choose the agreement type; the form changes to match it." />
        <TextField label="Subject" value={subject} onChange={setSubject} placeholder="e.g. Samsung TV purchase or design project" hint="Use a short title both parties will recognise." />
        <div className="sm:col-span-2"><TextArea label={purpose === "goods_sale" ? "Describe the item and agreement" : purpose === "service_agreement" ? "Describe the service agreement" : "Describe the general agreement"} value={description} onChange={setDescription} placeholder="Write what the parties agreed, what is included and what should happen next." /></div>
        <TextField label="Agreed value (₦)" value={amount} onChange={(value) => setAmount(formatEscrowAmountInput(value))} placeholder="1,000" hint={amount ? "The Hollyway fee is calculated in the summary." : "Enter the amount to calculate the Hollyway fee."} />
        <Dropdown label="Who pays the Hollyway fee?" options={feeOptions} value={feeCoverage} onChange={(value) => setFeeCoverage(value as EscrowFeeCoverage)} required={false} />
      </div>
    </section>

    {purpose === "goods_sale" && <section className="grid gap-4 rounded-xl border border-[#dfe4ed] bg-white p-4 sm:grid-cols-2 sm:p-5">
      <TextArea label="Item condition (optional)" value={itemCondition} onChange={setItemCondition} placeholder="New, used, defects, included accessories or known issues." />
      <TextArea label="Inspection terms (optional)" value={inspectionTerms} onChange={setInspectionTerms} placeholder="What must the buyer check before confirming the release?" />
    </section>}
    {purpose === "service_agreement" && <section className="grid gap-4 rounded-xl border border-[#dfe4ed] bg-white p-4 sm:grid-cols-2 sm:p-5">
      <TextArea label="Service scope" value={scope} onChange={setScope} placeholder="What work is included and what is outside the agreement?" required />
      <TextArea label="Deliverables" value={deliverables} onChange={setDeliverables} placeholder="List the work or files the provider must deliver." required />
    </section>}

    {purpose === "goods_sale" && <section className="rounded-xl border border-[#dfe4ed] bg-white p-4 sm:p-5">
      <label className="flex items-start gap-3 text-xs font-extrabold text-[#31425e]"><input className="mt-0.5 h-4 w-4 accent-[#1453bb]" type="checkbox" checked={deliveryRequired} onChange={(event) => setDeliveryRequired(event.currentTarget.checked)} /><span>Delivery or courier is part of this agreement<small className="mt-1 block text-[10px] font-medium leading-4 text-[#8995a8]">Leave this off for collection or a non-delivery item sale.</small></span></label>
      {deliveryRequired && <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Dropdown label="Courier method" options={courierOptions} value={courierMethod} onChange={setCourierMethod} required={false} />
        <Dropdown label="Who covers delivery?" options={deliveryFeeOptions} value={deliveryFeeCoverage} onChange={(value) => setDeliveryFeeCoverage(value as EscrowFeeCoverage)} required={false} />
        <div className="sm:col-span-2"><TextArea label="Full delivery address" value={deliveryAddress} onChange={setDeliveryAddress} placeholder="Street, area, city and state" required /></div>
      </div>}
    </section>}

    <EscrowPartySelector purpose={purpose} initialRole={initiatorRole} initialOtherEmail={counterpartyEmail} onChange={(parties) => { setInitiatorRole(parties.initiatorRole); setCounterpartyEmail(parties.counterpartyEmail); setCounterpartyConfirmed(parties.counterpartyConfirmed); }} />

    <section className="grid gap-4 rounded-xl border border-[#dfe4ed] bg-white p-4 sm:grid-cols-2 sm:p-5">
      <div className="sm:col-span-2"><TextArea label="Release or acceptance conditions" value={releaseConditions} onChange={setReleaseConditions} placeholder="Explain exactly what must happen before Hollyway records release, refund or completion." hint="This applies to item, service and general agreements." required /></div>
      <Dropdown label="Who will make the payment?" options={funderOptions} value={fundingParty} onChange={(value) => setFundingParty(value as EscrowFundingParty)} required={false} hint="The paying party accepts responsibility, sees Hollyway&apos;s account details and uploads the transfer receipt." />
      {fundingParty === "other" && <TextField label="Funding party's Hollyway email" value={fundingPartyEmail} onChange={setFundingPartyEmail} placeholder="funder@example.com" hint="They must sign in, verify email and accept the terms before transfer." required />}
      <label className="flex items-start gap-3 text-[11px] font-semibold leading-5 text-[#53627a] sm:col-span-2"><input className="mt-1 h-4 w-4 accent-[#1453bb]" type="checkbox" checked={termsAccepted} onChange={(event) => setTermsAccepted(event.currentTarget.checked)} /><span>I confirm the parties and written conditions are accurate and agree to Hollyway&apos;s escrow terms.</span></label>
    </section>

    {error && <p className="rounded-lg border border-[#f1d8a9] bg-[#fffaf1] px-3 py-2 text-xs font-semibold leading-5 text-[#6b5a3d]" role="alert">{error}</p>}
    <div className="flex flex-wrap justify-end gap-2">
      <button className="inline-flex h-10 items-center justify-center rounded-lg border border-[#cfe0f7] px-4 text-xs font-extrabold text-[#1453bb] hover:bg-[#edf4ff] disabled:opacity-60" disabled={saving} onClick={() => void persist("draft")} type="button">{saving ? "Saving…" : "Save as draft"}</button>
      <button className="inline-flex h-10 items-center justify-center rounded-lg bg-[#1453bb] px-4 text-xs font-extrabold text-white hover:bg-[#0b3f91] disabled:opacity-60" disabled={saving} type="submit">{saving ? "Submitting…" : "Submit escrow request"}</button>
    </div>
  </form>;
}
