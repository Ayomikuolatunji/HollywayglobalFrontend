"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Arrow } from "../../../components/ui/Arrow";
import BusinessUpgradeForm, {
  type SettlementVerificationState,
} from "../components/BusinessUpgradeForm";
import BusinessUpgradeLoadError from "../components/BusinessUpgradeLoadError";
import BusinessUpgradeStatusPanel from "../components/BusinessUpgradeStatusPanel";
import BusinessUpgradeStatusIntro from "../components/BusinessUpgradeStatusIntro";
import DashboardPageHeader from "../components/DashboardPageHeader";
import { useDashboard } from "../components/DashboardShell";
import {
  AccountApiError,
  fetchBusinessUpgrade,
  saveBusinessUpgrade,
  type BusinessUpgrade,
} from "../data/accountApi";
import { verifySettlementAccount } from "../data/settlementApi";
import {
  clearBusinessUpgradeDraft,
  draftFromBusinessUpgrade,
  emptyBusinessUpgradeDraft,
  getBusinessUpgradeStorageKey,
  hasBusinessUpgradeDocument,
  isBusinessUpgradeLocked,
  mergeBusinessUpgradeDraft,
  persistBusinessUpgradeDraft,
  readBusinessUpgradeDraft,
  type BusinessDocumentKind,
  type BusinessSettlementField,
  type BusinessUpgradeDraft,
} from "../data/businessUpgrade";

const MAX_DOCUMENT_SIZE = 10_000_000;
const ALLOWED_DOCUMENT_TYPES = ["application/pdf", "image/jpeg", "image/png"];

function settlementKey(companyName: string, bankName: string, accountNumber: string) {
  return [companyName, bankName, accountNumber]
    .map((value) => value.trim().toLowerCase())
    .join("|");
}

export default function BusinessUpgradePage() {
  const { accountEmail } = useDashboard();
  const storageKey = getBusinessUpgradeStorageKey(accountEmail);
  const [draft, setDraft] = useState<BusinessUpgradeDraft>(emptyBusinessUpgradeDraft);
  const [hydratedStorageKey, setHydratedStorageKey] = useState("");
  const [upgrade, setUpgrade] = useState<BusinessUpgrade | null>(null);
  const [settlementBankName, setSettlementBankName] = useState("");
  const [settlementAccountNumber, setSettlementAccountNumber] = useState("");
  const [settlementAccountName, setSettlementAccountName] = useState("");
  const [certificate, setCertificate] = useState<File | null>(null);
  const [directorIdentification, setDirectorIdentification] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<"draft" | "submit" | "">("");
  const [verifyingSettlementAccount, setVerifyingSettlementAccount] = useState(false);
  const [settlementVerification, setSettlementVerification] =
    useState<SettlementVerificationState>({ status: "idle", key: "" });
  const [loadError, setLoadError] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    setDraft(readBusinessUpgradeDraft(storageKey));
    setHydratedStorageKey(storageKey);
  }, [storageKey]);

  useEffect(() => {
    if (hydratedStorageKey === storageKey) {
      persistBusinessUpgradeDraft(draft, storageKey);
    }
  }, [draft, hydratedStorageKey, storageKey]);

  useEffect(() => {
    if (!accountEmail) {
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    setLoadError("");
    fetchBusinessUpgrade()
      .then((remote) => {
        if (!active) return;
        if (remote.status === "not_submitted") {
          setUpgrade(null);
          return;
        }
        setUpgrade(remote);
        if (remote.status === "draft" || remote.status === "rejected") {
          const local = readBusinessUpgradeDraft(storageKey);
          const nextDraft = mergeBusinessUpgradeDraft(
            local,
            draftFromBusinessUpgrade(remote),
          );
          setDraft(nextDraft);
          setSettlementBankName(remote.settlement_bank_name || "");
        }
      })
      .catch((requestError) => {
        if (!active) return;
        setLoadError(
          requestError instanceof AccountApiError
            ? requestError.message
            : "Your business account record could not be loaded.",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [accountEmail, storageKey]);

  function updateDraft(field: keyof BusinessUpgradeDraft, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
    if (field === "companyName") {
      setSettlementVerification({ status: "idle", key: "" });
    }
    setFormError("");
  }

  function updateSettlement(field: BusinessSettlementField, value: string) {
    if (field === "settlementBankName") setSettlementBankName(value);
    if (field === "settlementAccountNumber") setSettlementAccountNumber(value);
    if (field === "settlementAccountName") setSettlementAccountName(value);
    setSettlementVerification({ status: "idle", key: "" });
    setFormError("");
  }

  async function verifyAccount() {
    const key = settlementKey(draft.companyName, settlementBankName, settlementAccountNumber);
    if (!draft.companyName.trim()) {
      setFormError("Enter the registered company name before verifying the account.");
      return;
    }
    if (!settlementBankName.trim()) {
      setFormError("Enter the settlement bank name before verifying the account.");
      return;
    }
    if (!/^\d{10}$/.test(settlementAccountNumber)) {
      setFormError("Settlement account number must contain 10 digits.");
      return;
    }
    setFormError("");
    setSettlementVerification({ status: "verifying", key });
    setVerifyingSettlementAccount(true);
    try {
      const result = await verifySettlementAccount({
        bankName: settlementBankName,
        accountNumber: settlementAccountNumber,
        businessName: draft.companyName,
      });
      setSettlementAccountName(result.accountName);
      setSettlementVerification({
        status: "verified",
        key,
        accountName: result.accountName,
        matchPercentage: result.matchPercentage,
      });
    } catch (requestError) {
      setSettlementVerification({ status: "failed", key });
      setFormError(
        requestError instanceof Error
          ? requestError.message
          : "Settlement account could not be verified.",
      );
    } finally {
      setVerifyingSettlementAccount(false);
    }
  }

  function updateFile(kind: BusinessDocumentKind, file: File | null) {
    if (!file) {
      if (kind === "certificate") setCertificate(null);
      if (kind === "directorIdentification") setDirectorIdentification(null);
      return;
    }
    if (!ALLOWED_DOCUMENT_TYPES.includes(file.type)) {
      setFormError("Documents must be PDF, JPG or PNG files.");
      return;
    }
    if (file.size < 1 || file.size > MAX_DOCUMENT_SIZE) {
      setFormError("Each document must be between 1 byte and 10 MB.");
      return;
    }
    setFormError("");
    if (kind === "certificate") setCertificate(file);
    if (kind === "directorIdentification") setDirectorIdentification(file);
  }

  async function save(action: "draft" | "submit") {
    setFormError("");
    if (action === "submit") {
      const hasCertificate =
        Boolean(certificate) ||
        hasBusinessUpgradeDocument(upgrade, "certificate_of_incorporation");
      const hasDirectorIdentification =
        Boolean(directorIdentification) ||
        hasBusinessUpgradeDocument(upgrade, "director_identification");
      if (!hasCertificate || !hasDirectorIdentification) {
        setFormError(
          "Attach the Certificate of Incorporation and director identification before submitting, or keep the previously saved documents.",
        );
        return;
      }
      if (!consent) {
        setFormError("Confirm the business details before submitting.");
        return;
      }
      if (
        settlementAccountNumber &&
        (settlementVerification.status !== "verified" ||
          settlementVerification.key !==
            settlementKey(draft.companyName, settlementBankName, settlementAccountNumber))
      ) {
        setFormError("Verify the settlement account before submitting.");
        return;
      }
    }
    setSaving(action);
    try {
      const result = await saveBusinessUpgrade({
        action,
        companyName: draft.companyName,
        registrationNumber: draft.registrationNumber,
        tin: draft.tin,
        companyEmail: draft.companyEmail,
        companyPhone: draft.companyPhone,
        position: draft.position,
        addressStreet: draft.addressStreet,
        addressCity: draft.addressCity,
        addressState: draft.addressState,
        settlementBankName,
        settlementAccountNumber,
        settlementAccountName,
        consent,
        certificate,
        directorIdentification,
      });
      setUpgrade(result.data);
      if (action === "submit") {
        clearBusinessUpgradeDraft(storageKey);
        setDraft(emptyBusinessUpgradeDraft);
        setHydratedStorageKey("");
        setSettlementBankName("");
        setSettlementAccountNumber("");
        setSettlementAccountName("");
        setSettlementVerification({ status: "idle", key: "" });
        setCertificate(null);
        setDirectorIdentification(null);
        setConsent(false);
      }
    } catch (requestError) {
      setFormError(
        requestError instanceof Error
          ? requestError.message
          : "Your business upgrade could not be saved.",
      );
    } finally {
      setSaving("");
    }
  }

  const accountStatus = upgrade?.account_status || "individual";
  const locked = isBusinessUpgradeLocked(upgrade?.status);

  return (
    <div className="mx-auto w-full max-w-[1080px] space-y-6 p-5 sm:p-8">
      <DashboardPageHeader
        kicker="ACCOUNT"
        title="Business upgrade"
        description="Submit your registered company details for Hollyway Admin verification."
        action={
          <Link
            className="inline-flex items-center gap-2 text-xs font-extrabold text-[#1453bb] hover:underline"
            href="/dashboard/profile"
          >
            Back to profile <Arrow />
          </Link>
        }
      />

      <BusinessUpgradeStatusIntro
        accountStatus={accountStatus}
        rejected={upgrade?.status === "rejected"}
        rejectionReason={upgrade?.rejection_reason}
      />

      {loadError && (
        <BusinessUpgradeLoadError
          message={loadError}
          onRetry={() => window.location.reload()}
        />
      )}

      {loading ? (
        <section className="rounded-xl border border-[#dfe4ed] bg-white p-6 text-sm text-[#53627a] dark:border-[#2a374e] dark:bg-[#121d30] dark:text-[#b7c3d6]">
          Loading your business account record…
        </section>
      ) : locked && upgrade ? (
        <BusinessUpgradeStatusPanel upgrade={upgrade} />
      ) : (
        <>
          <BusinessUpgradeForm
            draft={draft}
            settlementBankName={settlementBankName}
            settlementAccountNumber={settlementAccountNumber}
            settlementAccountName={settlementAccountName}
            savedSettlementLast4={upgrade?.settlement_account_last4}
            certificate={certificate}
            directorIdentification={directorIdentification}
            existingDocuments={upgrade?.documents || []}
            consent={consent}
            saving={saving}
            settlementVerification={settlementVerification}
            verifyingSettlementAccount={verifyingSettlementAccount}
            error={formError}
            onDraftChange={updateDraft}
            onSettlementChange={updateSettlement}
            onVerifySettlementAccount={() => void verifyAccount()}
            onFileChange={updateFile}
            onConsentChange={setConsent}
            onSaveDraft={() => void save("draft")}
            onSubmit={() => void save("submit")}
          />
        </>
      )}
    </div>
  );
}
