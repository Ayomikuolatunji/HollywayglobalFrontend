"use client";

import type { FormEvent } from "react";
import { Arrow } from "../../../components/ui/Arrow";
import BusinessUpgradeCompanyFields from "./BusinessUpgradeCompanyFields";
import BusinessUpgradeDocumentField from "./BusinessUpgradeDocumentField";
import BusinessUpgradeField, {
  BusinessUpgradeSection,
} from "./BusinessUpgradeField";
import {
  type BusinessDocumentKind,
  type BusinessSettlementField,
  type BusinessUpgradeDraft,
} from "../data/businessUpgrade";

type BusinessUpgradeFormProps = {
  draft: BusinessUpgradeDraft;
  settlementBankName: string;
  settlementAccountNumber: string;
  settlementAccountName: string;
  savedSettlementLast4?: string;
  certificate: File | null;
  directorIdentification: File | null;
  existingDocuments: ReadonlyArray<{ kind: string; name: string }>;
  consent: boolean;
  saving: "draft" | "submit" | "";
  error: string;
  message: string;
  onDraftChange: (field: keyof BusinessUpgradeDraft, value: string) => void;
  onSettlementChange: (field: BusinessSettlementField, value: string) => void;
  onFileChange: (kind: BusinessDocumentKind, file: File | null) => void;
  onConsentChange: (value: boolean) => void;
  onSaveDraft: () => void;
  onSubmit: () => void;
};

function SettlementFields({
  bankName,
  accountNumber,
  accountName,
  savedLast4,
  onChange,
}: {
  bankName: string;
  accountNumber: string;
  accountName: string;
  savedLast4?: string;
  onChange: (field: BusinessSettlementField, value: string) => void;
}) {
  const hasSavedAccount = Boolean(savedLast4);
  return (
    <BusinessUpgradeSection
      icon="wallet"
      title="Settlement bank details"
      description="Hollyway uses these details for approved business settlements. The account number is encrypted and never returned to the client."
    >
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <BusinessUpgradeField
          label="Settlement bank name"
          value={bankName}
          placeholder="Bank name"
          onChange={(value) => onChange("settlementBankName", value)}
        />
        <BusinessUpgradeField
          label="Settlement account number"
          value={accountNumber}
          placeholder="10-digit account number"
          required={!hasSavedAccount}
          inputMode="numeric"
          hint={
            hasSavedAccount
              ? `Saved account ending ${savedLast4}. Leave both account fields blank to keep it, or enter both to replace it.`
              : "This is sent securely and is not saved in browser storage."
          }
          onChange={(value) =>
            onChange("settlementAccountNumber", value.replace(/\D/g, "").slice(0, 10))
          }
        />
        <BusinessUpgradeField
          label="Settlement account name"
          value={accountName}
          placeholder="Name on the account"
          required={!hasSavedAccount}
          onChange={(value) => onChange("settlementAccountName", value)}
        />
      </div>
    </BusinessUpgradeSection>
  );
}

function DocumentFields({
  certificate,
  directorIdentification,
  existingDocuments,
  onChange,
}: {
  certificate: File | null;
  directorIdentification: File | null;
  existingDocuments: ReadonlyArray<{ kind: string; name: string }>;
  onChange: (kind: BusinessDocumentKind, file: File | null) => void;
}) {
  const existingCertificate = existingDocuments.find(
    (document) => document.kind === "certificate_of_incorporation",
  )?.name;
  const existingDirectorId = existingDocuments.find(
    (document) => document.kind === "director_identification",
  )?.name;

  return (
    <BusinessUpgradeSection
      icon="box"
      title="Verification documents"
      description="Attach the documents Admin needs to review the company and its representative."
    >
      <div className="mt-5 grid gap-3">
        <BusinessUpgradeDocumentField
          id="business-certificate"
          label="Certificate of Incorporation"
          description="Required for submission."
          file={certificate}
          existingName={existingCertificate}
          onChange={(file) => onChange("certificate", file)}
        />
        <BusinessUpgradeDocumentField
          id="business-director-identification"
          label="Director identification"
          description="Required for submission. Use a clear government-issued identity document."
          file={directorIdentification}
          existingName={existingDirectorId}
          onChange={(file) => onChange("directorIdentification", file)}
        />
      </div>
    </BusinessUpgradeSection>
  );
}

export default function BusinessUpgradeForm({
  draft,
  settlementBankName,
  settlementAccountNumber,
  settlementAccountName,
  savedSettlementLast4,
  certificate,
  directorIdentification,
  existingDocuments,
  consent,
  saving,
  error,
  message,
  onDraftChange,
  onSettlementChange,
  onFileChange,
  onConsentChange,
  onSaveDraft,
  onSubmit,
}: BusinessUpgradeFormProps) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form className="space-y-5" onSubmit={submit}>
      {error && (
        <p
          className="rounded-lg border border-[#f3caca] bg-[#fff5f5] px-4 py-3 text-xs font-semibold leading-5 text-[#a32929] dark:border-[#6f3a46] dark:bg-[#2a1723] dark:text-[#ffb9bd]"
          role="alert"
        >
          {error}
        </p>
      )}
      {message && (
        <p
          className="rounded-lg border border-[#bfe5d0] bg-[#f1fbf5] px-4 py-3 text-xs font-semibold leading-5 text-[#14733d] dark:border-[#315c4a] dark:bg-[#142b25] dark:text-[#9be1b9]"
          role="status"
        >
          {message}
        </p>
      )}

      <BusinessUpgradeCompanyFields draft={draft} onChange={onDraftChange} />

      <SettlementFields
        bankName={settlementBankName}
        accountNumber={settlementAccountNumber}
        accountName={settlementAccountName}
        savedLast4={savedSettlementLast4}
        onChange={onSettlementChange}
      />
      <DocumentFields
        certificate={certificate}
        directorIdentification={directorIdentification}
        existingDocuments={existingDocuments}
        onChange={onFileChange}
      />

      <label className="flex items-start gap-2 text-xs leading-5 text-[#53627a] dark:text-[#b7c3d6]">
        <input
          className="mt-1 accent-[#1453bb]"
          type="checkbox"
          checked={consent}
          onChange={(event) => onConsentChange(event.target.checked)}
        />
        <span>
          I confirm that these business details and documents are accurate and
          agree to Hollyway&apos;s terms, privacy notice and Admin verification.
        </span>
      </label>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <p className="mr-auto max-w-md text-[10px] leading-4 text-[#8995a8] dark:text-[#8190a8]">
          Save as a private Draft at any time. Submission sends the complete
          application to Hollyway Admin for review.
        </p>
        <button
          className="inline-flex h-11 items-center rounded-lg border border-[#dfe4ed] px-4 text-xs font-extrabold text-[#53627a] hover:border-[#1453bb] hover:text-[#1453bb] disabled:cursor-wait disabled:opacity-60 dark:border-[#33445f] dark:text-[#b7c3d6]"
          type="button"
          onClick={onSaveDraft}
          disabled={Boolean(saving)}
        >
          {saving === "draft" ? "Saving draft…" : "Save as draft"}
        </button>
        <button
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#1453bb] px-5 text-xs font-extrabold text-white hover:bg-[#0b3f91] disabled:cursor-wait disabled:opacity-60"
          type="submit"
          disabled={Boolean(saving)}
        >
          {saving === "submit" ? "Submitting for review…" : "Submit for Admin verification"}
          <Arrow />
        </button>
      </div>
    </form>
  );
}
